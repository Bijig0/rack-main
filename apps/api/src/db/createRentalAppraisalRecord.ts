import { RentalAppraisalData } from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";
import { generateFakeRentalAppraisalData } from "../server/generateFakeRentalAppraisalData";
import { db } from "./drizzle";
import { rentalAppraisalData } from "./schema";

interface CreateRentalAppraisalRecordArgs {
  id: string;
  data: RentalAppraisalData;
}

export async function createRentalAppraisalRecord({
  id,
  data,
}: CreateRentalAppraisalRecordArgs) {
  const result = await db
    .insert(rentalAppraisalData)
    .values({
      id,
      data: data as any, // Cast to any for JSONB
      status: "pending",
    })
    .returning();

  return result[0];
}

if (import.meta.main) {
  const sample = generateFakeRentalAppraisalData();

  console.log("Running test…");

  createRentalAppraisalRecord({
    id: crypto.randomUUID(),
    data: sample,
  })
    .then((row) => {
      console.log("Inserted row:");
      console.dir(row, { depth: null });
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error inserting test record:", err);
      process.exit(1);
    });
}
