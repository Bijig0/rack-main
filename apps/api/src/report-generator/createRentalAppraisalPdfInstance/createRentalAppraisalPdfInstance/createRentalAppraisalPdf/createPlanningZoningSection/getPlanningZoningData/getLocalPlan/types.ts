import { z } from "zod";

// Local planning policy data
export const LocalPlanDataSchema = z.object({
  planName: z.string(),
  lgaName: z.string(),
  description: z.string().optional(),
  source: z.enum(["WFS", "LOOKUP", "INFERRED"]),
});

export type LocalPlanData = z.infer<typeof LocalPlanDataSchema> | null;
