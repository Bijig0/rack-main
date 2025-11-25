/**
 * Domain types for PDF generation - independent of any PDF library
 * These types define the contract that all PDF generation strategies must fulfill
 */

import type { RentalAppraisalData } from "../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";

/**
 * The data context required for PDF generation
 * This is passed to the strategy along with the rental appraisal data
 */
export interface PdfGenerationContext {
  rentalAppraisalData: RentalAppraisalData;
  // Future: could add configuration options here
  // options?: PdfGenerationOptions;
}

/**
 * The result of PDF generation
 */
export interface PdfGenerationResult {
  pdfBytes: Uint8Array;
  metadata?: {
    pageCount?: number;
    fileSize?: number;
    generatedAt?: Date;
  };
}

/**
 * PDF Generation Strategy Interface
 * All PDF generation strategies must implement this interface
 */
export interface PdfGenerationStrategy {
  /**
   * Generate a PDF from rental appraisal data
   *
   * @param context - The data context containing rental appraisal data
   * @returns Promise resolving to PDF bytes
   */
  generate(context: PdfGenerationContext): Promise<PdfGenerationResult>;

  /**
   * Optional: Get strategy name for logging/debugging
   */
  getName(): string;
}
