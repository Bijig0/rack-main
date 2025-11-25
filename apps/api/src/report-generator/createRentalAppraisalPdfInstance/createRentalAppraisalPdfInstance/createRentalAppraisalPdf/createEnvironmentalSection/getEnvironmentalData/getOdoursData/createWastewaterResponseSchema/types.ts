import { z } from "zod";
import { BBoxSchema } from "../../../../../../wfsDataToolkit/types";

// --- Geometry schema ---
const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

// --- Properties schema for wastewater treatment facilities ---
export const WastewaterPropertiesSchema = z
  .object({
    facility_name: z.string().optional(),
    facility_type: z.string().optional(),
    operator: z.string().optional(),
    capacity: z.string().or(z.number()).optional(),
    status: z.string().optional(),
    state: z.string().optional(),
  })
  .passthrough();

// --- Feature schema ---
export const WastewaterFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().or(z.number()).optional(),
  geometry: PointGeometrySchema,
  geometry_name: z.string().optional(),
  properties: WastewaterPropertiesSchema,
  bbox: BBoxSchema.optional(),
});

export type WastewaterFeature = z.infer<typeof WastewaterFeatureSchema>;
export type WastewaterProperties = z.infer<typeof WastewaterPropertiesSchema>;

// --- Measurement schema ---
const MeasurementSchema = z.object({
  measurement: z.number(),
  unit: z.string(),
});

// --- Inferred/processed data schema ---
export const InferredWastewaterDataSchema = z.object({
  facilityName: z.string().optional(),
  facilityType: z.string().optional(),
  operator: z.string().optional(),
  capacity: z.string().optional(),
  status: z.string().optional(),
  state: z.string().optional(),
  distance: MeasurementSchema.optional(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

export type InferredWastewaterData = z.infer<
  typeof InferredWastewaterDataSchema
>;
