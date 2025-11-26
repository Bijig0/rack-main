import { z } from "zod";

export const LocalPlanPrecinctSchema = z.string().nullish();

export type LocalPlanPrecinct = z.infer<typeof LocalPlanPrecinctSchema>;
