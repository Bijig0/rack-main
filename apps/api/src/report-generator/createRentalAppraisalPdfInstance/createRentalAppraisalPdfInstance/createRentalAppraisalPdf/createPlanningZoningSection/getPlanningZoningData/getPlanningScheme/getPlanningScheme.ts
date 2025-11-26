import { titleCase } from "title-case";
import type { Address } from "../../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";

type Args = {
  address: Address;
};

/**
 * Gets the planning scheme name for an address.
 *
 * Planning schemes in Victoria are named after the LGA, e.g.:
 * - "Boroondara Planning Scheme"
 * - "Melbourne Planning Scheme"
 * - "Greater Geelong Planning Scheme"
 *
 * Uses the shared cache from getPlanningZoneData, so if getPlanningZoneData
 * has already been called for this address, no additional WFS call is made.
 *
 * @param address - The property address
 * @returns The planning scheme name (e.g., "Boroondara Planning Scheme") or null if not available
 */
export const getPlanningScheme = async ({
  address,
}: Args): Promise<string | null> => {
  const { planningZoneData } = await getPlanningZoneData({ address });

  if (!planningZoneData?.lgaName) {
    return null;
  }

  const cleanedLgaName = titleCase(
    planningZoneData.lgaName.toLocaleLowerCase()
  );

  return `${cleanedLgaName} Planning Scheme`;
};

export default getPlanningScheme;

if (import.meta.main) {
  const planningScheme = await getPlanningScheme({
    address: {
      addressLine: "123 Collins Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    },
  });
  console.log({ planningScheme });
}
