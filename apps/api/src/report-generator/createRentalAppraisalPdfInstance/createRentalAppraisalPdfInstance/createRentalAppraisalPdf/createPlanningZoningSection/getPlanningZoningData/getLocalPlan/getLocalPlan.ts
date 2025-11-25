#!/Users/a61403/.bun/bin/bun

import { Address } from "../../../../../../../shared/types";
type Args = {
  address: Address;
  lgaName?: string;
};

type Return = {
  localPlan: string | undefined;
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
 * Gets local planning policy information for a property
 *
 * Attempts to identify the applicable Local Planning Policy Framework (LPPF) document
 * using a lookup table of common Victorian planning policies. The LPPF is part of the
 * Municipal Strategic Statement (MSS) that contains local planning objectives and strategies.
 *
 * Note: This is a basic lookup implementation. A full implementation would query WFS
 * services or planning scheme databases for more precise policy information.
 *
 * @param address - Property address
 * @param lgaName - Optional LGA name (if already known from planning zone data)
 * @returns Local plan name or undefined if not available
 */
export const getLocalPlan = ({ address, lgaName }: Args): Return => {
  console.log("\n📋 Determining local planning policy...");

  // Try LGA name first if provided
  if (lgaName) {
    const normalizedLga = normalizeLgaName(lgaName);
    const localPlan = lookupLocalPlan(normalizedLga);
    if (localPlan) {
      console.log(`✅ Found local plan from LGA: ${localPlan}`);
      return { localPlan };
    }
  }

  // Fall back to suburb-based lookup
  const normalizedSuburb = normalizeSuburbName(address.suburb);
  const localPlan = lookupLocalPlan(normalizedSuburb);

  if (localPlan) {
    console.log(`✅ Found local plan from suburb: ${localPlan}`);
    return { localPlan };
  }

  console.log("ℹ️  No local planning policy found in lookup table");
  return { localPlan: undefined };
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
function lookupLocalPlan(name: string): string | undefined {
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

  return undefined;
}

export default getLocalPlan;

// Test the function if run directly
if (import.meta.main) {
  console.log("=".repeat(80));
  console.log("Testing getLocalPlan");
  console.log("=".repeat(80));

  const testCases = [
    {
      name: "Melbourne CBD (with LGA)",
      address: {
        addressLine: "Flinders Street Station",
        suburb: "Melbourne",
        state: "VIC" as const,
        postcode: "3000",
      },
      lgaName: "Melbourne",
    },
    {
      name: "Boroondara (with LGA)",
      address: {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC" as const,
        postcode: "3101",
      },
      lgaName: "Boroondara",
    },
    {
      name: "Yarra (from suburb)",
      address: {
        addressLine: "100 Smith Street",
        suburb: "Collingwood",
        state: "VIC" as const,
        postcode: "3066",
      },
      lgaName: undefined,
    },
    {
      name: "Regional - Geelong",
      address: {
        addressLine: "123 Moorabool Street",
        suburb: "Geelong",
        state: "VIC" as const,
        postcode: "3220",
      },
      lgaName: "Greater Geelong",
    },
    {
      name: "Not in lookup table",
      address: {
        addressLine: "1 Main Street",
        suburb: "SmallTown",
        state: "VIC" as const,
        postcode: "3999",
      },
      lgaName: "Unknown Council",
    },
    {
      name: "LGA with suffix",
      address: {
        addressLine: "50 Test Street",
        suburb: "Frankston",
        state: "VIC" as const,
        postcode: "3199",
      },
      lgaName: "Frankston City Council",
    },
    {
      name: "City of prefix",
      address: {
        addressLine: "789 Example Road",
        suburb: "Port Melbourne",
        state: "VIC" as const,
        postcode: "3207",
      },
      lgaName: "City of Port Phillip",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`Address: ${testCase.address.suburb}`);
    console.log(`LGA: ${testCase.lgaName || "Not provided"}`);

    const { localPlan } = getLocalPlan({
      address: testCase.address,
      lgaName: testCase.lgaName,
    });

    console.log(`Result: ${localPlan || "undefined"}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("Testing complete");
  console.log("=".repeat(80));
}
