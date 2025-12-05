import { RentalAppraisalData } from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";
import { generateFakeRentalAppraisalData } from "../server/generateFakeRentalAppraisalData";
import { db } from "./drizzle";
import { property, appraisal } from "./schema";

interface CreateRentalAppraisalRecordArgs {
  id: string;
  data: RentalAppraisalData;
}

/**
 * Creates a property record and its associated appraisal record.
 * Extracts core property fields from the appraisal data for fast list queries.
 */
export async function createRentalAppraisalRecord({
  id,
  data,
}: CreateRentalAppraisalRecordArgs) {
  // Extract property image URL
  const propertyImage = data.propertyInfo?.propertyImage;
  const propertyImageUrl = typeof propertyImage === 'string'
    ? propertyImage
    : propertyImage?.url ?? null;

  // Extract land area value
  const landArea = data.propertyInfo?.landArea;
  const landAreaSqm = typeof landArea === 'object' && landArea?.value
    ? String(landArea.value)
    : null;

  // Create property record first
  const propertyId = crypto.randomUUID();
  await db.insert(property).values({
    id: propertyId,
    addressCommonName: data.coverPageData?.addressCommonName ?? 'Unknown Address',
    bedroomCount: data.propertyInfo?.bedroomCount ?? null,
    bathroomCount: data.propertyInfo?.bathroomCount ?? null,
    propertyType: data.propertyInfo?.propertyType ?? null,
    landAreaSqm,
    propertyImageUrl,
  });

  // Create appraisal record linked to property
  const result = await db
    .insert(appraisal)
    .values({
      id,
      propertyId,
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
