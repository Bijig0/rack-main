import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComPropertyImage } from "./getPropertyValueDotComePropertyImage/getPropertyValueDotComePropertyImage";
import { PropertyImageSchema } from "./types";

export const getPropertyImage = createPropertyInfoGetter({
  schema: z.object({ propertyImage: PropertyImageSchema }),
  sourceFns: [getPropertyValueDotComPropertyImage],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { propertyImage } = await Effect.runPromise(
    getPropertyImage({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ propertyImage });
}
