import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComePropertyType } from "./getPropertyValueDotComePropertyType/getPropertyValueDotComePropertyType";
import { PropertyTypeSchema } from "./types";

export const getPropertyType = createPropertyInfoGetter({
  schema: z.object({ propertyType: PropertyTypeSchema }),
  sourceFns: [getPropertyValueDotComePropertyType],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { propertyType } = await Effect.runPromise(
    getPropertyType({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ propertyType });
}
