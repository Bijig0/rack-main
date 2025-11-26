import type { Address } from "../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { ZoneCode } from "./types";

type Args = {
  address: Address;
};

type ZoneCodeData = {
  zoneCode: ZoneCode;
}

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
}: Args): Promise<ZoneCodeData> => {
  const { planningZoneData } = await getPlanningZoneData({ address });
  const zoneCode = planningZoneData?.zoneCode ?? null;
  return { zoneCode };
}; 

export default getZoneCode;
