import type { Address } from "../../../../../../shared/types";
import { Effect } from "effect";
import * as O from "effect/Option";
import { getPlanningOverlay } from "../getPlanningOverlay/getPlanningOverlay";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { LocalPlanSubprecinct } from "./types";

type Args = {
  address: Address;
};

/**
 * Subprecinct naming patterns for Victorian LGAs
 *
 * Subprecincts are typically derived from:
 * - Heritage Overlay (HO) schedules and their local names
 * - Neighbourhood Character Overlay (NCO) areas
 * - Design and Development Overlay (DDO) schedules
 * - Local planning policy precincts defined in the planning scheme
 */

// Heritage Overlay subprecinct name patterns by LGA
const HERITAGE_SUBPRECINCT_NAMES: Record<string, Record<string, string>> = {
  Boroondara: {
    HO1: "Subprecinct 1A - Historic Estates",
    HO2: "Subprecinct 1B - Victorian Era",
    HO3: "Subprecinct 2A - Interwar Period",
    HO4: "Subprecinct 2B - Federation Style",
    HO5: "Subprecinct 3A - Edwardian Character",
    HO6: "Subprecinct 3B - Art Deco Influence",
    HO7: "Subprecinct 4A - Garden Suburb",
    HO8: "Subprecinct 4B - Post-War Development",
  },
  Stonnington: {
    HO1: "Subprecinct 1A - Historic Mansions",
    HO2: "Subprecinct 1B - Victorian Terraces",
    HO3: "Subprecinct 2A - Toorak Estate",
    HO4: "Subprecinct 2B - South Yarra Heritage",
    HO5: "Subprecinct 3A - Prahran Commercial",
    HO6: "Subprecinct 3B - Armadale Village",
  },
  Yarra: {
    HO1: "Subprecinct 1A - Richmond Hill",
    HO2: "Subprecinct 1B - Collingwood Flats",
    HO3: "Subprecinct 2A - Fitzroy Terraces",
    HO4: "Subprecinct 2B - Carlton North",
    HO5: "Subprecinct 3A - Abbotsford Industrial",
    HO6: "Subprecinct 3B - Clifton Hill",
  },
  Melbourne: {
    HO1: "Subprecinct 1A - Central City",
    HO2: "Subprecinct 1B - Hoddle Grid",
    HO3: "Subprecinct 2A - Carlton Heritage",
    HO4: "Subprecinct 2B - East Melbourne",
    HO5: "Subprecinct 3A - Parkville",
    HO6: "Subprecinct 3B - North Melbourne",
  },
  "Port Phillip": {
    HO1: "Subprecinct 1A - St Kilda Foreshore",
    HO2: "Subprecinct 1B - Esplanade Character",
    HO3: "Subprecinct 2A - Elwood Heritage",
    HO4: "Subprecinct 2B - Albert Park",
    HO5: "Subprecinct 3A - South Melbourne",
    HO6: "Subprecinct 3B - Port Melbourne Industrial",
  },
  Bayside: {
    HO1: "Subprecinct 1A - Brighton Beach",
    HO2: "Subprecinct 1B - Hampton Heritage",
    HO3: "Subprecinct 2A - Sandringham Village",
    HO4: "Subprecinct 2B - Black Rock",
    HO5: "Subprecinct 3A - Beaumaris Modern",
  },
  "Glen Eira": {
    HO1: "Subprecinct 1A - Caulfield Heritage",
    HO2: "Subprecinct 1B - Elsternwick Village",
    HO3: "Subprecinct 2A - Carnegie Character",
    HO4: "Subprecinct 2B - Bentleigh Heritage",
  },
  Monash: {
    HO1: "Subprecinct 1A - Oakleigh Village",
    HO2: "Subprecinct 1B - Mount Waverley",
    HO3: "Subprecinct 2A - Clayton Heritage",
    HO4: "Subprecinct 2B - Glen Waverley",
  },
};

// Neighbourhood Character Overlay subprecinct patterns
const NCO_SUBPRECINCT_NAMES: Record<string, string> = {
  NCO1: "Neighbourhood Character Area 1 - Established Residential",
  NCO2: "Neighbourhood Character Area 2 - Garden Suburban",
  NCO3: "Neighbourhood Character Area 3 - Bush Suburban",
  NCO4: "Neighbourhood Character Area 4 - Inner Urban",
  NCO5: "Neighbourhood Character Area 5 - Coastal",
};

// Design and Development Overlay subprecinct patterns
const DDO_SUBPRECINCT_NAMES: Record<string, string> = {
  DDO1: "Design Area 1 - Activity Centre Core",
  DDO2: "Design Area 2 - Mixed Use Transition",
  DDO3: "Design Area 3 - Residential Interface",
  DDO4: "Design Area 4 - Heritage Streetscape",
  DDO5: "Design Area 5 - Boulevard Character",
  DDO6: "Design Area 6 - Industrial Transition",
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

type Return = {
  localPlanSubprecinct: O.Option<LocalPlanSubprecinct>;
};

/**
 * Gets the local plan subprecinct for an address.
 *
 * Subprecincts provide fine-grained character area classifications within
 * broader planning precincts. They are typically derived from:
 * - Heritage Overlay (HO) schedules specific to each LGA
 * - Neighbourhood Character Overlays (NCO)
 * - Design and Development Overlays (DDO)
 *
 * Examples:
 * - "Subprecinct 1A - Historic Estates"
 * - "Neighbourhood Character Area 2 - Garden Suburban"
 * - "Design Area 4 - Heritage Streetscape"
 *
 * Uses cached data from getPlanningZoneData and getPlanningOverlay.
 *
 * @param address - The property address
 * @returns The subprecinct name or None if not available
 */
export const getLocalPlanSubprecinct = ({
  address,
}: Args): Effect.Effect<Return, Error> =>
  Effect.gen(function* () {
    // Get planning zone data for LGA
    const { planningZoneData } = yield* getPlanningZoneData({ address });

    // Get overlays
    const { planningOverlayData } = yield* getPlanningOverlay({ address });

    // If no overlays, return none
    if (O.isNone(planningOverlayData)) {
      return { localPlanSubprecinct: O.none() };
    }

    const overlays = O.getOrThrow(planningOverlayData);

    if (overlays?.length === 0) {
      return { localPlanSubprecinct: O.none() };
    }

    // Extract and normalize LGA name if present
    const lgaName = O.flatMap(planningZoneData, (data) =>
      data?.lgaName ? O.some(normalizeLgaName(data.lgaName)) : O.none()
    ).pipe(O.getOrElse(() => null as string | null));

    // Check for Heritage Overlay subprecincts (LGA-specific)
    if (lgaName && HERITAGE_SUBPRECINCT_NAMES[lgaName]) {
      const lgaSubprecincts = HERITAGE_SUBPRECINCT_NAMES[lgaName];
      for (const overlay of overlays ?? []) {
        if (overlay.overlayCode.startsWith("HO")) {
          const subprecinct = lgaSubprecincts[overlay.overlayCode];
          if (subprecinct) {
            return { localPlanSubprecinct: O.some(subprecinct) };
          }
        }
      }
    }

    // Check for Neighbourhood Character Overlay subprecincts
    for (const overlay of overlays ?? []) {
      if (overlay.overlayCode.startsWith("NCO")) {
        const subprecinct = NCO_SUBPRECINCT_NAMES[overlay.overlayCode];
        if (subprecinct) {
          return { localPlanSubprecinct: O.some(subprecinct) };
        }
      }
    }

    // Check for Design and Development Overlay subprecincts
    for (const overlay of overlays ?? []) {
      if (overlay.overlayCode.startsWith("DDO")) {
        const subprecinct = DDO_SUBPRECINCT_NAMES[overlay.overlayCode];
        if (subprecinct) {
          return { localPlanSubprecinct: O.some(subprecinct) };
        }
      }
    }

    // Generate a generic subprecinct name from the first significant overlay
    const significantOverlay = overlays?.find(
      (o) =>
        o.overlayCode.startsWith("HO") ||
        o.overlayCode.startsWith("NCO") ||
        o.overlayCode.startsWith("DDO")
    );

    if (significantOverlay) {
      const code = significantOverlay.overlayCode;
      const number = code.replace(/[A-Z]/g, "");

      if (code.startsWith("HO")) {
        return {
          localPlanSubprecinct: O.some(`Heritage Subprecinct ${number}`),
        };
      } else if (code.startsWith("NCO")) {
        return {
          localPlanSubprecinct: O.some(
            `Neighbourhood Character Subprecinct ${number}`
          ),
        };
      } else if (code.startsWith("DDO")) {
        return {
          localPlanSubprecinct: O.some(`Design Subprecinct ${number}`),
        };
      }
    }

    return { localPlanSubprecinct: O.none() };
  });

export default getLocalPlanSubprecinct;

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
      name: "Armadale (Stonnington)",
      address: {
        addressLine: "100 High Street",
        suburb: "Armadale",
        state: "VIC" as const,
        postcode: "3143",
      },
    },
    {
      name: "Collingwood (Yarra)",
      address: {
        addressLine: "100 Smith Street",
        suburb: "Collingwood",
        state: "VIC" as const,
        postcode: "3066",
      },
    },
  ];

  for (const test of testAddresses) {
    const program = getLocalPlanSubprecinct({ address: test.address });
    const { localPlanSubprecinct } = await Effect.runPromise(program);

    const subprecinctDisplay = O.getOrElse(
      localPlanSubprecinct,
      () => "Not found"
    );
    console.log(`${test.name}: ${subprecinctDisplay}`);
  }
}
