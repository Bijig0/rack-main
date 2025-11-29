#!/Users/a61403/.bun/bin/bun

import { Effect } from "effect";
import * as O from "effect/Option";
import { Address } from "../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { LocalPlanData } from "./types";

type Args = {
  address: Address;
};

type LocalPlanResult = {
  localPlanData: O.Option<LocalPlanData>;
};

/**
 * Local Planning Policy Framework (LPPF) lookup table for major Victorian councils
 *
 * This mapping contains common local planning policies from Municipal Strategic Statements (MSS)
 * and Local Planning Policy Frameworks for major Melbourne metropolitan and regional LGAs.
 *
 * Source: Victorian Planning Schemes - Local Policy sections
 */
const LOCAL_PLAN_LOOKUP: Record<string, string> = {
  // Inner Melbourne
  Melbourne: "City of Melbourne Central City Local Policy",
  Yarra: "Yarra Neighbourhood Character Policy",
  "Port Phillip": "Port Phillip Neighbourhood Character and Heritage Policy",
  Stonnington: "Stonnington Built Form and Heritage Policy",

  // Eastern Suburbs
  Boroondara: "Boroondara Neighbourhood Character Study",
  Whitehorse: "Whitehorse Neighbourhood Character Study",
  Manningham: "Manningham Residential Character Policy",
  Monash: "Monash Neighbourhood Character Study",
  "Glen Eira": "Glen Eira Neighbourhood Character Policy",
  Maroondah: "Maroondah Neighbourhood Character Strategy",
  Knox: "Knox Neighbourhood Character Study",

  // Western Suburbs
  Maribyrnong: "Maribyrnong Housing and Neighbourhood Character Strategy",
  "Hobsons Bay": "Hobsons Bay Residential Character Study",
  Brimbank: "Brimbank Residential Development Strategy",
  "Moonee Valley": "Moonee Valley Residential Character Study",
  Wyndham: "Wyndham Residential Development Framework",
  Melton: "Melton Growth Area Framework Plan",

  // Northern Suburbs
  Darebin: "Darebin Neighbourhood Character Study",
  Moreland: "Moreland Neighbourhood Character Study",
  Banyule: "Banyule Neighbourhood Character Study",
  Hume: "Hume Residential Development Strategy",
  Whittlesea: "Whittlesea Growth Area Framework",
  Nillumbik: "Nillumbik Green Wedge Management Plan",

  // South Eastern Suburbs
  Bayside: "Bayside Neighbourhood Character Study",
  Kingston: "Kingston Neighbourhood Character Study",
  "Greater Dandenong": "Greater Dandenong Housing Strategy",
  Casey: "Casey Growth Area Framework Plan",
  Cardinia: "Cardinia Growth Area Framework Plan",
  Frankston: "Frankston Neighbourhood Character Study",
  "Mornington Peninsula": "Mornington Peninsula Localised Planning Statement",

  // Regional Cities
  Geelong: "Greater Geelong Housing Diversity Strategy",
  Ballarat: "Ballarat Strategy Plan",
  Bendigo: "Greater Bendigo Housing Strategy",
  Wodonga: "Wodonga Land Use Framework Plan",
  Shepparton: "Greater Shepparton 2030 Strategy",
  "Latrobe City": "Latrobe City Settlement Strategy",
  Warrnambool: "Warrnambool 2040 Community Vision",
  Horsham: "Horsham Structure Plan",
  Mildura: "Mildura Residential Strategy",

  // Mornington Peninsula Region
  "Mornington Peninsula Shire":
    "Mornington Peninsula Localised Planning Statement",

  // Yarra Valley & Dandenongs
  "Yarra Ranges": "Yarra Ranges Neighbourhood Character Study",

  // Gippsland
  Baw: "Baw Baw Settlement Strategy",
  "Baw Baw": "Baw Baw Settlement Strategy",
  Wellington: "Wellington Settlement Strategy",
  "East Gippsland": "East Gippsland Settlement Strategy",

  // Surf Coast
  "Surf Coast": "Surf Coast Settlement Strategy",
  Colac: "Colac Otway Settlement Strategy",
  "Colac Otway": "Colac Otway Settlement Strategy",
};

/**
 * Normalizes LGA name by removing common suffixes and standardizing format
 */
function normalizeLgaName(lga: string): string {
  return lga
    .replace(/\s+(City|Shire|Borough|Rural City|Council)$/i, "")
    .replace(/^City of /i, "")
    .replace(/^Shire of /i, "")
    .trim();
}

/**
 * Normalizes suburb name for lookup
 */
function normalizeSuburbName(suburb: string): string {
  return suburb.trim();
}

/**
 * Looks up local plan in the lookup table
 */
function lookupLocalPlan(name: string): string | null {
  // Try exact match first
  if (LOCAL_PLAN_LOOKUP[name]) {
    return LOCAL_PLAN_LOOKUP[name];
  }

  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(LOCAL_PLAN_LOOKUP)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  // Try partial match (name contains key or key contains name)
  for (const [key, value] of Object.entries(LOCAL_PLAN_LOOKUP)) {
    const lowerKey = key.toLowerCase();
    if (lowerName.includes(lowerKey) || lowerKey.includes(lowerName)) {
      return value;
    }
  }

  return null;
}

/**
 * Gets local planning policy information for a property
 *
 * Uses getPlanningZoneData (with caching) to get the LGA, then looks up
 * the applicable Local Planning Policy Framework (LPPF) document.
 *
 * @param address - Property address
 * @returns Effect containing local plan name and LGA name wrapped in Option
 */
export const getLocalPlan = ({
  address,
}: Args): Effect.Effect<LocalPlanResult, Error> =>
  Effect.gen(function* () {
    const { planningZoneData } = yield* getPlanningZoneData({ address });

    const lgaName = O.flatMap(planningZoneData, (data) =>
      data?.lgaName ? O.some(data.lgaName) : O.none()
    );

    const lgaNameValue = O.getOrElse(lgaName, () => null);

    // Try LGA name first if available
    if (lgaNameValue) {
      const normalizedLga = normalizeLgaName(lgaNameValue);
      const localPlan = lookupLocalPlan(normalizedLga);
      if (localPlan) {
        return {
          localPlanData: O.some({ localPlan, lgaName: lgaNameValue }),
        };
      }
    }

    // Fall back to suburb-based lookup
    const normalizedSuburb = normalizeSuburbName(address.suburb);
    const localPlan = lookupLocalPlan(normalizedSuburb);

    if (localPlan) {
      return {
        localPlanData: O.some({ localPlan, lgaName: lgaNameValue }),
      };
    }

    return { localPlanData: O.none() };
  });

export default getLocalPlan;

if (import.meta.main) {
  const testCases = [
    {
      name: "Melbourne CBD",
      address: {
        addressLine: "Flinders Street Station",
        suburb: "Melbourne",
        state: "VIC" as const,
        postcode: "3000",
      },
    },
    {
      name: "Kew (Boroondara)",
      address: {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC" as const,
        postcode: "3101",
      },
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);

    const { localPlanData } = await Effect.runPromise(
      getLocalPlan({ address: testCase.address })
    );

    O.match(localPlanData, {
      onNone: () => console.log("  No local plan found"),
      onSome: (data) => {
        console.log(`  LGA: ${data.lgaName || "Not found"}`);
        console.log(`  Local Plan: ${data.localPlan || "Not found"}`);
      },
    });
  }
}
