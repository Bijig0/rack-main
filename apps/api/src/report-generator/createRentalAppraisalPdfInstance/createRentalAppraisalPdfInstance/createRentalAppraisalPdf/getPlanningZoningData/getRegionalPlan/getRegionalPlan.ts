import { Effect, Option } from "effect";
import type { Address } from "../../../../../../shared/types";
import { getPlanningZoneData } from "../getPlanningZoneData/getPlanningZoneData";
import { RegionalPlan } from "./types";

type Args = {
  address: Address;
};

/**
 * Victorian Regional Plans mapping
 *
 * Maps LGAs to their applicable regional strategic plan.
 * These are high-level strategic documents that guide planning across regions.
 */

// Greater Melbourne LGAs covered by Plan Melbourne
const GREATER_MELBOURNE_LGAS = [
  "Melbourne",
  "Yarra",
  "Port Phillip",
  "Stonnington",
  "Boroondara",
  "Manningham",
  "Banyule",
  "Darebin",
  "Moreland",
  "Merri-bek", // Moreland renamed
  "Moonee Valley",
  "Maribyrnong",
  "Hobsons Bay",
  "Bayside",
  "Glen Eira",
  "Kingston",
  "Monash",
  "Whitehorse",
  "Knox",
  "Maroondah",
  "Yarra Ranges",
  "Cardinia",
  "Casey",
  "Greater Dandenong",
  "Frankston",
  "Mornington Peninsula",
  "Nillumbik",
  "Whittlesea",
  "Hume",
  "Brimbank",
  "Melton",
  "Wyndham",
];

// Geelong Region (G21)
const GEELONG_REGION_LGAS = [
  "Greater Geelong",
  "Geelong",
  "Surf Coast",
  "Golden Plains",
  "Queenscliffe",
  "Borough of Queenscliffe",
  "Colac Otway",
  "Colac",
];

// Barwon South West Region
const BARWON_SOUTH_WEST_LGAS = [
  "Warrnambool",
  "Moyne",
  "Glenelg",
  "Southern Grampians",
  "Corangamite",
];

// Loddon Mallee Region
const LODDON_MALLEE_LGAS = [
  "Greater Bendigo",
  "Bendigo",
  "Mildura",
  "Swan Hill",
  "Loddon",
  "Buloke",
  "Gannawarra",
  "Campaspe",
  "Central Goldfields",
  "Mount Alexander",
  "Macedon Ranges",
];

// Grampians Region
const GRAMPIANS_LGAS = [
  "Ballarat",
  "Ararat",
  "Horsham",
  "Northern Grampians",
  "Pyrenees",
  "Hepburn",
  "Moorabool",
];

// Hume Region
const HUME_REGION_LGAS = [
  "Greater Shepparton",
  "Shepparton",
  "Wodonga",
  "Wangaratta",
  "Benalla",
  "Moira",
  "Strathbogie",
  "Mitchell",
  "Murrindindi",
  "Mansfield",
  "Alpine",
  "Indigo",
  "Towong",
];

// Gippsland Region
const GIPPSLAND_LGAS = [
  "Latrobe",
  "Latrobe City",
  "Baw Baw",
  "Bass Coast",
  "South Gippsland",
  "Wellington",
  "East Gippsland",
];

function getRegionalPlanForLga(lgaName: string): string | null {
  const normalizedLga = lgaName.toLowerCase();

  if (
    GREATER_MELBOURNE_LGAS.some((lga) =>
      normalizedLga.includes(lga.toLowerCase())
    )
  ) {
    return "Plan Melbourne 2017-2050";
  }

  if (
    GEELONG_REGION_LGAS.some((lga) => normalizedLga.includes(lga.toLowerCase()))
  ) {
    return "G21 Regional Growth Plan";
  }

  if (
    BARWON_SOUTH_WEST_LGAS.some((lga) =>
      normalizedLga.includes(lga.toLowerCase())
    )
  ) {
    return "Great South Coast Regional Growth Plan";
  }

  if (
    LODDON_MALLEE_LGAS.some((lga) => normalizedLga.includes(lga.toLowerCase()))
  ) {
    return "Loddon Mallee South Regional Growth Plan";
  }

  if (GRAMPIANS_LGAS.some((lga) => normalizedLga.includes(lga.toLowerCase()))) {
    return "Central Highlands Regional Growth Plan";
  }

  if (
    HUME_REGION_LGAS.some((lga) => normalizedLga.includes(lga.toLowerCase()))
  ) {
    return "Hume Regional Growth Plan";
  }

  if (GIPPSLAND_LGAS.some((lga) => normalizedLga.includes(lga.toLowerCase()))) {
    return "Gippsland Regional Growth Plan";
  }

  return null;
}

/**
 * Effect version of getRegionalPlan
 */
export const getRegionalPlan = ({
  address,
}: Args): Effect.Effect<Option.Option<RegionalPlan>, Error> =>
  getPlanningZoneData({ address }).pipe(
    Effect.map(({ planningZoneData }) =>
      Option.match(planningZoneData, {
        onNone: () => Option.none(),

        onSome: (pz) => {
          if (!pz?.lgaName) return Option.none();

          const regionalPlanName = getRegionalPlanForLga(pz.lgaName);

          if (!regionalPlanName) return Option.none();

          return Option.some({
            regionalPlan: regionalPlanName,
          });
        },
      })
    )
  );

export default getRegionalPlan;

if (import.meta.main) {
  const testAddresses = [
    {
      name: "Melbourne CBD",
      address: {
        addressLine: "123 Collins Street",
        suburb: "Melbourne",
        state: "VIC" as const,
        postcode: "3000",
      },
    },
    {
      name: "Geelong",
      address: {
        addressLine: "100 Moorabool Street",
        suburb: "Geelong",
        state: "VIC" as const,
        postcode: "3220",
      },
    },
    {
      name: "Ballarat",
      address: {
        addressLine: "50 Sturt Street",
        suburb: "Ballarat",
        state: "VIC" as const,
        postcode: "3350",
      },
    },
  ];

  for (const test of testAddresses) {
    const regionalPlan = await getRegionalPlan({ address: test.address });
    console.log(`${test.name}: ${regionalPlan}`);
  }
}
