import { z } from "zod";

// Local planning policy data
export const LocalPlanDataSchema = z.object({
  localPlan: z.string().nullish(),
  lgaName: z.string().nullish(),
});

export type LocalPlanData = z.infer<typeof LocalPlanDataSchema> | null;
