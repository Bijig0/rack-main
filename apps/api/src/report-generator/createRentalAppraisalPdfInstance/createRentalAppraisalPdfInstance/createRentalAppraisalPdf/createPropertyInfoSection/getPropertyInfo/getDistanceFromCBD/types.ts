import { z } from "zod";

export const DistanceFromCBDSchema = z
  .object({
    value: z.number().positive(),
    unit: z.literal("km"),
  })
  .nullish();

export type DistanceFromCBD = z.infer<typeof DistanceFromCBDSchema> | null;
