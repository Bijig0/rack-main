import { z } from "zod";

export const LocalPlanSubprecinctSchema = z.string().nullish();

export type LocalPlanSubprecinct = z.infer<typeof LocalPlanSubprecinctSchema>;
