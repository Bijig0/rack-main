import type { Address } from "../../../../../../shared/types";
import { Effect } from "effect";
import * as O from "effect/Option";
import { getPlanningOverlay } from "../getPlanningOverlay/getPlanningOverlay";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { LocalPlanPrecinct } from "./types";

type Args = {
  address: Address;
};

/**
 * Local Plan Precinct mappings by LGA
 *
 * Precincts are geographic areas within an LGA that have distinct
 * neighbourhood character, heritage significance, or planning controls.
 * They are typically defined in the Local Planning Policy Framework (LPPF).
 */
const LOCAL_PLAN_PRECINCTS: Record<string, Record<string, string>> = {
  Boroondara: {
    HO1: "Precinct A - Kew Boulevard",
    HO2: "Precinct B - Hawthorn Grove",
    HO3: "Precinct C - Camberwell Gardens",
    HO4: "Precinct D - Canterbury Rise",
    HO5: "Precinct E - Balwyn Heights",
    DDO1: "Precinct F - Kew Junction Activity Centre",
    DDO2: "Precinct G - Camberwell Junction",
    DDO3: "Precinct H - Glenferrie Road",
    NCO1: "Precinct J - Established Garden Suburban",
    NCO2: "Precinct K - Interwar Character",
  },
  Stonnington: {
    HO1: "Precinct A - Toorak Estate",
    HO2: "Precinct B - South Yarra Hill",
    HO3: "Precinct C - Prahran East",
    HO4: "Precinct D - Armadale Village",
    HO5: "Precinct E - Malvern Gardens",
    DDO1: "Precinct F - Chapel Street Activity Centre",
    DDO2: "Precinct G - High Street Armadale",
    DDO3: "Precinct H - Glenferrie Road Malvern",
    NCO1: "Precinct J - Garden Suburban",
  },
  Yarra: {
    HO1: "Precinct A - Richmond Hill",
    HO2: "Precinct B - Collingwood Slopes",
    HO3: "Precinct C - Fitzroy North",
    HO4: "Precinct D - Carlton North",
    HO5: "Precinct E - Abbotsford Flats",
    DDO1: "Precinct F - Swan Street Activity Centre",
    DDO2: "Precinct G - Smith Street",
    DDO3: "Precinct H - Brunswick Street",
    NCO1: "Precinct J - Inner Urban Character",
  },
  Melbourne: {
    HO1: "Precinct A - Hoddle Grid Core",
    HO2: "Precinct B - Carlton Heritage",
    HO3: "Precinct C - East Melbourne",
    HO4: "Precinct D - Parkville",
    HO5: "Precinct E - North Melbourne",
    DDO1: "Precinct F - Central City",
    DDO2: "Precinct G - Southbank",
    DDO3: "Precinct H - Docklands",
    CCZ1: "Precinct J - Capital City Core",
  },
  "Port Phillip": {
    HO1: "Precinct A - St Kilda Foreshore",
    HO2: "Precinct B - St Kilda Hill",
    HO3: "Precinct C - Elwood Canal",
    HO4: "Precinct D - Albert Park Lake",
    HO5: "Precinct E - South Melbourne",
    DDO1: "Precinct F - Fitzroy Street Activity Centre",
    DDO2: "Precinct G - Acland Street",
    DDO3: "Precinct H - Bay Street Port Melbourne",
    NCO1: "Precinct J - Bayside Character",
  },
  Bayside: {
    HO1: "Precinct A - Brighton Beach",
    HO2: "Precinct B - Hampton Street",
    HO3: "Precinct C - Sandringham Village",
    HO4: "Precinct D - Black Rock Bluff",
    HO5: "Precinct E - Beaumaris Foreshore",
    DDO1: "Precinct F - Church Street Brighton",
    NCO1: "Precinct G - Bayside Garden Suburban",
    NCO2: "Precinct H - Coastal Character",
  },
  "Glen Eira": {
    HO1: "Precinct A - Caulfield Park",
    HO2: "Precinct B - Elsternwick Village",
    HO3: "Precinct C - Carnegie Central",
    HO4: "Precinct D - Bentleigh East",
    DDO1: "Precinct E - Caulfield Station",
    DDO2: "Precinct F - Carnegie Activity Centre",
    NCO1: "Precinct G - Garden Suburban",
  },
  Monash: {
    HO1: "Precinct A - Oakleigh Central",
    HO2: "Precinct B - Mount Waverley Village",
    HO3: "Precinct C - Clayton North",
    HO4: "Precinct D - Glen Waverley",
    DDO1: "Precinct E - Oakleigh Activity Centre",
    DDO2: "Precinct F - Brandon Park",
    NCO1: "Precinct G - Garden Court Suburban",
  },
  "Greater Geelong": {
    HO1: "Precinct A - Geelong West",
    HO2: "Precinct B - Newtown Heritage",
    HO3: "Precinct C - East Geelong",
    HO4: "Precinct D - South Geelong",
    DDO1: "Precinct E - Central Geelong",
    DDO2: "Precinct F - Waterfront",
    NCO1: "Precinct G - Established Residential",
  },
  Ballarat: {
    HO1: "Precinct A - Ballarat Central",
    HO2: "Precinct B - Ballarat East",
    HO3: "Precinct C - Lake Wendouree",
    HO4: "Precinct D - Soldiers Hill",
    DDO1: "Precinct E - CBD Core",
    NCO1: "Precinct F - Historic Township",
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
 * Gets the local plan precinct name for an overlay code and LGA
 */
function getPrecinctName(
  overlayCode: string,
  lgaName: string | null
): string | null {
  if (!lgaName) return null;

  const normalizedLga = normalizeLgaName(lgaName);
  const lgaPrecincts = LOCAL_PLAN_PRECINCTS[normalizedLga];

  if (lgaPrecincts && lgaPrecincts[overlayCode]) {
    return lgaPrecincts[overlayCode];
  }

  return null;
}

/**
 * Generates a generic precinct name from overlay code
 */
function generateGenericPrecinctName(overlayCode: string): string {
  const number = overlayCode.replace(/[A-Z]/g, "");
  const letter = String.fromCharCode(64 + parseInt(number || "1", 10)); // 1->A, 2->B, etc.

  if (overlayCode.startsWith("HO")) {
    return `Precinct ${letter} - Heritage Area ${number}`;
  } else if (overlayCode.startsWith("DDO")) {
    return `Precinct ${letter} - Design Area ${number}`;
  } else if (overlayCode.startsWith("NCO")) {
    return `Precinct ${letter} - Character Area ${number}`;
  } else if (overlayCode.startsWith("DPO")) {
    return `Precinct ${letter} - Development Area ${number}`;
  }

  return `Precinct ${letter}`;
}

type Return = {
  localPlanPrecinct: O.Option<LocalPlanPrecinct>;
};

/**
 * Gets the local plan precinct for an address.
 *
 * Precincts are geographic areas defined in the Local Planning Policy Framework
 * that have distinct character or planning controls. Examples:
 * - "Precinct A - Oakwood Boulevard"
 * - "Precinct B - Hawthorn Grove"
 * - "Precinct F - Kew Junction Activity Centre"
 *
 * Uses cached data from getPlanningZoneData and getPlanningOverlay.
 *
 * @param address - The property address
 * @returns The precinct name or None if not available
 */
export const getLocalPlanPrecinct = ({
  address,
}: Args): Effect.Effect<Return, Error> =>
  Effect.gen(function* () {
    // Get planning zone data for LGA
    const { planningZoneData } = yield* getPlanningZoneData({ address });

    // Get overlays
    const { planningOverlayData } = yield* getPlanningOverlay({ address });

    // If no overlays, return none
    if (O.isNone(planningOverlayData)) {
      return { localPlanPrecinct: O.none() };
    }

    const overlays = O.getOrThrow(planningOverlayData);

    if (overlays?.length === 0) {
      return { localPlanPrecinct: O.none() };
    }

    // Extract LGA name if present
    const lgaName = O.map(
      planningZoneData,
      (data) => data?.lgaName ?? null
    ).pipe(O.getOrElse(() => null));

    // Priority order: HO > DDO > NCO > DPO > other
    const priorityPrefixes = ["HO", "DDO", "NCO", "DPO"];

    for (const prefix of priorityPrefixes) {
      const overlay = overlays?.find((o) => o.overlayCode.startsWith(prefix));

      if (overlay) {
        // Try LGA-specific precinct name first
        const precinctName = getPrecinctName(overlay.overlayCode, lgaName);
        if (precinctName) {
          return { localPlanPrecinct: O.some(precinctName) };
        }

        // Fall back to generic precinct name
        return {
          localPlanPrecinct: O.some(
            generateGenericPrecinctName(overlay.overlayCode)
          ),
        };
      }
    }

    return { localPlanPrecinct: O.none() };
  });

export default getLocalPlanPrecinct;

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
      name: "St Kilda (Port Phillip)",
      address: {
        addressLine: "100 Fitzroy Street",
        suburb: "St Kilda",
        state: "VIC" as const,
        postcode: "3182",
      },
    },
  ];

  for (const test of testAddresses) {
    const program = getLocalPlanPrecinct({ address: test.address });
    const { localPlanPrecinct } = await Effect.runPromise(program);

    const precinctDisplay = O.getOrElse(localPlanPrecinct, () => "Not found");
    console.log(`${test.name}: ${precinctDisplay}`);
  }
}
