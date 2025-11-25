/**
 * Pdfme PDF Generation Strategy
 * Uses pdfme library to generate PDFs from sections
 */

import { getDefaultFont } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import convertSectionsToTemplateAndInputs from "../createRentalAppraisalPdfInstance/convertSectionsToTemplateAndInputs/convertSectionsToTemplateAndInputs";
import type { Sections } from "../types";
import type {
  PdfGenerationStrategy,
  PdfGenerationContext,
  PdfGenerationResult,
} from "./types";

/**
 * Function type to create sections from rental appraisal data
 * This is passed in as a dependency to decouple from specific section creation logic
 */
export type CreateSectionsFunction = (
  context: PdfGenerationContext
) => Promise<Sections>;

export class PdfmePdfGenerationStrategy implements PdfGenerationStrategy {
  private createSections: CreateSectionsFunction;

  constructor(createSections: CreateSectionsFunction) {
    this.createSections = createSections;
  }

  getName(): string {
    return "PdfmePdfGenerationStrategy";
  }

  async generate(
    context: PdfGenerationContext
  ): Promise<PdfGenerationResult> {
    // Step 1: Create sections from rental appraisal data
    const sections = await this.createSections(context);

    // Step 2: Convert sections to pdfme template and inputs
    const { template, inputs } = await convertSectionsToTemplateAndInputs({
      sections,
    });

    // Step 3: Generate PDF using pdfme
    const font = getDefaultFont();
    const pdf = await generate({ template, inputs, options: { font } });

    const pdfBytes = new Uint8Array(pdf);

    return {
      pdfBytes,
      metadata: {
        // pdfme doesn't provide page count directly
        fileSize: pdfBytes.length,
        generatedAt: new Date(),
      },
    };
  }
}
