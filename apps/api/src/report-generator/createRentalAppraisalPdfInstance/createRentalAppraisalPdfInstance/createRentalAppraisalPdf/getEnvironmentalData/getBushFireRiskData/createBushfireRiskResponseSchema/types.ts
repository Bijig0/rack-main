import { z } from "zod";
import { BBoxSchema } from "../../../../../../wfsDataToolkit/types";

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
export const BushfireRiskPropertiesSchema = z.object({
  lga_code: z.string(),
  lga_name: z.string(),
  plan_number: z.string(),
  gazettal_date: z.string(), // Could refine to a date format if needed
  bpa_area_ha: z.number(),
});

// --- Bounding box schema ---

// --- BushfireRisk feature schema ---
export const BushfireRiskFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  geometry: GeometrySchema,
  geometry_name: z.string(),
  properties: BushfireRiskPropertiesSchema,
  bbox: BBoxSchema,
});

export const InferredBushfireRiskDataSchema = z.object({
  lga: z.string().optional(), // e.g., "Mornington Peninsula Shire (Code: 352)"
  bushfirePlanReference: z.string().optional(), // e.g., "LEGL./24-188"
  gazettalDate: z.string().optional(), // e.g., "10 September 2024"
  areaKm2: z.number().optional(), // converted to km², e.g., 640.34
});

export type InferredBushfireRiskData = z.infer<
  typeof InferredBushfireRiskDataSchema
>;

export const BushfireRiskFeaturesSchema = z.array(BushfireRiskFeatureSchema);

export type BushfireRiskFeature = z.infer<typeof BushfireRiskFeatureSchema>;

export type BushfireRiskFeatures = z.infer<typeof BushfireRiskFeaturesSchema>;
