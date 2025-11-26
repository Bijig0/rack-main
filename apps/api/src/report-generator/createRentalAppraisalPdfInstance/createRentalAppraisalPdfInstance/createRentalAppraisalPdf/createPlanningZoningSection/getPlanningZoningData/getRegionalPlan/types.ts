import z from "zod";

export const RegionalPlanSchema = z.object({
  regionalPlan: z.string().nullish(),
});

export type RegionalPlan = z.infer<typeof RegionalPlanSchema>;