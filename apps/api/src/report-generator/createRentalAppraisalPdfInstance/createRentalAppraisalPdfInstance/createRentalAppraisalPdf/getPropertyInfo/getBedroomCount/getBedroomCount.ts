import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComBedroomCount } from "./getPropertyValueDotComBedroomCount/getPropertyValueDotComBedroomCount";
import { BedroomCountSchema } from "./types";

export const getBedroomCount = createPropertyInfoGetter({
  schema: z.object({ bedroomCount: BedroomCountSchema }),
  sourceFns: [getPropertyValueDotComBedroomCount],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { bedroomCount } = await Effect.runPromise(
    getBedroomCount({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ bedroomCount });
}
