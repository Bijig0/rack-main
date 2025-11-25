import { z } from "zod";

export const PopulationAmountSchema = z.number().positive().nullish();

export type PopulationAmount = z.infer<typeof PopulationAmountSchema> | null;

export const DistanceFromCBDSchema = z
  .object({
    value: z.number().positive(),
    unit: z.literal("km"),
  })
  .nullish();

export type DistanceFromCBD = z.infer<typeof DistanceFromCBDSchema> | null;
