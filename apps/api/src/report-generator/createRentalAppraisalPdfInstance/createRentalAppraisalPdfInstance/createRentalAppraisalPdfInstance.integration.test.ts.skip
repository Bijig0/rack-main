import { PDFDocument } from "@pdfme/pdf-lib";
// @ts-ignore
import { describe, expect, it } from "bun:test";
import { Address } from "../../../shared/types";
import convertSectionsToTemplateAndInputs from "../convertSectionsToTemplateAndInputs/convertSectionsToTemplateAndInputs";
import createRentalAppraisalPDF from "./createRentalAppraisalPdf/createRentalAppraisalPdf";
import { expectedSectionsData } from "../expectedSectionData";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";

// Increase timeout for tests that make real WFS API calls
const TEST_TIMEOUT = 15000; // 15 seconds

describe("createRentalAppraisalPDFInstance", () => {
  // Use a real address so geocoding works for planning/zoning data
  const testAddress: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  describe("PDF Structure Validation", () => {
    it(
      "should generate a PDF with correct number of pages",
      async () => {
        const pdfBytes = await createRentalAppraisalPDFInstance({
          address: testAddress,
        });

        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();

        // We expect 7 pages (excluding floor plan which returns null in mock)
        // Cover (with Executive Summary) + Property Info + Planning + Environmental + Infrastructure + Location + Pricelabs
        expect(pages.length).toBe(7);
      },
      TEST_TIMEOUT
    );

    it("should have correct page dimensions (A4)", async () => {
      const pdfBytes = await createRentalAppraisalPDFInstance({
        address: testAddress,
      });

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        // A4 dimensions: 595.28 x 841.89 points
        expect(width).toBeCloseTo(595.28, 1);
        expect(height).toBeCloseTo(841.89, 1);
      });
    });
  });

  describe("Section Validation", () => {
    it(
      "should generate correct number of sections",
      async () => {
        const sections = await createRentalAppraisalPDF({
          address: testAddress,
        });

        // We expect 7 sections (floor plan returns null, Executive Summary merged into Cover Page)
        expect(sections.length).toBe(7);
      },
      TEST_TIMEOUT
    );

    it(
      "should have headers present on each page",
      async () => {
        const sections = await createRentalAppraisalPDF({
          address: testAddress,
        });
        const { template, inputs } = await convertSectionsToTemplateAndInputs({
          sections,
        });

        // Check each section has the expected header field
        sections.forEach((section, index) => {
          const expectedSection = expectedSectionsData[index];

          // Check that the section has a schema
          expect(section.template.schemas).toBeDefined();
          expect(section.template.schemas.length).toBeGreaterThan(0);

          // Check that the section has inputs
          expect(section.inputs).toBeDefined();
          expect(section.inputs.length).toBeGreaterThan(0);

          if (expectedSection.headerField) {
            // Check that the schema defines the header field (array format)
            const schemaPageArray = section.template.schemas[0];
            const headerField = schemaPageArray.find(
              (field: any) => field.name === expectedSection.headerField
            );
            expect(headerField).toBeDefined();

            // Check that the input has the header field with expected text
            const inputPage = section.inputs[0];
            expect(inputPage[expectedSection.headerField]).toBeDefined();

            if (expectedSection.expectedHeaderText) {
              expect(inputPage[expectedSection.headerField]).toBe(
                expectedSection.expectedHeaderText
              );
            }
          }
        });
      },
      TEST_TIMEOUT
    );

    it(
      "should have all required fields for each section",
      async () => {
        const sections = await createRentalAppraisalPDF({
          address: testAddress,
        });

        sections.forEach((section, index) => {
          const expectedSection = expectedSectionsData[index];

          const schemaPageArray = section.template.schemas[0];
          const inputPage = section.inputs[0];

          // Check all required fields are present in schema (array format)
          expectedSection.requiredFields.forEach((fieldName) => {
            const field = schemaPageArray.find(
              (f: any) => f.name === fieldName
            );
            expect(field).toBeDefined();
            expect(inputPage[fieldName]).toBeDefined();
          });
        });
      },
      TEST_TIMEOUT
    );

    it("should have correct data types for each field", async () => {
      const sections = await createRentalAppraisalPDF({ address: testAddress });

      sections.forEach((section) => {
        const schemaPageArray = section.template.schemas[0];
        const inputPage = section.inputs[0];

        // Check schema structure (array format)
        schemaPageArray.forEach((fieldSchema: any) => {
          expect(fieldSchema.name).toBeDefined();
          expect(fieldSchema.type).toBeDefined();
          expect(fieldSchema.position).toBeDefined();
          expect(fieldSchema.width).toBeDefined();
          expect(fieldSchema.height).toBeDefined();
        });

        // Check input values are strings or numbers (not undefined/null)
        Object.entries(inputPage).forEach(([key, value]) => {
          expect(value).toBeDefined();
          expect(typeof value).toMatch(/string|number/);
        });
      });
    });

    it(
      "should maintain section order",
      async () => {
        const sections = await createRentalAppraisalPDF({
          address: testAddress,
        });

        // Check section order from the sections themselves
        const sectionTitles = sections.map((section) => {
          const input = section.inputs[0];
          return (
            input.title ||
            input.propertyInfoTitle ||
            input.planningTitle ||
            input.environmentalTitle ||
            input.infrastructureTitle ||
            input.locationTitle ||
            input.pricelabsTitle ||
            "Unknown"
          );
        });

        expect(sectionTitles[0]).toBe("Property Report"); // Cover Page (with Executive Summary)
        expect(sectionTitles[1]).toBe("Property Information");
        expect(sectionTitles[2]).toBe("Planning and Zoning");
        expect(sectionTitles[3]).toBe(
          "Environmental and Planning Considerations"
        );
        expect(sectionTitles[4]).toBe("Infrastructure Considerations");
        expect(sectionTitles[5]).toBe("Location and Suburb Analysis");
        expect(sectionTitles[6]).toBe("Pricelabs Rental Estimate");
      },
      TEST_TIMEOUT
    );

    it(
      "should include address information in cover page",
      async () => {
        const sections = await createRentalAppraisalPDF({
          address: testAddress,
        });
        const coverPageSection = sections[0];

        const inputPage = coverPageSection.inputs[0];

        expect(inputPage.address).toContain(testAddress.addressLine);
        expect(inputPage.address).toContain(testAddress.suburb);
        expect(inputPage.address).toContain(testAddress.state);
        expect(inputPage.address).toContain(testAddress.postcode);
      },
      TEST_TIMEOUT
    );

    it(
      "should have unique report ID in cover page",
      async () => {
        const sections1 = await createRentalAppraisalPDF({
          address: testAddress,
        });
        const sections2 = await createRentalAppraisalPDF({
          address: testAddress,
        });

        const reportId1 = sections1[0].inputs[0].reportId;
        const reportId2 = sections2[0].inputs[0].reportId;

        // Report IDs should be different (they include random component)
        expect(reportId1).not.toBe(reportId2);

        // Both should match the expected format: "Report ID: PR-YYYY-XXXXXX"
        expect(reportId1).toMatch(/Report ID: PR-\d{4}-\d{6}/);
        expect(reportId2).toMatch(/Report ID: PR-\d{4}-\d{6}/);
      },
      TEST_TIMEOUT * 2
    ); // Double timeout since this test calls createRentalAppraisalPDF twice

    it("should combine schemas and inputs correctly", async () => {
      const sections = await createRentalAppraisalPDF({ address: testAddress });
      const { template, inputs } = await convertSectionsToTemplateAndInputs({
        sections,
      });

      // Number of schemas should equal number of sections
      expect(template.schemas.length).toBe(sections.length);

      // Should have ONE merged input object (one complete document)
      expect(inputs.length).toBe(1);

      // The single input should contain all fields from all schemas
      const allSchemaFieldNames = template.schemas.flatMap(
        (schemaPageArray: any) =>
          schemaPageArray.map((field: any) => field.name)
      );
      const inputFields = Object.keys(inputs[0]);

      // All schema fields should have corresponding input values
      allSchemaFieldNames.forEach((fieldName: string) => {
        expect(inputFields).toContain(fieldName);
      });
    });
  });

  describe("basePdf Validation", () => {
    it("should use a valid basePdf", async () => {
      const sections = await createRentalAppraisalPDF({ address: testAddress });
      const { template } = await convertSectionsToTemplateAndInputs({
        sections,
      });

      expect(template.basePdf).toBeDefined();
      expect(typeof template.basePdf).toBe("string");
      expect(template.basePdf).toMatch(/^data:application\/pdf;base64,/);
    }, 10000);
  });
});
