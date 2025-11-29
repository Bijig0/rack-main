import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComEstimatedValueRange } from "./getPropertyValueDotComEstimatedValueRange/getPropertyValueDotComEstimatedValueRange";
import { EstimatedValueRangeSchema } from "./types";

export const getEstimatedValueRange = createPropertyInfoGetter({
  schema: z.object({ estimatedValueRange: EstimatedValueRangeSchema }),
  sourceFns: [getPropertyValueDotComEstimatedValueRange],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { estimatedValueRange } = await Effect.runPromise(
    getEstimatedValueRange({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ estimatedValueRange });
}
