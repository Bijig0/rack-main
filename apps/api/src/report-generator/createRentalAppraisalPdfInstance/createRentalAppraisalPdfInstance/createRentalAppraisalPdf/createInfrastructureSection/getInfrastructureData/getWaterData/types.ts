import { z } from "zod";

/**
 * Yarra Valley Water (YVW) WFS Response Schemas
 */

// Water pipe properties from YVW WFS
export const YVWWaterPipePropertiesSchema = z.object({
  OBJECTID: z.number().optional(),
  MXUNITID: z.string().optional(),
  MXSITEID: z.string().optional(),
  COMPKEY: z.number().optional(),
  UNITID: z.string().optional(),
  UNITTYPE: z.string().optional(),
  PIPE_DIAMETER: z.number().optional(), // mm
  PIPE_MATERIAL: z.string().optional(),
  PIPE_LENGTH: z.number().optional(), // meters
  SERVICE_STATUS: z.string().optional(),
  DATE_OF_CONSTRUCTION: z.string().nullable().optional(),
  ASSET_ID: z.string().optional(),
  PRESSURE_ZONE: z.string().nullable().optional(),
});

// Water hydrant properties from YVW WFS
export const YVWHydrantPropertiesSchema = z.object({
  OBJECTID: z.number().optional(),
  MXASSETNUM: z.string().optional(),
  HYDRANT_TYPE: z.string().optional(),
  SERVICE_STATUS: z.string().optional(),
  LOCATION: z.string().nullable().optional(),
  ASSET_ID: z.string().optional(),
});

// Water distribution zone properties
export const YVWDistributionZonePropertiesSchema = z.object({
  OBJECTID: z.number().optional(),
  ZONE_ID: z.string().optional(),
  ZONE_NAME: z.string().optional(),
  PRESSURE_ZONE: z.string().optional(),
  SERVICE_AREA: z.string().optional(),
});

// Water storage properties (reservoirs/tanks)
export const YVWStoragePropertiesSchema = z.object({
  OBJECTID: z.number().optional(),
  ASSET_ID: z.string().optional(),
  STORAGE_TYPE: z.string().optional(),
  CAPACITY: z.number().nullable().optional(),
  NAME: z.string().optional(),
});

/**
 * Vicmap Hydro Response Schemas (Fallback)
 */

// Vicmap water infrastructure line properties
export const VicmapWaterLinePropertiesSchema = z.object({
  pfi: z.string().optional(),
  ufi: z.string().optional(),
  feature_type: z.string().optional(),
  feature_type_code: z.string().optional(),
  name: z.string().nullable().optional(),
  origin: z.string().optional(),
});

// Vicmap dam/reservoir properties
export const VicmapDamPropertiesSchema = z.object({
  pfi: z.string().optional(),
  name: z.string().nullable().optional(),
  reservoir_name: z.string().nullable().optional(),
  dam_type: z.string().nullable().optional(),
  capacity: z.number().nullable().optional(),
});

/**
 * Coordinate and Geometry Schemas
 */

const CoordinatePairSchema = z.tuple([z.number(), z.number()]);
const CoordinateTripleSchema = z.tuple([z.number(), z.number(), z.number()]);
const CoordinateSchema = z.union([CoordinatePairSchema, CoordinateTripleSchema]);

const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: CoordinateSchema,
});

const LineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(CoordinateSchema),
});

const MultiLineStringGeometrySchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(CoordinateSchema)),
});

const PolygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(CoordinateSchema)),
});

const MultiPolygonGeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(CoordinateSchema))),
});

const GeometrySchema = z.union([
  PointGeometrySchema,
  LineStringGeometrySchema,
  MultiLineStringGeometrySchema,
  PolygonGeometrySchema,
  MultiPolygonGeometrySchema,
]);

/**
 * Feature and FeatureCollection Schemas
 */

export const YVWWaterPipeFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: YVWWaterPipePropertiesSchema,
  geometry: GeometrySchema,
});

export const YVWHydrantFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: YVWHydrantPropertiesSchema,
  geometry: GeometrySchema,
});

export const YVWDistributionZoneFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: YVWDistributionZonePropertiesSchema,
  geometry: GeometrySchema,
});

export const YVWStorageFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: YVWStoragePropertiesSchema,
  geometry: GeometrySchema,
});

export const VicmapWaterLineFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: VicmapWaterLinePropertiesSchema,
  geometry: GeometrySchema,
});

export const VicmapDamFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: VicmapDamPropertiesSchema,
  geometry: GeometrySchema,
});

export const YVWWaterPipeFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(YVWWaterPipeFeatureSchema),
  totalFeatures: z.number().optional(),
  numberMatched: z.number().optional(),
  numberReturned: z.number().optional(),
  timeStamp: z.string().optional(),
  crs: z
    .object({
      type: z.string(),
      properties: z.record(z.string(), z.any()),
    })
    .nullable()
    .optional(),
});

export const YVWHydrantFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(YVWHydrantFeatureSchema),
  totalFeatures: z.number().optional(),
  numberMatched: z.number().optional(),
  numberReturned: z.number().optional(),
  timeStamp: z.string().optional(),
  crs: z
    .object({
      type: z.string(),
      properties: z.record(z.string(), z.any()),
    })
    .nullable()
    .optional(),
});

export const YVWDistributionZoneFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(YVWDistributionZoneFeatureSchema),
  totalFeatures: z.number().optional(),
  numberMatched: z.number().optional(),
  numberReturned: z.number().optional(),
  timeStamp: z.string().optional(),
  crs: z
    .object({
      type: z.string(),
      properties: z.record(z.string(), z.any()),
    })
    .nullable()
    .optional(),
});

export const VicmapWaterLineFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(VicmapWaterLineFeatureSchema),
  totalFeatures: z.number().optional(),
  numberMatched: z.number().optional(),
  numberReturned: z.number().optional(),
  timeStamp: z.string().optional(),
  crs: z
    .object({
      type: z.string(),
      properties: z.record(z.string(), z.any()),
    })
    .nullable()
    .optional(),
});

/**
 * Processed/Inferred Data Schemas
 */

export const WaterMainSchema = z.object({
  distance: z.number(), // meters
  diameter: z.number().nullable(), // mm
  material: z.string().nullable(),
  type: z.string().nullable(),
  assetId: z.string().optional(),
  serviceStatus: z.string().nullable(),
  pressureZone: z.string().nullable(),
  closestPoint: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export const HydrantSchema = z.object({
  distance: z.number(), // meters
  type: z.string().nullable(),
  serviceStatus: z.string().nullable(),
  location: z.string().nullable(),
  assetId: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export const InferredWaterMainSchema = z.object({
  diameter: z.number().nullable(), // mm
  material: z.string().nullable(),
  status: z.string().nullable(),
  pressureZone: z.string().nullable(),
});

export const WaterAlertSchema = z.object({
  type: z.enum(["risk", "note"]),
  message: z.string(),
});

export const WaterInfrastructureSchema = z.object({
  isConnectedToMains: z.boolean(),
  distanceToNearestMain: z.number().nullable(),
  nearestWaterMain: InferredWaterMainSchema.optional(),
  alerts: z.array(WaterAlertSchema).optional(),
});

// Legacy schema - kept for backwards compatibility
export const WaterDataSchema = z.object({
  hasWaterConnection: z.boolean(),
  nearestWaterMain: WaterMainSchema.optional(),
  nearestHydrant: HydrantSchema.optional(),
  waterPressureZone: z.string().nullable(),
  waterServiceProvider: z.string(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

/**
 * Type Exports
 */

export type YVWWaterPipeProperties = z.infer<
  typeof YVWWaterPipePropertiesSchema
>;
export type YVWHydrantProperties = z.infer<typeof YVWHydrantPropertiesSchema>;
export type YVWDistributionZoneProperties = z.infer<
  typeof YVWDistributionZonePropertiesSchema
>;
export type YVWStorageProperties = z.infer<typeof YVWStoragePropertiesSchema>;
export type VicmapWaterLineProperties = z.infer<
  typeof VicmapWaterLinePropertiesSchema
>;
export type VicmapDamProperties = z.infer<typeof VicmapDamPropertiesSchema>;

export type YVWWaterPipeFeature = z.infer<typeof YVWWaterPipeFeatureSchema>;
export type YVWHydrantFeature = z.infer<typeof YVWHydrantFeatureSchema>;
export type YVWDistributionZoneFeature = z.infer<
  typeof YVWDistributionZoneFeatureSchema
>;
export type YVWStorageFeature = z.infer<typeof YVWStorageFeatureSchema>;
export type VicmapWaterLineFeature = z.infer<
  typeof VicmapWaterLineFeatureSchema
>;
export type VicmapDamFeature = z.infer<typeof VicmapDamFeatureSchema>;

export type YVWWaterPipeFeatureCollection = z.infer<
  typeof YVWWaterPipeFeatureCollectionSchema
>;
export type YVWHydrantFeatureCollection = z.infer<
  typeof YVWHydrantFeatureCollectionSchema
>;
export type YVWDistributionZoneFeatureCollection = z.infer<
  typeof YVWDistributionZoneFeatureCollectionSchema
>;
export type VicmapWaterLineFeatureCollection = z.infer<
  typeof VicmapWaterLineFeatureCollectionSchema
>;

export type WaterMain = z.infer<typeof WaterMainSchema>;
export type Hydrant = z.infer<typeof HydrantSchema>;
export type InferredWaterMain = z.infer<typeof InferredWaterMainSchema>;
export type WaterAlert = z.infer<typeof WaterAlertSchema>;
export type WaterInfrastructure = z.infer<typeof WaterInfrastructureSchema>;
export type WaterData = z.infer<typeof WaterDataSchema>;
