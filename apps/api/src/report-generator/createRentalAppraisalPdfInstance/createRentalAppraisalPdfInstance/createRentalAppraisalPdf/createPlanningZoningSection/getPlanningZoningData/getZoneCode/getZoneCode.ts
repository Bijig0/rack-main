import type { Address } from "../../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";

type Args = {
  address: Address;
};

/**
 * Gets the zone code for an address.
 *
 * Uses the shared cache from getPlanningZoneData, so if getPlanningZoneData
 * has already been called for this address, no additional WFS call is made.
 *
 * @param address - The property address
 * @returns The zone code (e.g., "GRZ2", "RGZ1", "NRZ1") or null if not available
 */
export const getZoneCode = async ({
  address,
}: Args): Promise<string | null> => {
  const { planningZoneData } = await getPlanningZoneData({ address });
  return planningZoneData?.zoneCode ?? null;
};

export default getZoneCode;
