import { Address } from "../../../../shared/types";
import getRentalAppraisalData from "./getRentalAppraisalData/getRentalAppraisalData";
import type { RentalAppraisalData } from "./getRentalAppraisalData/schemas";

type Args = {
  address: Address;
};

/**
 * Fetch rental appraisal data for a given address
 * This function is now decoupled from PDF generation logic
 *
 * @param address - The property address
 * @returns RentalAppraisalData - The data needed for PDF generation
 */
const createRentalAppraisalPDF = async ({
  address,
}: Args): Promise<RentalAppraisalData> => {
  // Fetch all rental appraisal data
  const { rentalAppraisalData } = await getRentalAppraisalData({ address });

  return rentalAppraisalData;
};

if (import.meta.main) {
  // Keep process alive until we're done
  const keepAlive = setInterval(() => {}, 1000);

  process.on('beforeExit', () => {
    console.log('beforeExit event');
  });

  process.on('exit', (code) => {
    console.log(`exit event with code ${code}`);
  });

  try {
    console.log("🚀 Starting main...");
    const rentalAppraisalData = await createRentalAppraisalPDF({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    });

    console.log("📊 Rental appraisal data received!");
    console.log(JSON.stringify(rentalAppraisalData, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    clearInterval(keepAlive);
    console.log("✅ Main complete");
  }
}

export default createRentalAppraisalPDF;
