import z from "zod";

/**
 * Frontage width in meters (optional)
 */
export const FrontageWidthSchema = z
  .number()
  .positive("Frontage width must be positive")
  .max(500, "Frontage width seems unreasonably large")
  .optional()
  .describe("Frontage width in meters");

export type FrontageWidth = z.infer<typeof FrontageWidthSchema>;
