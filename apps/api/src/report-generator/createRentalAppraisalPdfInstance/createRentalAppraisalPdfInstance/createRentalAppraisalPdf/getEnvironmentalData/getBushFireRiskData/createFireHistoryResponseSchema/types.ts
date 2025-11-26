import { z } from "zod";
import { BBoxSchema } from "../../../../../../wfsDataToolkit/types";

// --- Geometry schemas ---
const PolygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

const MultiPolygonGeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
});

const FireHistoryGeometrySchema = z.union([
  PolygonGeometrySchema,
  MultiPolygonGeometrySchema,
]);

// --- Properties schema based on actual fire history dataset ---
export const FireHistoryPropertiesSchema = z
  .object({
    firetype: z.string().nullish(), // e.g., "Burn", "Fire"
    season: z.number().nullish(), // e.g., 2011
    fire_no: z.string().nullish(), // e.g., "R24"
    name: z.string().nullish(),
    start_date: z.string().nullish(), // ISO date string - can be null
    start_date_int: z.number().nullish(), // e.g., 20101021
    treatment_type: z.string().nullish(), // e.g., "FUEL REDUCTION"
    firekey: z.string().nullish(),
    dse_id: z.number().nullish(),
    cfa_id: z.number().nullish(),
    area_ha: z.number().nullish(),
  })
  .passthrough();

// --- Feature schema ---
export const FireHistoryFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().or(z.number()).optional(),
  geometry: FireHistoryGeometrySchema,
  geometry_name: z.string().optional(),
  properties: FireHistoryPropertiesSchema,
  bbox: BBoxSchema.optional(),
});

export type FireHistoryFeature = z.infer<typeof FireHistoryFeatureSchema>;
export type FireHistoryProperties = z.infer<typeof FireHistoryPropertiesSchema>;

// --- Measurement schema ---
const MeasurementSchema = z.object({
  measurement: z.number(),
  unit: z.string(),
});

// --- Inferred/processed data schema ---
export const InferredFireHistoryDataSchema = z.object({
  fireId: z.string().optional(),
  fireName: z.string().optional(),
  fireType: z.string().optional(),
  fireSeason: z.string().optional(),
  ignitionDate: z.string().optional(),
  area: MeasurementSchema.optional(), // area in hectares
  distance: MeasurementSchema.optional(), // distance from property in km
  district: z.string().optional(),
  region: z.string().optional(),
});

export type InferredFireHistoryData = z.infer<
  typeof InferredFireHistoryDataSchema
>;
