import { z } from "zod";
import { BBoxSchema } from "../../../../../../../wfsDataToolkit/types";

// --- Geometry schema for Point/Polygon ---
const PointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

const PolygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(
    z.array(
      z.tuple([z.number(), z.number()]) // [longitude, latitude]
    )
  ),
});

const GeometrySchema = z.union([PointGeometrySchema, PolygonGeometrySchema]);

// --- Properties schema ---
export const ElectricityPropertiesSchema = z
  .object({
    pfi: z.string().or(z.number()).optional(),
    ufi: z.number().optional(),
    feature_type: z.string().optional(),
    feature_sub_type: z.string().optional(),
    asset_id: z.string().optional(),
    voltage: z.string().or(z.number()).optional(),
    capacity: z.string().or(z.number()).optional(),
    owner: z.string().optional(),
    status: z.string().optional(),
    create_date: z.string().optional(),
    // Allow additional fields
  })
  .passthrough();

// --- Electricity feature schema ---
export const ElectricityFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string().optional(),
  properties: ElectricityPropertiesSchema,
  bbox: BBoxSchema.optional(),
});

export const InferredElectricityDataSchema = z.object({
  assetId: z.string().optional(),
  featureType: z.string().optional(),
  featureSubType: z.string().optional(),
  voltage: z.string().optional(),
  capacity: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
  distance: z.number().optional(), // Distance from property in km
  coordinates: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
});

export type InferredElectricityData = z.infer<
  typeof InferredElectricityDataSchema
>;

export const ElectricityFeaturesSchema = z.array(ElectricityFeatureSchema);

export type ElectricityFeature = z.infer<typeof ElectricityFeatureSchema>;

export type ElectricityFeatures = z.infer<typeof ElectricityFeaturesSchema>;
