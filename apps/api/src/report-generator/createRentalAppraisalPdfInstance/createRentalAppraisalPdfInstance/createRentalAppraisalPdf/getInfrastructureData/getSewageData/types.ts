import { z } from "zod";

// Sewerage pipeline properties schema based on the GeoJSON data
export const SewagePropertiesSchema = z.object({
  OBJECTID: z.number(),
  MXUNITID: z.string(),
  MXSITEID: z.string(),
  COMPKEY: z.number(),
  COMPTYPE: z.number(),
  UNITID: z.string(),
  UNITID2: z.string(),
  PARALLEL_LINE_NBR: z.string().nullable(),
  UNITTYPE: z.string(),
  UNITTYPE_DESC: z.string(),
  SEWER_NAME: z.string(),
  ASSET_ID: z.string(),
  ALTERNATE_ASSET_ID: z.string().nullable(),
  SUBAREA: z.string().nullable(),
  MATERIAL: z.string().nullable(),
  UPSTREAM_IL: z.number().nullable(),
  DOWNSTREAM_IL: z.number().nullable(),
  PIPE_LENGTH: z.number().nullable(),
  PIPE_WIDTH: z.number().nullable(),
  PIPE_HEIGHT: z.number().nullable(),
  GRADE: z.number().nullable(),
  DATE_RELINED: z.string().nullable(),
  DATE_OF_CONSTRUCTION: z.string().nullable(),
  EPMS_SEC_NO: z.string().nullable(),
  ASCONST_PLAN_NO: z.string().nullable(),
  SOURCE: z.string().nullable(),
  METHOD_OF_CAPTURE: z.string().nullable(),
  DATE_CAPTURED: z.string().nullable(),
  DATE_LAST_UPDATED: z.string().nullable(),
  SERVICE_STATUS: z.string().nullable(),
  SERVICE_STATUS_CHG_DATE: z.string().nullable(),
  SERVICE_STATUS_PLAN_NO: z.string().nullable(),
  COMMENTS: z.string().nullable(),
  MI_PRINX: z.number(),
});

// Coordinate type (supports both 2D and 3D)
const CoordinateSchema = z.union([
  z.tuple([z.number(), z.number()]), // 2D
  z.tuple([z.number(), z.number(), z.number()]), // 3D
]);

// Geometry schema for LineString
export const LineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(CoordinateSchema),
});

// Geometry schema for MultiLineString
export const MultiLineStringGeometrySchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(CoordinateSchema)),
});

// Union geometry schema
const GeometrySchema = z.union([
  LineStringGeometrySchema,
  MultiLineStringGeometrySchema,
]);

// Feature schema
export const SewageFeatureSchema = z.object({
  type: z.literal("Feature"),
  properties: SewagePropertiesSchema,
  geometry: GeometrySchema,
});

// Feature collection schema
export const SewageFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string(),
  crs: z
    .object({
      type: z.string(),
      properties: z.object({
        name: z.string(),
      }),
    })
    .optional(),
  features: z.array(SewageFeatureSchema),
});

// Inferred sewage pipeline data
export const InferredSewagePipelineSchema = z.object({
  pipelineId: z.string(),
  sewerName: z.string(),
  unitType: z.string(),
  unitTypeDescription: z.string(),
  material: z.string().nullable(),
  pipeWidth: z.number().nullable(),
  pipeLength: z.object({
    measurement: z.number().nullable(),
    unit: z.string(),
  }),
  serviceStatus: z.string().nullable(),
  dateOfConstruction: z.string().optional(),
  distance: z
    .object({
      measurement: z.number(),
      unit: z.string(),
    })
    .optional(),
  closestPoint: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

// Connection type for sewage
export type ConnectionType = "direct" | "septic" | "unknown";

export const SewageDataSchema = z.object({
  isConnected: z.boolean(),
  connectionType: z.string(),
  nearestPipeline: InferredSewagePipelineSchema.optional(),
  distanceToNearestPipeline: z.number().optional(),
  confidence: z.number().optional(),
});

// Sewage summary return type
export type SewageData = z.infer<typeof SewageDataSchema>;

// Type exports
export type SewageProperties = z.infer<typeof SewagePropertiesSchema>;
export type SewageFeature = z.infer<typeof SewageFeatureSchema>;
export type SewageFeatureCollection = z.infer<
  typeof SewageFeatureCollectionSchema
>;
export type InferredSewagePipeline = z.infer<
  typeof InferredSewagePipelineSchema
>;
