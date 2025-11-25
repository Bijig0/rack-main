import { Address } from "../../../shared/types";
import createRentalAppraisalPDF from "./createRentalAppraisalPdf/createRentalAppraisalPdf";
import type { PdfGenerationStrategy } from "../../strategies/types";
import { FigmaPdfGenerationStrategy } from "../../strategies/FigmaPdfGenerationStrategy";

type Args = {
  address: Address;
  strategy?: PdfGenerationStrategy;
};

/**
 * Creates a PDF for a rental appraisal using the Strategy Pattern
 *
 * @param address - The property address
 * @param strategy - PDF generation strategy (defaults to FigmaPdfGenerationStrategy)
 * @returns Uint8Array - The PDF bytes
 *
 * @example
 * ```typescript
 * // Use default Figma strategy
 * const pdf = await createRentalAppraisalPDFInstance({ address });
 *
 * // Use custom strategy
 * import { PdfmePdfGenerationStrategy } from "../../strategies/PdfmePdfGenerationStrategy";
 * const pdfmeStrategy = new PdfmePdfGenerationStrategy(createSections);
 * const pdf = await createRentalAppraisalPDFInstance({ address, strategy: pdfmeStrategy });
 * ```
 */
const createRentalAppraisalPDFInstance = async ({
  address,
  strategy = new FigmaPdfGenerationStrategy(), // Default to Figma strategy
}: Args): Promise<Uint8Array> => {
  // Step 1: Fetch rental appraisal data
  const rentalAppraisalData = await createRentalAppraisalPDF({ address });

  // Step 2: Generate PDF using the selected strategy
  const result = await strategy.generate({ rentalAppraisalData });

  console.log(`PDF generated using ${strategy.getName()}`);
  if (result.metadata) {
    console.log(`  Pages: ${result.metadata.pageCount || "unknown"}`);
    console.log(`  Size: ${(result.metadata.fileSize || 0) / 1024} KB`);
  }

  return result.pdfBytes;
};

export default createRentalAppraisalPDFInstance;
