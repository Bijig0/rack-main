import { z } from "zod";

export const PlanningSchemeSchema = z.string().nullish();

export type PlanningScheme = z.infer<typeof PlanningSchemeSchema>;
