import { z } from "zod";
import { GeometrySchema } from "../../../../../wfsDataToolkit/types";

// Flood risk level classification
export const FloodRiskLevelSchema = z.enum([
  "VERY_HIGH", // Property within historical flood extent or high-risk zone
  "HIGH", // Property within 1 in 100 year flood extent
  "MODERATE", // Property near flood-prone areas (within 100m)
  "LOW", // Property in low-risk area but within catchment
  "MINIMAL", // No identified flood risk
]);

export type FloodRiskLevel = z.infer<typeof FloodRiskLevelSchema>;

// 2022 Historical Flood Event properties (VIC_FLOOD_HISTORY_PUBLIC)
export const FloodHistory2022PropertiesSchema = z.object({
  objectid: z.number().optional(),
  event_name: z.string().optional().nullable(),
  event_date: z.string().optional().nullable(),
  source: z.string().optional().nullable(), // e.g., "Satellite imagery", "Aerial photography"
  data_quality: z.string().optional().nullable(),
  comments: z.string().optional().nullable(),
  shape_area: z.number().optional().nullable(),
  shape_length: z.number().optional().nullable(),
});

export type FloodHistory2022Properties = z.infer<typeof FloodHistory2022PropertiesSchema>;

export const FloodHistory2022FeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: FloodHistory2022PropertiesSchema,
  geometry: GeometrySchema,
});

export type FloodHistory2022Feature = z.infer<typeof FloodHistory2022FeatureSchema>;

export const FloodHistory2022FeaturesSchema = z.array(FloodHistory2022FeatureSchema);
export type FloodHistory2022Features = z.infer<typeof FloodHistory2022FeaturesSchema>;

// 1 in 100 Year Flood Extent properties
export const Flood100YearPropertiesSchema = z.object({
  objectid: z.number().optional(),
  extent_100y_ari: z.string().optional().nullable(), // Area Recurrence Interval
  catchment_name: z.string().optional().nullable(),
  data_source: z.string().optional().nullable(),
  year_modelled: z.union([z.string(), z.number()]).optional().nullable(),
  shape_area: z.number().optional().nullable(),
  shape_length: z.number().optional().nullable(),
});

export type Flood100YearProperties = z.infer<typeof Flood100YearPropertiesSchema>;

export const Flood100YearFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: Flood100YearPropertiesSchema,
  geometry: GeometrySchema,
});

export type Flood100YearFeature = z.infer<typeof Flood100YearFeatureSchema>;

export const Flood100YearFeaturesSchema = z.array(Flood100YearFeatureSchema);
export type Flood100YearFeatures = z.infer<typeof Flood100YearFeaturesSchema>;

// Flood source information
export const FloodSourceSchema = z.object({
  sourceName: z.string(), // e.g., "2022 October Flood Event", "1 in 100 Year Flood Extent"
  sourceType: z.string(), // e.g., "Historical", "Modelled"
  distanceMeters: z.number(),
  affectsProperty: z.boolean(), // Whether property is within flood extent
  dataQuality: z.string().optional(),
});

export type FloodSource = z.infer<typeof FloodSourceSchema>;

// Flood risk data
export const FloodRiskDataSchema = z.object({
  riskLevel: FloodRiskLevelSchema,
  affectedByHistoricalFlood: z.boolean(), // Within 2022 flood extent
  within100YearFloodExtent: z.boolean(), // Within 1 in 100 year extent
  floodSources: z.array(FloodSourceSchema),
  nearbyFloodZonesCount: z.number(),
  minimumDistanceToFloodZone: z.number().optional(), // Meters to nearest flood zone
  description: z.string(),
  recommendations: z.array(z.string()).optional(), // Planning and risk mitigation advice
});

export type FloodRiskData = z.infer<typeof FloodRiskDataSchema>;
export type InferredFloodRiskData = FloodRiskData;

// Distance measurement
export const DistanceMeasurementSchema = z.object({
  value: z.number(),
  unit: z.literal("metres"),
});

export type DistanceMeasurement = z.infer<typeof DistanceMeasurementSchema>;
