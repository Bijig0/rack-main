import createRentalAppraisalPDF from "./src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createRentalAppraisalPdf";
import convertSectionsToTemplateAndInputs from "./src/report-generator/createRentalAppraisalPdfInstance/convertSectionsToTemplateAndInputs/convertSectionsToTemplateAndInputs";
import { generate } from "@pdfme/generator";
import { getDefaultFont } from "@pdfme/common";
import { PDFDocument } from "@pdfme/pdf-lib";

const address = {
  address: "123 Collins Street",
  suburb: "Melbourne",
  state: "VIC",
  postcode: "3000",
};

(async () => {
  console.log("Step 1: Creating sections...");
  const sections = await createRentalAppraisalPDF({ address });
  console.log(`Created ${sections.length} sections`);

  console.log("\nStep 2: Checking section structure...");
  sections.forEach((section, i) => {
    console.log(`\nSection ${i + 1}:`);
    console.log(`  schemas: ${JSON.stringify(section.template.schemas).substring(0, 100)}...`);
    console.log(`  schemas length: ${section.template.schemas.length}`);
    console.log(`  schemas[0] is array: ${Array.isArray(section.template.schemas[0])}`);
    console.log(`  inputs length: ${section.inputs.length}`);
  });

  console.log("\nStep 3: Converting to template...");
  const { template, inputs } = await convertSectionsToTemplateAndInputs({ sections });
  console.log(`  Combined schemas length: ${template.schemas.length}`);
  console.log(`  Combined inputs length: ${inputs.length}`);

  console.log("\nStep 4: Checking combined template structure...");
  template.schemas.forEach((schema, i) => {
    console.log(`\nSchema ${i + 1}:`);
    console.log(`  is array: ${Array.isArray(schema)}`);
    console.log(`  length/keys: ${Array.isArray(schema) ? schema.length : Object.keys(schema).length}`);
    if (Array.isArray(schema)) {
      console.log(`  first field name: ${schema[0]?.name}`);
    } else {
      console.log(`  first key: ${Object.keys(schema)[0]}`);
    }
  });

  console.log("\nStep 5: Generating PDF...");
  const font = getDefaultFont();
  const pdf = await generate({ template, inputs, options: { font } });

  console.log("\nStep 6: Checking generated PDF...");
  const pdfDoc = await PDFDocument.load(pdf);
  const pages = pdfDoc.getPages();
  console.log(`  PDF has ${pages.length} pages`);
})();
