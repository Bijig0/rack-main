import fs from 'fs';

const files = [
  '/Users/a61403/Desktop/barry/appraisal-pdf-generator-script/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/createPropertyInfoSection.ts',
  '/Users/a61403/Desktop/barry/appraisal-pdf-generator-script/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createEnvironmentalSection/createEnvironmentalSection.ts',
  '/Users/a61403/Desktop/barry/appraisal-pdf-generator-script/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createInfrastructureSection/createInfrastructureSection.ts',
  '/Users/a61403/Desktop/barry/appraisal-pdf-generator-script/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createLocationSuburbSection/createLocationSuburbSection.ts',
  '/Users/a61403/Desktop/barry/appraisal-pdf-generator-script/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPricelabsSection/createPricelabsSection.ts',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  console.log(`Processing: ${file.split('/').pop()}`);
  console.log(`  Has schemaObj: ${content.includes('schemaObj')}`);
  console.log(`  Has schemaArray: ${content.includes('schemaArray')}`);
});
