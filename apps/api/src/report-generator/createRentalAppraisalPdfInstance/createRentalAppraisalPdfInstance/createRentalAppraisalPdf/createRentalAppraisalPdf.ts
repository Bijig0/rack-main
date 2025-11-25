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
  const rentalAppraisalData = await createRentalAppraisalPDF({
    address: {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log({ rentalAppraisalData }, { depth: null, colors: true });
}

export default createRentalAppraisalPDF;
