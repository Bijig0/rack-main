import { z } from "zod";
import { BBoxSchema } from "../../../../../../wfsDataToolkit/types";

// --- Geometry schema for transmission lines (LineString/MultiLineString) ---
const LineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(z.tuple([z.number(), z.number()])), // Array of [longitude, latitude]
});

const MultiLineStringGeometrySchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

const TransmissionLineGeometrySchema = z.union([
  LineStringGeometrySchema,
  MultiLineStringGeometrySchema,
  PointGeometrySchema,
]);

// --- Properties schema for National Electricity Infrastructure ---
export const TransmissionLinePropertiesSchema = z
  .object({
    GmlID: z.string().optional(),
    OBJECTID: z.number().optional(),
    FEATURETYPE: z.string().optional(),
    DESCRIPTION: z.string().optional(),
    CLASS: z.string().optional(),
    TRANSMISSIONLINE_NAME: z.string().optional(),
    OPERATIONALSTATUS: z.string().optional(),
    STATE: z.string().optional(),
    SPATIALCONFIDENCE: z.number().optional(),
    REVISED: z.string().optional(),
    COMMENT: z.string().optional(),
    GA_GUID: z.string().optional(),
    LENGTH_M: z.number().optional(),
    CAPACITYKV: z.number().optional(),
    SHAPE_Length: z.number().optional(),
  })
  .passthrough();

// --- Feature schema ---
export const TransmissionLineFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().or(z.number()).optional(),
  geometry: TransmissionLineGeometrySchema,
  geometry_name: z.string().optional(),
  properties: TransmissionLinePropertiesSchema,
  bbox: BBoxSchema.optional(),
});

export type TransmissionLineFeature = z.infer<
  typeof TransmissionLineFeatureSchema
>;
export type TransmissionLineProperties = z.infer<
  typeof TransmissionLinePropertiesSchema
>;

// --- Measurement schema ---
const MeasurementSchema = z.object({
  measurement: z.number(),
  unit: z.string(),
});

// --- Inferred/processed data schema ---
export const InferredTransmissionLineDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  featureType: z.string().optional(),
  class: z.string().optional(),
  operationalStatus: z.string().optional(),
  state: z.string().optional(),
  capacityKv: z.number().optional(),
  length: MeasurementSchema.optional(),
  distance: MeasurementSchema.optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export type InferredTransmissionLineData = z.infer<
  typeof InferredTransmissionLineDataSchema
>;
