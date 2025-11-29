import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getDomainDotComTimeline } from "./getDomainDotComTimeline/getDomainDotComTimeline";
import { PropertyTimelineSchema } from "./types";

export const getPropertyTimeline = createPropertyInfoGetter({
  schema: z.object({ propertyTimeline: PropertyTimelineSchema }),
  sourceFns: [getDomainDotComTimeline],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { propertyTimeline } = await Effect.runPromise(
    getPropertyTimeline({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ propertyTimeline });
}
