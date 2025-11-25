import { z } from "zod";

/**
 * Year built - validates reasonable year range
 */
export const YearBuiltSchema = z
  .number()
  .int()
  .min(1800, "Year built must be 1800 or later")
  .max(
    new Date().getFullYear() + 2,
    "Year built cannot be more than 2 years in the future"
  )
  .nullish()
  .describe("Year the property was built");

export type YearBuilt = z.infer<typeof YearBuiltSchema>;
