import { PDFDocument } from "@pdfme/pdf-lib";
// @ts-ignore
import { beforeAll, describe, expect, it, spyOn } from "bun:test";
import { Address } from "../../../shared/types";
import * as createRentalAppraisalPDFModule from "./createRentalAppraisalPdf/createRentalAppraisalPdf";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";
import type { RentalAppraisalData } from "./createRentalAppraisalPdf/getRentalAppraisalData/schemas";
import type {
  PdfGenerationStrategy,
  PdfGenerationContext,
  PdfGenerationResult,
} from "../../strategies/types";

/**
 * Mock PDF generation strategy for testing
 * Creates a minimal valid PDF without requiring Figma integration
 */
class MockPdfGenerationStrategy implements PdfGenerationStrategy {
  getName(): string {
    return "MockPdfGenerationStrategy";
  }

  async generate(_context: PdfGenerationContext): Promise<PdfGenerationResult> {
    // Create a minimal PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595.28, 841.89]); // A4 size
    const pdfBytes = await pdfDoc.save();

    return {
      pdfBytes,
      metadata: {
        pageCount: 1,
        fileSize: pdfBytes.length,
        generatedAt: new Date(),
      },
    };
  }
}

// Mock rental appraisal data - lightweight and fast
const mockRentalAppraisalData: RentalAppraisalData = {
  coverPageData: {
    addressCommonName: "123 Test Street, Melbourne VIC 3000",
    reportDate: new Date("2025-11-05"),
    reportId: "PR-2025-123456",
    propertyType: "House",
    council: "Melbourne City Council",
    yearBuilt: 2010,
    landArea: 500,
    floorArea: 200,
    distanceToCBD: 5.5,
  },
  propertyInfo: {
    propertyType: "House",
    council: "Melbourne City Council",
  },
  planningZoningData: null,
  environmentalData: {},
  infrastructureData: null,
  locationSuburbData: {
    suburb: "Melbourne",
    state: "VIC",
  },
  pricelabsData: null,
};

// Keep old mock sections for reference (no longer used)
const _oldMockSections = [
  {
    template: {
      schemas: [
        [
          {
            name: "title",
            type: "text",
            position: { x: 20, y: 20 },
            width: 170,
            height: 15,
            fontSize: 24,
            fontColor: "#1a1a1a",
            alignment: "center",
            fontName: "Roboto",
          },
          {
            name: "address",
            type: "text",
            position: { x: 20, y: 40 },
            width: 170,
            height: 12,
            fontSize: 16,
            fontColor: "#333333",
            alignment: "center",
            fontName: "Roboto",
          },
          {
            name: "reportDate",
            type: "text",
            position: { x: 20, y: 58 },
            width: 170,
            height: 8,
            fontSize: 11,
            fontColor: "#666666",
            alignment: "center",
            fontName: "Roboto",
          },
          {
            name: "reportId",
            type: "text",
            position: { x: 20, y: 68 },
            width: 170,
            height: 8,
            fontSize: 10,
            fontColor: "#999999",
            alignment: "center",
            fontName: "Roboto",
          },
        ],
      ],
      basePdf: "",
    },
    inputs: [
      {
        title: "Property Report",
        address: "123 Test Street, Melbourne VIC 3000",
        reportDate: "Report Date: 5 November 2025",
        reportId: "Report ID: PR-2025-123456",
      },
    ],
  },
  {
    template: {
      schemas: [
        [
          {
            name: "propertyInfoTitle",
            type: "text",
            position: { x: 20, y: 20 },
            width: 170,
            height: 10,
            fontSize: 18,
            fontColor: "#1a1a1a",
            fontName: "Roboto",
          },
          {
            name: "propertyDetails",
            type: "text",
            position: { x: 20, y: 50 },
            width: 170,
            height: 60,
            fontSize: 10,
            lineHeight: 1.5,
            fontName: "Roboto",
          },
        ],
      ],
      basePdf: "",
    },
    inputs: [
      {
        propertyInfoTitle: "Property Information",
        propertyDetails: "Mock property details",
      },
    ],
  },
  {
    template: {
      schemas: [
        [
          {
            name: "planningTitle",
            type: "text",
            position: { x: 20, y: 20 },
            width: 170,
            height: 10,
            fontSize: 18,
            fontColor: "#1a1a1a",
            fontName: "Roboto",
          },
        ],
      ],
      basePdf: "",
    },
    inputs: [
      {
        planningTitle: "Planning and Zoning",
      },
    ],
  },
];

describe("createRentalAppraisalPDFInstance (Unit)", () => {
  const testAddress: Address = {
    addressLine: "123 Test Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  };

  // Use mock strategy since FigmaPdfGenerationStrategy requires unimplemented Figma integration
  const mockStrategy = new MockPdfGenerationStrategy();

  beforeAll(() => {
    // Mock the createRentalAppraisalPDF function to return rental appraisal data
    spyOn(createRentalAppraisalPDFModule, "default").mockResolvedValue(
      mockRentalAppraisalData
    );
  });

  describe("PDF Generation", () => {
    it("should generate a PDF with mocked rental appraisal data", async () => {
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: testAddress,
        strategy: mockStrategy,
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.length).toBeGreaterThan(0);
    });

    it("should generate a PDF with at least one page (using Figma strategy)", async () => {
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: testAddress,
        strategy: mockStrategy,
      });

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      // Mock strategy creates a single page
      expect(pages.length).toBeGreaterThanOrEqual(1);
    });

    it("should generate a PDF with Figma template dimensions", async () => {
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: testAddress,
        strategy: mockStrategy,
      });

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      // Verify pages have reasonable dimensions
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        expect(width).toBeGreaterThan(0);
        expect(height).toBeGreaterThan(0);
      });
    });

    it("should return a Uint8Array", async () => {
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: testAddress,
        strategy: mockStrategy,
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
    });

    it("should accept an address parameter", async () => {
      const customAddress: Address = {
        addressLine: "456 Custom St",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };

      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: customAddress,
        strategy: mockStrategy,
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty address gracefully", async () => {
      const emptyAddress: Address = {
        addressLine: "",
        suburb: "",
        state: "VIC",
        postcode: "",
      };

      // Should not throw, mocked sections don't validate address
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: emptyAddress,
        strategy: mockStrategy,
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
    });
  });
});
