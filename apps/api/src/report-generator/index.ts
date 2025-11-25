import { writeFile } from "fs/promises";
import { Address } from "../shared/types";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance";

const defaultAddress = {
  addressLine: "123 Collins Street",
  suburb: "Melbourne",
  state: "VIC",
  postcode: "3000",
} satisfies Address;

type Args = {
  address?: Address;
};

async function main({ address }: Args): Promise<void> {
  const targetAddress = address || defaultAddress;

  // Generate Property Report PDF
  console.log("Generating Property Report PDF...");
  console.log("Address:", JSON.stringify(targetAddress, null, 2));

  const propertyReportPdf = await createRentalAppraisalPDFInstance({
    address: targetAddress,
  });

  await writeFile("./property-report.pdf", propertyReportPdf);
  console.log(
    "Property Report PDF generated successfully: ./property-report.pdf"
  );
}

// Run if executed directly
// @ts-ignore
if (import.meta.main) {
  main({});
}
