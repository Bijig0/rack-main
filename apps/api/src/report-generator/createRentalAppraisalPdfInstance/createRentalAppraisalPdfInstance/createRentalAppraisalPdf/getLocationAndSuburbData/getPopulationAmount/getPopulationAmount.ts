import z from "zod";
import { createPropertyInfoGetter } from "../../getPropertyInfo/createPropertyInfoGetter";
import { getPropertyValueDotComPopulationAmount } from "./getPropertyValueDotComPopulationAmount/getPropertyValueDotComPopulationAmount";
import { PopulationAmountSchema } from "./types";

export const getPopulationAmount = createPropertyInfoGetter({
  schema: z.object({ populationAmount: PopulationAmountSchema }),
  sourceFns: [getPropertyValueDotComPopulationAmount],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { populationAmount } = await Effect.runPromise(
    getPopulationAmount({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ populationAmount });
}
