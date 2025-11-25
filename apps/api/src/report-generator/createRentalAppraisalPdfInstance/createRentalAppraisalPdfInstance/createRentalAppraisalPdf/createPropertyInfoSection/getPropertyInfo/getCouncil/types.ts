import { z } from "zod";

/**
 * Council/Local Government Area
 */
export const CouncilSchema = z
  .string()
  .min(1, "Council name is required")
  .max(100, "Council name is too long")
  .nullish()
  .describe("Local government area or council");

export type Council = z.infer<typeof CouncilSchema> | null;
