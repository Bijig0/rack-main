import { Effect } from "effect";
import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComYearBuilt } from "./getPropertyValueDotComYearBuilt/getPropertyValueDotComYearBuilt";
import { YearBuiltSchema } from "./types";

export const getYearBuilt = createPropertyInfoGetter({
  schema: z.object({ yearBuilt: YearBuiltSchema }),
  sourceFns: [getPropertyValueDotComYearBuilt],
});

if (import.meta.main) {
  const {
    yearBuilt,
  } = await Effect.runPromise(
    getYearBuilt({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ yearBuilt });
}
