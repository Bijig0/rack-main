import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getDomainDotComSimilarPropertiesForRent } from "./getDomainDotComSimilarPropertiesForRent/getDomainDotComSimilarPropertiesForRent";
import { SimilarPropertiesForRentSchema } from "./types";

export const getSimilarPropertiesForRent = createPropertyInfoGetter({
  schema: z.object({
    similarPropertiesForRent: SimilarPropertiesForRentSchema,
  }),
  sourceFns: [getDomainDotComSimilarPropertiesForRent],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  // Test with 45 Walpole Street which should have rentals nearby
  const { similarPropertiesForRent } = await Effect.runPromise(
    getSimilarPropertiesForRent({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log(JSON.stringify({ similarPropertiesForRent }, null, 2));
}
