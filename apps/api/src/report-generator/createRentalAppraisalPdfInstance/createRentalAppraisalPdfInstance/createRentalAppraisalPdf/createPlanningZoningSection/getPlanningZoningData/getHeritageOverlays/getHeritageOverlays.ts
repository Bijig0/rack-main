import type { Address } from "../../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { getPlanningOverlay } from "../getPlanningOverlay/getPlanningOverlay";

type Args = {
  address: Address;
};

type HeritageOverlay = {
  code: string;
  name: string;
};

/**
 * Heritage Overlay name mappings by LGA
 *
 * Heritage Overlays (HO) in Victoria protect places of heritage significance.
 * Each HO number corresponds to a specific heritage place or precinct
 * listed in the planning scheme's Heritage Overlay Schedule.
 */
const HERITAGE_OVERLAY_NAMES: Record<string, Record<string, string>> = {
  Boroondara: {
    HO1: "Kew Historic Precinct",
    HO2: "Hawthorn Heritage Area",
    HO3: "Camberwell Garden Suburb",
    HO4: "Canterbury Heritage Precinct",
    HO5: "Balwyn Heritage Area",
    HO6: "Surrey Hills Historic District",
    HO7: "Mont Albert Heritage Precinct",
    HO8: "Deepdene Estate",
    HO9: "Glen Iris Heritage Area",
    HO10: "Ashburton Historic Precinct",
  },
  Stonnington: {
    HO1: "Toorak Village Heritage Precinct",
    HO2: "South Yarra Historic Area",
    HO3: "Prahran Heritage Precinct",
    HO4: "Armadale Historic District",
    HO5: "Malvern Heritage Area",
    HO6: "Glen Iris Estate",
    HO7: "Kooyong Heritage Precinct",
    HO8: "Windsor Historic Area",
  },
  Yarra: {
    HO1: "Richmond Hill Heritage Precinct",
    HO2: "Collingwood Slopes Historic Area",
    HO3: "Fitzroy Heritage Precinct",
    HO4: "Carlton North Historic District",
    HO5: "Abbotsford Heritage Area",
    HO6: "Clifton Hill Historic Precinct",
    HO7: "Cremorne Heritage Area",
    HO8: "North Richmond Heritage Precinct",
  },
  Melbourne: {
    HO1: "Central City Heritage Precinct",
    HO2: "Hoddle Grid Historic Area",
    HO3: "Carlton Heritage Precinct",
    HO4: "East Melbourne Historic District",
    HO5: "Parkville Heritage Area",
    HO6: "North Melbourne Heritage Precinct",
    HO7: "South Melbourne Historic Area",
    HO8: "Kensington Heritage Precinct",
    HO9: "West Melbourne Historic District",
    HO10: "Docklands Heritage Area",
  },
  "Port Phillip": {
    HO1: "St Kilda Foreshore Heritage Precinct",
    HO2: "St Kilda Hill Historic Area",
    HO3: "Elwood Heritage Precinct",
    HO4: "Albert Park Historic District",
    HO5: "South Melbourne Heritage Area",
    HO6: "Port Melbourne Heritage Precinct",
    HO7: "Middle Park Historic Area",
    HO8: "Balaclava Heritage Precinct",
  },
  Bayside: {
    HO1: "Brighton Beach Heritage Precinct",
    HO2: "Hampton Historic Area",
    HO3: "Sandringham Heritage Precinct",
    HO4: "Black Rock Historic District",
    HO5: "Beaumaris Heritage Area",
    HO6: "Highett Heritage Precinct",
  },
  "Glen Eira": {
    HO1: "Caulfield Heritage Precinct",
    HO2: "Elsternwick Historic Area",
    HO3: "Carnegie Heritage Precinct",
    HO4: "Bentleigh Historic District",
    HO5: "McKinnon Heritage Area",
    HO6: "Ormond Heritage Precinct",
  },
  Monash: {
    HO1: "Oakleigh Heritage Precinct",
    HO2: "Mount Waverley Historic Area",
    HO3: "Clayton Heritage Precinct",
    HO4: "Glen Waverley Historic District",
    HO5: "Mulgrave Heritage Area",
    HO6: "Wheelers Hill Heritage Precinct",
  },
  "Greater Geelong": {
    HO1: "Geelong Central Heritage Precinct",
    HO2: "Newtown Historic Area",
    HO3: "East Geelong Heritage Precinct",
    HO4: "South Geelong Historic District",
    HO5: "Belmont Heritage Area",
    HO6: "Highton Heritage Precinct",
  },
  Ballarat: {
    HO1: "Ballarat Central Heritage Precinct",
    HO2: "Ballarat East Historic Area",
    HO3: "Lake Wendouree Heritage Precinct",
    HO4: "Soldiers Hill Historic District",
    HO5: "Black Hill Heritage Area",
  },
};

/**
 * Normalizes LGA name for lookup
 */
function normalizeLgaName(lga: string): string {
  return lga
    .replace(/\s+(City|Shire|Borough|Rural City|Council)$/i, "")
    .replace(/^City of /i, "")
    .replace(/^Shire of /i, "")
    .trim();
}

/**
 * Gets the heritage overlay name for a code and LGA
 */
function getHeritageOverlayName(
  overlayCode: string,
  lgaName: string | null
): string {
  // Try LGA-specific name first
  if (lgaName) {
    const normalizedLga = normalizeLgaName(lgaName);
    const lgaOverlays = HERITAGE_OVERLAY_NAMES[normalizedLga];
    if (lgaOverlays && lgaOverlays[overlayCode]) {
      return lgaOverlays[overlayCode];
    }
  }

  // Generate a generic name from the overlay code
  const number = overlayCode.replace(/[A-Z]/g, "");
  return `Heritage Overlay ${number}`;
}

/**
 * Gets the heritage overlays for an address.
 *
 * Heritage Overlays (HO) protect places of heritage significance including:
 * - Heritage precincts (groups of buildings)
 * - Individual heritage places
 * - Historic streetscapes
 * - Significant trees and gardens
 *
 * Returns an array of heritage overlay names like:
 * - "Kew Historic Precinct"
 * - "St Kilda Foreshore Heritage Precinct"
 * - "Ballarat Central Heritage Precinct"
 *
 * Uses cached data from getPlanningZoneData and getPlanningOverlay.
 *
 * @param address - The property address
 * @returns Array of heritage overlay names or null if none found
 */
export const getHeritageOverlays = async ({
  address,
}: Args): Promise<HeritageOverlay[] | null> => {
  // Get planning zone data for LGA
  const { planningZoneData } = await getPlanningZoneData({ address });

  // Get all overlays
  const { planningOverlayData } = await getPlanningOverlay({ address });

  if (!planningOverlayData || planningOverlayData.length === 0) {
    return null;
  }

  const lgaName = planningZoneData?.lgaName || null;

  // Filter for Heritage Overlays (HO)
  const heritageOverlays = planningOverlayData
    .filter((overlay) => overlay.overlayCode.startsWith("HO"))
    .map((overlay) => ({
      code: overlay.overlayCode,
      name: getHeritageOverlayName(overlay.overlayCode, lgaName),
    }));

  if (heritageOverlays.length === 0) {
    return null;
  }

  return heritageOverlays;
};

/**
 * Gets heritage overlay names as a simple string array
 */
export const getHeritageOverlayNames = async ({
  address,
}: Args): Promise<string[] | null> => {
  const overlays = await getHeritageOverlays({ address });
  if (!overlays) {
    return null;
  }
  return overlays.map((o) => o.name);
};

export default getHeritageOverlays;

if (import.meta.main) {
  const testAddresses = [
    {
      name: "Kew (Boroondara)",
      address: {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC" as const,
        postcode: "3101",
      },
    },
    {
      name: "St Kilda (Port Phillip)",
      address: {
        addressLine: "100 Fitzroy Street",
        suburb: "St Kilda",
        state: "VIC" as const,
        postcode: "3182",
      },
    },
    {
      name: "Fitzroy (Yarra)",
      address: {
        addressLine: "200 Brunswick Street",
        suburb: "Fitzroy",
        state: "VIC" as const,
        postcode: "3065",
      },
    },
  ];

  for (const test of testAddresses) {
    console.log(`\n${test.name}:`);
    const overlays = await getHeritageOverlays({ address: test.address });
    if (overlays) {
      overlays.forEach((o) => console.log(`  - ${o.code}: ${o.name}`));
    } else {
      console.log("  No heritage overlays found");
    }
  }
}
