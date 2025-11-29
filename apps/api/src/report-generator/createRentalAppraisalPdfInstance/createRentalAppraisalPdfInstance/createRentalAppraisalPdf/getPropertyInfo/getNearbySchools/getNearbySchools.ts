import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getRealEstateDotComNearbySchools } from "./getRealEstateDotComNearbySchools/getRealEstateDotComNearbySchools";
import { NearbySchoolsSchema } from "./types";

export const getNearbySchools = createPropertyInfoGetter({
  schema: z.object({ nearbySchools: NearbySchoolsSchema }),
  sourceFns: [getRealEstateDotComNearbySchools],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { nearbySchools } = await Effect.runPromise(
    getNearbySchools({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ nearbySchools });
}
