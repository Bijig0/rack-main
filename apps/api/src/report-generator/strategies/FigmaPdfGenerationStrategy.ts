/**
 * Figma PDF Generation Strategy
 * Uses Figma templates and pdf-lib to generate PDFs
 */

import { figmaReader } from "../../figma-scrape/src/figmaReader";
import {
  populateUpdatableFields,
  fillFigmaObjectUpdatableFields,
} from "../../figma-scrape/src";
import { convertFigmaObjectToPdfLibObject } from "../../figma-scrape/figma-to-pdf";
import {
  FIGMA_ACCESS_TOKEN,
  FIGMA_PDF_DESIGN_FILE_URL,
} from "../../shared/config";
import type {
  PdfGenerationStrategy,
  PdfGenerationContext,
  PdfGenerationResult,
} from "./types";

export class FigmaPdfGenerationStrategy implements PdfGenerationStrategy {
  private figmaAccessToken: string;
  private figmaPdfDesignFileUrl: string;

  constructor(options?: {
    figmaAccessToken?: string;
    figmaPdfDesignFileUrl?: string;
  }) {
    this.figmaAccessToken = options?.figmaAccessToken || FIGMA_ACCESS_TOKEN;
    this.figmaPdfDesignFileUrl =
      options?.figmaPdfDesignFileUrl || FIGMA_PDF_DESIGN_FILE_URL;
  }

  getName(): string {
    return "FigmaPdfGenerationStrategy";
  }

  async generate(
    context: PdfGenerationContext
  ): Promise<PdfGenerationResult> {
    const { rentalAppraisalData } = context;

    // Step 1: Read Figma template
    const figmaFileObject = await figmaReader(
      this.figmaPdfDesignFileUrl,
      this.figmaAccessToken,
      {
        includeHidden: false,
      }
    );

    // Step 2: Populate fields with rental appraisal data
    const populatedFields = populateUpdatableFields(
      figmaFileObject.updatableFieldsSimple,
      rentalAppraisalData
    );

    // Step 3: Fill Figma object with populated data
    const updatedFigmaObj = fillFigmaObjectUpdatableFields(
      figmaFileObject,
      populatedFields
    );

    // Step 4: Convert Figma object to pdf-lib PDF document
    const pdfDoc = await convertFigmaObjectToPdfLibObject(updatedFigmaObj);

    // Step 5: Save to bytes
    const pdfBytes = await pdfDoc.save();

    return {
      pdfBytes,
      metadata: {
        pageCount: pdfDoc.getPageCount(),
        fileSize: pdfBytes.length,
        generatedAt: new Date(),
      },
    };
  }
}
