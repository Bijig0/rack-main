import { z } from "zod";

/**
 * Estimated value range
 */
export const EstimatedValueRangeSchema = z
  .object({
    low: z.number().positive("Minimum value must be positive"),
    mid: z.number().positive("Mid value must be positive"),
    high: z.number().positive("Maximum value must be positive"),
    currency: z.string().default("AUD"),
    source: z
      .enum(["corelogic", "domain", "custom_model", "manual"])
      .optional(),
    confidence: z
      .number()
      .min(0)
      .max(1)
      .optional()
      .describe("Confidence score 0-1"),
    updatedAt: z.date().or(z.string().datetime()).optional(),
  })
  .refine((data) => data.high >= data.low, {
    message: "Maximum value must be greater than or equal to minimum value",
  })
  .nullish()
  .describe("Estimated property value range");

export type EstimatedValueRange = z.infer<typeof EstimatedValueRangeSchema>;
