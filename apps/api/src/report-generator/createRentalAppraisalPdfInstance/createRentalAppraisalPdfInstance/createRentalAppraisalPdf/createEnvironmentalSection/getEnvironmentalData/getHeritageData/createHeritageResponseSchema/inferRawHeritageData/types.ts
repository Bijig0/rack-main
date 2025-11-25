import { z } from "zod";
import { BBoxSchema } from "../../../../../../../wfsDataToolkit/types";

// --- Geometry schema for MultiPolygon ---
const MultiPolygonCoordinatesSchema = z.array(
  z.array(
    z.array(
      z.tuple([z.number(), z.number()]) // [longitude, latitude]
    )
  )
);

const GeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: MultiPolygonCoordinatesSchema,
});

// --- Properties schema ---
export const HeritagePropertiesSchema = z.object({
  vdpid: z.number(),
  ufi: z.number(),
  hermes_num: z.number(),
  vhr_num: z.string().nullable(),
  vhi_num: z.string(),
  heritage_object: z.string(),
  site_name: z.string(),
  id: z.number(),
  ufi_created: z.string(), // ISO date string
});

// --- Bounding box schema ---

// --- Heritage feature schema ---
export const HeritageFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string(),
  properties: HeritagePropertiesSchema,
  bbox: BBoxSchema,
});

export const InferredHeritageDataSchema = z.object({
  dateRegistered: z.date(),
  heritageObject: z.string(),
  siteName: z.string(),
  vhiNumber: z.string(),
  heritageManagementNumber: z.string(),
  ufiNumber: z.string(),
  vdpId: z.string(),
});

export type InferredHeritageData = z.infer<typeof InferredHeritageDataSchema>;

export const HeritageFeaturesSchema = z.array(HeritageFeatureSchema);

export type HeritageFeature = z.infer<typeof HeritageFeatureSchema>;

export type HeritageFeatures = z.infer<typeof HeritageFeaturesSchema>;
