import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComDistanceFromCBD } from "./getPropertyValueDotComePropertyType/getPropertyValueDotComDistanceFromCBD";
import { DistanceFromCBDSchema } from "./types";

export const getDistanceFromCBD = createPropertyInfoGetter({
  schema: z.object({ distanceFromCBD: DistanceFromCBDSchema }),
  sourceFns: [getPropertyValueDotComDistanceFromCBD],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { distanceFromCBD } = await Effect.runPromise(
    getDistanceFromCBD({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ distanceFromCBD });
}
