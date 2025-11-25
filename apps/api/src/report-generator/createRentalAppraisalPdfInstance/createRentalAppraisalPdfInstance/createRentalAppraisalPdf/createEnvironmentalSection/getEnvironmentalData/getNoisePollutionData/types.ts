import { z } from "zod";
import { GeometrySchema } from "../../../../../wfsDataToolkit/types";

// Road classification types based on Vicmap Transport
export const RoadClassificationSchema = z.enum([
  "ARTERIAL",
  "HIGHWAY",
  "FREEWAY",
  "MAIN_ROAD",
  "COLLECTOR",
  "LOCAL",
  "SERVICE_ROAD",
  "TRACK",
  "UNKNOWN",
]);

export type RoadClassification = z.infer<typeof RoadClassificationSchema>;

// Road properties schema from Vicmap Transport TR_ROAD layer
export const RoadPropertiesSchema = z.object({
  pfi: z.number().optional(),
  ufi: z.number().optional(),
  road_name: z.string().optional().nullable(),
  road_type: z.string().optional().nullable(),
  road_name_id: z.number().optional().nullable(),
  ez_ordinal: z.number().optional().nullable(),
  directory_ind: z.string().optional().nullable(),
  route_flag: z.string().optional().nullable(),
  multi_flag: z.string().optional().nullable(),
  from_ufi: z.number().optional().nullable(),
  to_ufi: z.number().optional().nullable(),
  feature_type_id: z.string().optional().nullable(),
  locality_id: z.number().optional().nullable(),
  direction_code: z.string().optional().nullable(),
  class_code: z.union([z.string(), z.number()]).optional().nullable(),
  alternatename: z.string().optional().nullable(),
  pfi_created: z.string().optional().nullable(),
  ufi_created: z.string().optional().nullable(),
});

export type RoadProperties = z.infer<typeof RoadPropertiesSchema>;

// Road feature schema
export const RoadFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: RoadPropertiesSchema,
  geometry: GeometrySchema,
});

export type RoadFeature = z.infer<typeof RoadFeatureSchema>;

// Road features array
export const RoadFeaturesSchema = z.array(RoadFeatureSchema);
export type RoadFeatures = z.infer<typeof RoadFeaturesSchema>;

// Noise level classification
export const NoiseLevelSchema = z.enum([
  "VERY_HIGH", // Major highways/freeways within 50m
  "HIGH", // Arterial roads within 100m or highways 50-200m
  "MODERATE", // Main roads within 100m or arterials 100-300m
  "LOW", // Collector roads nearby or distant main roads
  "MINIMAL", // Only local roads or no significant roads
]);

export type NoiseLevel = z.infer<typeof NoiseLevelSchema>;

// Noise source information
export const NoiseSourceSchema = z.object({
  roadName: z.string(),
  roadType: z.string(),
  classification: RoadClassificationSchema,
  distanceMeters: z.number(),
  estimatedNoiseLevel: z.number(), // dB(A) estimate
});

export type NoiseSource = z.infer<typeof NoiseSourceSchema>;

// Noise pollution data
export const NoisePollutionDataSchema = z.object({
  noiseLevel: NoiseLevelSchema,
  primarySources: z.array(NoiseSourceSchema),
  nearbyRoadsCount: z.number(),
  estimatedAverageNoiseLevel: z.number(), // Average dB(A)
  trafficVolumeContribution: z.number().optional(), // Additional dB(A) from traffic volume
  description: z.string(),
});

export type NoisePollutionData = z.infer<typeof NoisePollutionDataSchema>;

// Distance measurement
export const DistanceMeasurementSchema = z.object({
  value: z.number(),
  unit: z.literal("metres"),
});

export type DistanceMeasurement = z.infer<typeof DistanceMeasurementSchema>;
