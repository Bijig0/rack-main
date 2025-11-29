import z from "zod";
import { createPropertyInfoGetter } from "../createPropertyInfoGetter";
import { getPropertyValueDotComDistanceAppraisalSummary } from "./getPropertyValueDotComePropertyType/getPropertyValueDotComDistanceAppraisalSummary";
import { AppraisalSummarySchema } from "./types";

export const getAppraisalSummary = createPropertyInfoGetter({
  schema: z.object({ appraisalSummary: AppraisalSummarySchema }),
  sourceFns: [getPropertyValueDotComDistanceAppraisalSummary],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { appraisalSummary } = await Effect.runPromise(
    getAppraisalSummary({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  console.log({ appraisalSummary });
}
