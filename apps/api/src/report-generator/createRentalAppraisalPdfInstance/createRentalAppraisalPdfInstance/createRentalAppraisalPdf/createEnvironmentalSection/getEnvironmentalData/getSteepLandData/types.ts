import { z } from "zod";

// Landslide risk level
export const LandslideRiskLevelSchema = z.enum([
  "VERY_HIGH", // Within Landslip Overlay or Erosion Management Overlay
  "HIGH", // Within 50m of landslide risk area
  "MODERATE", // Within 100m of landslide risk area
  "LOW", // Some topographic considerations
  "MINIMAL", // No landslide risk
]);

export type LandslideRiskLevel = z.infer<typeof LandslideRiskLevelSchema>;

// Landslide hazard zone
export const LandslideHazardZoneSchema = z.object({
  hazardType: z.string(), // e.g., "Landslip", "Erosion", "Steep Slopes"
  overlayCode: z.string().optional(),
  description: z.string().optional(),
  affectsProperty: z.boolean(),
  distanceMeters: z.number().optional(),
});

export type LandslideHazardZone = z.infer<typeof LandslideHazardZoneSchema>;

// Steep land data
export const SteepLandDataSchema = z.object({
  riskLevel: LandslideRiskLevelSchema,
  landslideHazardZones: z.array(LandslideHazardZoneSchema),
  affectedByLandslideRisk: z.boolean(),
  requiresGeotechnicalAssessment: z.boolean(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type SteepLandData = z.infer<typeof SteepLandDataSchema>;
