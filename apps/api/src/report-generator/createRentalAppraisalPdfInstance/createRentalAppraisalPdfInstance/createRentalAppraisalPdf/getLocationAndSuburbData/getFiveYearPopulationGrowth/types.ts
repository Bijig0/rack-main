import { z } from "zod";

export const FiveYearPopulationGrowthSchema = z.number().positive().nullish();

export type FiveYearPopulationGrowth = z.infer<
  typeof FiveYearPopulationGrowthSchema
> | null;
