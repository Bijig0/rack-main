import { z } from "zod";

// Fire Management Zone properties schema based on the GeoJSON data
export const FireManagementZonePropertiesSchema = z.object({
  REGION_NAME: z.string(),
  DISTRICT_NAME: z.string(),
  ZONETYPE: z.number(),
  X_ZONETYPE: z.string(),
});

// Coordinate type (supports both 2D and 3D)
const CoordinateSchema = z.union([
  z.tuple([z.number(), z.number()]), // 2D
  z.tuple([z.number(), z.number(), z.number()]), // 3D
]);

// Geometry schema for Polygon
export const PolygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(CoordinateSchema)),
});

// Geometry schema for MultiPolygon
export const MultiPolygonGeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(CoordinateSchema))),
});

// Union geometry schema
const GeometrySchema = z.union([
  PolygonGeometrySchema,
  MultiPolygonGeometrySchema,
]);

// Feature schema
export const FireManagementZoneFeatureSchema = z.object({
  type: z.literal("Feature"),
  properties: FireManagementZonePropertiesSchema,
  geometry: GeometrySchema,
});

// Feature collection schema
export const FireManagementZoneFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  name: z.string(),
  features: z.array(FireManagementZoneFeatureSchema),
});

// Inferred fire management zone data
export const InferredFireManagementZoneSchema = z.object({
  regionName: z.string(),
  districtName: z.string(),
  zoneType: z.number(),
  zoneTypeDescription: z.string(),
  distance: z.object({
    measurement: z.number(),
    unit: z.string(),
  }),
  isWithinZone: z.boolean(),
});

// Type exports
export type FireManagementZoneProperties = z.infer<typeof FireManagementZonePropertiesSchema>;
export type FireManagementZoneFeature = z.infer<typeof FireManagementZoneFeatureSchema>;
export type FireManagementZoneFeatureCollection = z.infer<typeof FireManagementZoneFeatureCollectionSchema>;
export type InferredFireManagementZone = z.infer<typeof InferredFireManagementZoneSchema>;
