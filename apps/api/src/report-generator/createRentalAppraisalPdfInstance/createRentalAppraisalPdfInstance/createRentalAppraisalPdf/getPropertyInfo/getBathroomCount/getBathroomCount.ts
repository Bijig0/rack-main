import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComBedroomCount } from "./getPropertyValueDotComBedroomCount/getPropertyValueDotComBedroomCount";
import { BathroomCountSchema } from "./types";

export const getBathroomCount = createPropertyInfoGetter({
  schema: z.object({ bathroomCount: BathroomCountSchema }),
  sourceFns: [getPropertyValueDotComBedroomCount],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { bathroomCount } = await Effect.runPromise(
    getBathroomCount({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ bathroomCount });
}
