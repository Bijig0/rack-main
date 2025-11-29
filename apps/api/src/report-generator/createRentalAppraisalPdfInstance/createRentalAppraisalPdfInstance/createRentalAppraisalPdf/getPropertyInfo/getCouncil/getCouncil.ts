import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComeCouncil } from "./getPropertyValueDotComeCouncil/getPropertyValueDotComeCouncil";
import { CouncilSchema } from "./types";

export const getCouncil = createPropertyInfoGetter({
  schema: z.object({ council: CouncilSchema }),
  sourceFns: [getPropertyValueDotComeCouncil],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { council } = await Effect.runPromise(
    getCouncil({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ council });
}
