import { PDFDocument, StandardFonts, rgb } from "@pdfme/pdf-lib";

let cachedSinglePageBlankPdf: string | null = null;

/**
 * Creates a blank PDF with the specified number of pages
 * @param pageCount - Number of blank pages to create
 * @returns Base64-encoded PDF string
 */
export async function createBlankPdf(pageCount: number): Promise<string> {
  // For single page, use cached version
  if (pageCount === 1 && cachedSinglePageBlankPdf) {
    return cachedSinglePageBlankPdf;
  }

  const pdfDoc = await PDFDocument.create();

  // Add the specified number of blank A4 pages
  for (let i = 0; i < pageCount; i++) {
    // A4 size in points: 595.28 x 841.89
    const page = pdfDoc.addPage([595.28, 841.89]);

    // Add a tiny transparent text to ensure the page has content streams
    // This prevents "missing page contents" errors when embedding
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(" ", {
      x: 0,
      y: 0,
      size: 1,
      font,
      color: rgb(1, 1, 1),
      opacity: 0,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const base64 = Buffer.from(pdfBytes).toString("base64");
  const result = `data:application/pdf;base64,${base64}`;

  // Cache single page version
  if (pageCount === 1) {
    cachedSinglePageBlankPdf = result;
  }

  return result;
}
