import { z } from "zod";

// --- Geometry schemas ---
const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

const LineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
});

// --- Stop properties schema ---
export const TransportStopPropertiesSchema = z
  .object({
    STOP_ID: z.string(),
    STOP_NAME: z.string(),
    MODE: z.string(),
  })
  .passthrough();

// --- Line properties schema ---
export const TransportLinePropertiesSchema = z
  .object({
    SHAPE_ID: z.string(),
    HEADSIGN: z.string().optional(),
    SHORT_NAME: z.string().optional(),
    LONG_NAME: z.string().optional(),
    MODE: z.string(),
  })
  .passthrough();

// --- Feature schemas ---
export const TransportStopFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: PointGeometrySchema,
  properties: TransportStopPropertiesSchema,
});

export const TransportLineFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: LineStringGeometrySchema,
  properties: TransportLinePropertiesSchema,
});

// --- Collection schemas ---
export const TransportStopsCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string().optional(),
  features: z.array(TransportStopFeatureSchema),
});

export const TransportLinesCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string().optional(),
  features: z.array(TransportLineFeatureSchema),
});

// --- Measurement schema ---
const MeasurementSchema = z.object({
  measurement: z.number(),
  unit: z.string(),
});

// --- Inferred/processed data schemas ---
export const InferredTransportStopSchema = z.object({
  stopId: z.string(),
  stopName: z.string(),
  mode: z.string(),
  distance: MeasurementSchema.optional(),
  coordinates: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  routes: z.array(z.string()).optional(), // Route names that serve this stop
});

export const InferredTransportLineSchema = z.object({
  shapeId: z.string(),
  headsign: z.string().optional(),
  shortName: z.string().optional(),
  longName: z.string().optional(),
  mode: z.string(),
  distance: MeasurementSchema.optional(),
});

export type TransportStopFeature = z.infer<typeof TransportStopFeatureSchema>;
export type TransportLineFeature = z.infer<typeof TransportLineFeatureSchema>;
export type InferredTransportStop = z.infer<typeof InferredTransportStopSchema>;
export type InferredTransportLine = z.infer<typeof InferredTransportLineSchema>;

export const InferredTransportStopsSchema = z.array(
  InferredTransportStopSchema
);
export const InferredTransportLinesSchema = z.array(
  InferredTransportLineSchema
);

export type InferredTransportStops = z.infer<
  typeof InferredTransportStopsSchema
>;
export type InferredTransportLines = z.infer<
  typeof InferredTransportLinesSchema
>;
