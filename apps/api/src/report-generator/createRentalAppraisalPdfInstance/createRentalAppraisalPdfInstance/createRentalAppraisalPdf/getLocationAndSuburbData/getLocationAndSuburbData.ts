import { Effect } from "effect";
import z from "zod";
import { Address } from "../../../../../shared/types";
import { prefetchSources } from "../getPropertyInfo/getPropertyInfo";
import { getDistanceFromCBD } from "./getDistanceFromCBD.ts/getDistanceFromCBD";
import { getFiveYearGrowthInPopulation } from "./getFiveYearPopulationGrowth/getFiveYearPopulationGrowth";
import { FiveYearPopulationGrowthSchema } from "./getFiveYearPopulationGrowth/types";
import { getOccupancyChart } from "./getOccupancyChart/getOccupancyChart";
import { OccupancyChartSchema } from "./getOccupancyChart/types";
import { getPopulationAmount } from "./getPopulationAmount/getPopulationAmount";
import {
  DistanceFromCBDSchema,
  PopulationAmountSchema,
} from "./getPopulationAmount/types";

export const LocationAndSuburbDataSchema = z.object({
  fiveYearPopulationGrowth: FiveYearPopulationGrowthSchema,
  occupancyChart: OccupancyChartSchema,
  populationAmount: PopulationAmountSchema,
  distanceFromCBD: DistanceFromCBDSchema,
});

export type LocationAndSuburbData = z.infer<
  typeof LocationAndSuburbDataSchema
> & {};

type Args = {
  address: Address;
};

type Return = {
  locationAndSuburbData: LocationAndSuburbData;
};

/**
 * Gets all location and suburb data for a property.
 * Collates data from multiple sources including:
 * - Five year population growth
 * - Occupancy chart (household composition)
 * - Population amount
 * - Distance from CBD
 */
export const getLocationAndSuburbData = ({
  address,
}: Args): Effect.Effect<Return, Error> => {
  return Effect.gen(function* () {
    yield* Effect.tryPromise(() => prefetchSources({ address }));
    // Run all data fetchers in parallel
    const [
      { fiveYearPopulationGrowth },
      { occupancyChart },
      { populationAmount },
      { distanceFromCBD },
    ] = yield* Effect.all(
      [
        getFiveYearGrowthInPopulation({ address }),
        getOccupancyChart({ address }),
        getPopulationAmount({ address }),
        getDistanceFromCBD({ address }),
      ],
      { concurrency: "unbounded" }
    );

    const locationAndSuburbData = {
      locationAndSuburbData: {
        fiveYearPopulationGrowth,
        occupancyChart,
        populationAmount,
        distanceFromCBD,
      },
    } satisfies Return;

    return locationAndSuburbData;
  });
};

if (import.meta.main) {
  const address: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  const locationAndSuburbData = await Effect.runPromise(
    getLocationAndSuburbData({ address })
  );

  console.log("\n📊 Location and Suburb Data:");
  console.log(JSON.stringify(locationAndSuburbData, null, 2));
}

export default getLocationAndSuburbData;
