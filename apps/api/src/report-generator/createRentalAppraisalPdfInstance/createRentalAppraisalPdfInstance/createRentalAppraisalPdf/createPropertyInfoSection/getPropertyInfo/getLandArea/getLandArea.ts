import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComLandArea } from "./getPropertyValueDotComLandArea/getPropertyValueDotComLandArea";
import { LandAreaSchema } from "./types";

export const getLandArea = createPropertyInfoGetter({
  schema: z.object({ landArea: LandAreaSchema }),
  sourceFns: [getPropertyValueDotComLandArea],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { landArea } = await Effect.runPromise(
    getLandArea({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ landArea });
}
