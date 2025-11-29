import { z } from "zod";

export const BathroomCountSchema = z.number().int().positive();

export type BathroomCount = z.infer<typeof BathroomCountSchema> | null;
