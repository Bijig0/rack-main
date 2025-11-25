import { generate } from "@pdfme/generator";
import { getDefaultFont } from "@pdfme/common";
import { createBlankPdf } from "./src/report-generator/createRentalAppraisalPdfInstance/createBlankPdf";
import { PDFDocument } from "@pdfme/pdf-lib";
import fs from "fs";

(async () => {
  const basePdf = await createBlankPdf(3);

  const template = {
    basePdf,
    schemas: [
      [{ name: "title", type: "text", position: { x: 20, y: 20 }, width: 100, height: 10 }],
      [{ name: "content", type: "text", position: { x: 20, y: 20 }, width: 100, height: 10 }],
      [{ name: "footer", type: "text", position: { x: 20, y: 20 }, width: 100, height: 10 }],
    ],
  };

  const inputs = [
    { title: "Page 1" },
    { content: "Page 2" },
    { footer: "Page 3" },
  ];

  console.log("Template schemas length:", template.schemas.length);
  console.log("Inputs length:", inputs.length);

  const font = getDefaultFont();
  const pdf = await generate({ template, inputs, options: { font } });

  const pdfDoc = await PDFDocument.load(pdf);
  console.log("Generated PDF pages:", pdfDoc.getPageCount());

  fs.writeFileSync("test-exact.pdf", pdf);
  console.log("Saved to test-exact.pdf");
})();
