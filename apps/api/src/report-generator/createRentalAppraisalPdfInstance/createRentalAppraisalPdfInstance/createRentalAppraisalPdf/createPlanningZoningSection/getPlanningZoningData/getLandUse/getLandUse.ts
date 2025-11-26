import type { Address } from "../../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";

type Args = {
  address: Address;
};

/**
 * Victorian Planning Zone to Land Use mapping
 *
 * Based on the Victorian Planning Provisions zone categories:
 * https://www.planning.vic.gov.au/guides-and-resources/guides/all-guides/understanding-zones
 */

/**
 * Determines the land use category from a zone code
 */
function getLandUseFromZoneCode(zoneCode: string): string | null {
  const code = zoneCode.toUpperCase();

  // Residential Zones
  if (
    code.startsWith("GRZ") || // General Residential Zone
    code.startsWith("NRZ") || // Neighbourhood Residential Zone
    code.startsWith("RGZ") || // Residential Growth Zone
    code.startsWith("LDRZ") || // Low Density Residential Zone
    code.startsWith("MUZ") || // Mixed Use Zone
    code.startsWith("TZ") || // Township Zone
    code.includes("RESIDENTIAL")
  ) {
    return "Residential";
  }

  // Commercial Zones
  if (
    code.startsWith("C1Z") || // Commercial 1 Zone
    code.startsWith("C2Z") || // Commercial 2 Zone
    code.startsWith("C3Z") || // Commercial 3 Zone
    code.startsWith("ACZ") || // Activity Centre Zone
    code.includes("COMMERCIAL")
  ) {
    return "Commercial";
  }

  // Industrial Zones
  if (
    code.startsWith("IN1Z") || // Industrial 1 Zone
    code.startsWith("IN2Z") || // Industrial 2 Zone
    code.startsWith("IN3Z") || // Industrial 3 Zone
    code.startsWith("IZ") || // Legacy Industrial Zone
    code.includes("INDUSTRIAL")
  ) {
    return "Industrial";
  }

  // Rural Zones
  if (
    code.startsWith("FZ") || // Farming Zone
    code.startsWith("RAZ") || // Rural Activity Zone
    code.startsWith("RLZ") || // Rural Living Zone
    code.startsWith("RCZ") || // Rural Conservation Zone
    code.startsWith("GWZ") || // Green Wedge Zone
    code.startsWith("GWAZ") || // Green Wedge A Zone
    code.includes("FARMING") ||
    code.includes("RURAL")
  ) {
    return "Rural";
  }

  // Public Land Zones
  if (
    code.startsWith("PUZ") || // Public Use Zone
    code.startsWith("PPRZ") || // Public Park and Recreation Zone
    code.startsWith("PCRZ") || // Public Conservation and Resource Zone
    code.startsWith("RDZ") || // Road Zone
    code.includes("PUBLIC")
  ) {
    return "Public Use";
  }

  // Special Purpose Zones
  if (
    code.startsWith("SUZ") || // Special Use Zone
    code.startsWith("CDZ") || // Comprehensive Development Zone
    code.startsWith("UFZ") || // Urban Floodway Zone
    code.startsWith("CCZ") || // Capital City Zone
    code.startsWith("DZ") || // Docklands Zone
    code.startsWith("PDZ") || // Priority Development Zone
    code.includes("SPECIAL")
  ) {
    return "Special Purpose";
  }

  // Transport Zone
  if (
    code.startsWith("TRZ") || // Transport Zone
    code.startsWith("RDZ") || // Road Zone
    code.includes("TRANSPORT") ||
    code.includes("ROAD")
  ) {
    return "Transport";
  }

  // Open Space / Recreation
  if (
    code.startsWith("PPRZ") || // Public Park and Recreation Zone
    code.includes("PARK") ||
    code.includes("RECREATION")
  ) {
    return "Public Park and Recreation";
  }

  return null;
}

/**
 * Gets the land use category for an address.
 *
 * Land use categories in Victoria include:
 * - "Residential"
 * - "Commercial"
 * - "Industrial"
 * - "Rural"
 * - "Public Use"
 * - "Special Purpose"
 * - "Transport"
 * - "Public Park and Recreation"
 *
 * Uses the shared cache from getPlanningZoneData, so if getPlanningZoneData
 * has already been called for this address, no additional WFS call is made.
 *
 * @param address - The property address
 * @returns The land use category or null if not available
 */
export const getLandUse = async ({
  address,
}: Args): Promise<string | null> => {
  const { planningZoneData } = await getPlanningZoneData({ address });

  if (!planningZoneData?.zoneCode) {
    return null;
  }

  return getLandUseFromZoneCode(planningZoneData.zoneCode);
};

export default getLandUse;

if (import.meta.main) {
  const testAddresses = [
    {
      name: "Kew (Residential)",
      address: {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC" as const,
        postcode: "3101",
      },
    },
    {
      name: "Melbourne CBD",
      address: {
        addressLine: "123 Collins Street",
        suburb: "Melbourne",
        state: "VIC" as const,
        postcode: "3000",
      },
    },
  ];

  for (const test of testAddresses) {
    const landUse = await getLandUse({ address: test.address });
    console.log(`${test.name}: ${landUse}`);
  }
}
