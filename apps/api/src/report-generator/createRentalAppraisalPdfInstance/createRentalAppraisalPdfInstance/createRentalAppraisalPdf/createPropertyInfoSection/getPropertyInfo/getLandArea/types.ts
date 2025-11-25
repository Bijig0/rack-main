import { z } from "zod";

export const LandAreaSchema = z
  .object({
    value: z.number().positive(),
    unit: z.literal("m²"),
  })
  .nullish();

export type LandArea = z.infer<typeof LandAreaSchema> | null;
