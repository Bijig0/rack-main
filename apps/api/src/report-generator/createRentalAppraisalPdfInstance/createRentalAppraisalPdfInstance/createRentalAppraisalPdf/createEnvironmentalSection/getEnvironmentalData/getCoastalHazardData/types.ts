import { z } from "zod";

// Coastal hazard risk level
export const CoastalHazardRiskLevelSchema = z.enum([
  "VERY_HIGH", // Within coastal inundation or erosion zone
  "HIGH", // Within 100m of coastal hazard zone
  "MODERATE", // Within 250m of coastal hazard zone
  "LOW", // Within 500m of coast
  "MINIMAL", // No coastal hazard risk
]);

export type CoastalHazardRiskLevel = z.infer<typeof CoastalHazardRiskLevelSchema>;

// Coastal hazard zone data
export const CoastalHazardZoneSchema = z.object({
  hazardType: z.string(), // e.g., "Erosion", "Inundation", "Storm Surge"
  description: z.string().optional(),
  affectsProperty: z.boolean(),
  distanceMeters: z.number().optional(),
});

export type CoastalHazardZone = z.infer<typeof CoastalHazardZoneSchema>;

// Coastal hazard analysis data
export const CoastalHazardDataSchema = z.object({
  riskLevel: CoastalHazardRiskLevelSchema,
  coastalHazardZones: z.array(CoastalHazardZoneSchema),
  affectedByCoastalHazard: z.boolean(),
  distanceToCoast: z.number().optional(), // meters
  isCoastalProperty: z.boolean(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type CoastalHazardData = z.infer<typeof CoastalHazardDataSchema>;
