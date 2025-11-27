import { z } from "zod";

export const BedroomCountSchema = z.number().int().positive();

export type BedroomCount = z.infer<typeof BedroomCountSchema> | null;
