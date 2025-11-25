import { z } from "zod";

export const PropertyTypeSchema = z.string().min(1).nullish();

export type PropertyType = z.infer<typeof PropertyTypeSchema> | null;
