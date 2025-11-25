import { z } from "zod";

// Coordinate pair: [longitude, latitude]
const CoordinatePairSchema = z.tuple([z.number(), z.number()]);

// Linear ring: array of coordinate pairs (first and last should be the same in a valid polygon)
const LinearRingSchema = z.array(CoordinatePairSchema);

// Polygon: array of linear rings (first is outer ring, rest are holes)
const PolygonCoordinatesSchema = z.array(LinearRingSchema);

// MultiPolygon: array of polygons
const MultiPolygonCoordinatesSchema = z.array(PolygonCoordinatesSchema);

// Point geometry
const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: CoordinatePairSchema,
});

// Polygon geometry
const PolygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: PolygonCoordinatesSchema,
});

// MultiPolygon geometry (like your data)
const MultiPolygonGeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: MultiPolygonCoordinatesSchema,
});

// LineString geometry
const LineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(CoordinatePairSchema),
});

// MultiLineString geometry
const MultiLineStringGeometrySchema = z.object({
  type: z.literal("MultiLineString"),
  coordinates: z.array(z.array(CoordinatePairSchema)),
});

// MultiPoint geometry
const MultiPointGeometrySchema = z.object({
  type: z.literal("MultiPoint"),
  coordinates: z.array(CoordinatePairSchema),
});

// Union of all geometry types
const GeometrySchema = z.union([
  PointGeometrySchema,
  LineStringGeometrySchema,
  PolygonGeometrySchema,
  MultiPointGeometrySchema,
  MultiLineStringGeometrySchema,
  MultiPolygonGeometrySchema,
]);

const VicmapFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  properties: z.record(z.string(), z.any()),
  geometry: GeometrySchema,
});

const VicmapResponseSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(VicmapFeatureSchema),
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

export const BBoxSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

// Infer TypeScript types
export type CoordinatePair = z.infer<typeof CoordinatePairSchema>;
export type LinearRing = z.infer<typeof LinearRingSchema>;
export type PointGeometry = z.infer<typeof PointGeometrySchema>;
export type LineStringGeometry = z.infer<typeof LineStringGeometrySchema>;
export type PolygonGeometry = z.infer<typeof PolygonGeometrySchema>;
export type MultiPointGeometry = z.infer<typeof MultiPointGeometrySchema>;
export type MultiLineStringGeometry = z.infer<
  typeof MultiLineStringGeometrySchema
>;
export type MultiPolygonGeometry = z.infer<typeof MultiPolygonGeometrySchema>;
export type Geometry = z.infer<typeof GeometrySchema>;
export type VicmapFeature = z.infer<typeof VicmapFeatureSchema>;
export type VicmapResponse = z.infer<typeof VicmapResponseSchema>;

// Export schemas
export {
  CoordinatePairSchema,
  GeometrySchema,
  LinearRingSchema,
  LineStringGeometrySchema,
  MultiLineStringGeometrySchema,
  MultiPointGeometrySchema,
  MultiPolygonGeometrySchema,
  PointGeometrySchema,
  PolygonGeometrySchema,
  VicmapFeatureSchema,
  VicmapResponseSchema,
};
