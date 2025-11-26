import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getDomainDotComSimilarPropertiesForSale } from "./getDomainDotComSimilarPropertiesForSale/getDomainDotComSimilarPropertiesForSale";
import { SimilarPropertiesForSaleSchema } from "./types";

export const getSimilarPropertiesForSale = createPropertyInfoGetter({
  schema: z.object({
    similarPropertiesForSale: SimilarPropertiesForSaleSchema,
  }),
  sourceFns: [getDomainDotComSimilarPropertiesForSale],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  // Test with 45 Walpole Street which should have properties for sale nearby
  const { similarPropertiesForSale } = await Effect.runPromise(
    getSimilarPropertiesForSale({
      address: {
        addressLine: "45 Walpole Street",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log(JSON.stringify({ similarPropertiesForSale }, null, 2));
}
