import { z } from "zod";
import { GeometrySchema } from "../../../../../wfsDataToolkit/types";

// Easement properties schema (based on your data)
const EasementPropertiesSchema = z.object({
  ufi: z.number(),
  pfi: z.string(),
  status: z.string(),
  task_id: z.number(),
  pfi_created: z.string().nullable(),
  ufi_old: z.number().nullable(),
  ufi_created: z.string(),
});

// Geographic Feature schema
export const EasementFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: EasementPropertiesSchema,
  geometry: GeometrySchema,
});

// Main schema for the response
export const EasementFeaturesSchema = z.array(EasementFeatureSchema);

export const DatasetSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export type Dataset = z.infer<typeof DatasetSchema>;

// Measurement schemas
export const LengthMeasurementSchema = z.object({
  value: z.number(),
  unit: z.literal("metres"),
  type: z.literal("length"),
});

export const AreaMeasurementSchema = z.object({
  value: z.number(),
  unit: z.literal("square metres"),
  type: z.literal("area"),
});

export const MeasurementSchema = z.union([
  LengthMeasurementSchema,
  AreaMeasurementSchema,
]);

// Updated InferredEasementData schema with proper measurement handling
export const InferredEasementDataSchema = z.object({
  dataset: DatasetSchema,
  type: z.string(),
  measurement: MeasurementSchema,
  status: z.string(),
  description: z.string(),
});

// Infer types
export type LengthMeasurement = z.infer<typeof LengthMeasurementSchema>;
export type AreaMeasurement = z.infer<typeof AreaMeasurementSchema>;
export type Measurement = z.infer<typeof MeasurementSchema>;
export type InferredEasementData = z.infer<typeof InferredEasementDataSchema>;
export type EasementFeature = z.infer<typeof EasementFeatureSchema>;
export type EasementFeatures = z.infer<typeof EasementFeaturesSchema>;

// Type guards for discriminated union
export function isLengthMeasurement(
  measurement: Measurement
): measurement is LengthMeasurement {
  return measurement.type === "length";
}

export function isAreaMeasurement(
  measurement: Measurement
): measurement is AreaMeasurement {
  return measurement.type === "area";
}

/**
 * Simplified easement data for property reports
 *
 * This is the new format optimized for rental appraisal reports, focusing on
 * information that matters to landlords and tenants rather than technical GIS details.
 */
export const EasementDataSchema = z.object({
  /** Whether the property has any easements */
  hasEasement: z.boolean(),

  /** Primary easement type (if any) */
  type: z
    .enum(["drainage", "sewerage", "access", "utility", "unknown"])
    .optional(),

  /** Human-readable location description (e.g., "rear boundary", "north side") */
  locationDescription: z.string().optional(),

  /** Impact level on property use and development */
  impactLevel: z.enum(["none", "low", "moderate", "high"]),

  /** Important alerts or notes about easements */
  alerts: z.array(z.string()).optional(),
});

export type EasementData = z.infer<typeof EasementDataSchema>;
