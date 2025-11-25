import { z } from "zod";

// Zone precinct type - derived from planning overlay combinations
export const ZonePrecinctTypeSchema = z.enum([
  "Heritage Precinct",
  "Design and Development Precinct",
  "Environmental Precinct",
  "Mixed Use Precinct",
  "Activity Centre Precinct",
  "Special Use Precinct",
]);

export type ZonePrecinctType = z.infer<typeof ZonePrecinctTypeSchema>;

// Zone precinct data
export const ZonePrecinctDataSchema = z.object({
  precinctType: ZonePrecinctTypeSchema.optional(),
  description: z.string(),
  overlayTypes: z.array(z.string()),
  significance: z.enum(["HIGH", "MODERATE", "LOW"]).optional(),
});

export type ZonePrecinctData = z.infer<typeof ZonePrecinctDataSchema> | null;
