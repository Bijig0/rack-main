import { z } from "zod";

// Waterway significance level
export const WaterwaySignificanceLevelSchema = z.enum([
  "VERY_HIGH", // Within waterway buffer or wetland
  "HIGH", // Within 50m of waterway/wetland
  "MODERATE", // Within 100m of waterway/wetland
  "LOW", // Within 200m of waterway/wetland
  "MINIMAL", // No waterway constraints
]);

export type WaterwaySignificanceLevel = z.infer<typeof WaterwaySignificanceLevelSchema>;

// Waterway feature data
export const WaterwayFeatureSchema = z.object({
  featureType: z.string(), // e.g., "River", "Creek", "Wetland", "Lake"
  name: z.string().optional(),
  distanceMeters: z.number(),
  inBuffer: z.boolean(), // Within waterway buffer overlay
});

export type WaterwayFeature = z.infer<typeof WaterwayFeatureSchema>;

// Waterway data
export const WaterwayDataSchema = z.object({
  significanceLevel: WaterwaySignificanceLevelSchema,
  waterwayFeatures: z.array(WaterwayFeatureSchema),
  inWaterwayBuffer: z.boolean(),
  nearestWaterwayDistance: z.number().optional(),
  requiresWaterwayAssessment: z.boolean(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type WaterwayData = z.infer<typeof WaterwayDataSchema>;
