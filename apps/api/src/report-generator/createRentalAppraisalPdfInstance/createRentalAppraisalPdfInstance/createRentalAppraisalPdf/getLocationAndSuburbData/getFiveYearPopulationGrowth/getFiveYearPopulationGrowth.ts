import z from "zod";
import { createPropertyInfoGetter } from "../../getPropertyInfo/createPropertyInfoGetter";
import { getCoreLogicFiveYearPopulationGrowthData } from "./getCoreLogicFiveYearPopulationGrowthData/getCoreLogicFiveYearPopulationGrowthData";
import { FiveYearPopulationGrowthSchema } from "./types";

export const getFiveYearGrowthInPopulation = createPropertyInfoGetter({
  schema: z.object({
    fiveYearPopulationGrowth: FiveYearPopulationGrowthSchema,
  }),
  sourceFns: [getCoreLogicFiveYearPopulationGrowthData],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { fiveYearPopulationGrowth } = await Effect.runPromise(
    getFiveYearGrowthInPopulation({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ fiveYearPopulationGrowth });
}
