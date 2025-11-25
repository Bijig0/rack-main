/**
 * Generic PDF generation function using the Strategy Pattern
 *
 * This function delegates PDF generation to a strategy, allowing
 * different PDF generation approaches (Figma, pdfme, etc.)
 */

import type {
  PdfGenerationStrategy,
  PdfGenerationContext,
  PdfGenerationResult,
} from "../../strategies/types";

type Args = {
  context: PdfGenerationContext;
  strategy: PdfGenerationStrategy;
};

/**
 * Generate a PDF using the provided strategy
 *
 * @param context - The data context for PDF generation
 * @param strategy - The PDF generation strategy to use
 * @returns PDF generation result with bytes and metadata
 *
 * @example
 * ```typescript
 * import { FigmaPdfGenerationStrategy } from "../../strategies/FigmaPdfGenerationStrategy";
 * import { generatePdf } from "./generatePdf";
 *
 * const strategy = new FigmaPdfGenerationStrategy();
 * const result = await generatePdf({
 *   context: { rentalAppraisalData },
 *   strategy
 * });
 *
 * // Save PDF
 * fs.writeFileSync("output.pdf", result.pdfBytes);
 * ```
 */
const generatePdf = async ({
  context,
  strategy,
}: Args): Promise<PdfGenerationResult> => {
  return await strategy.generate(context);
};

export default generatePdf;
