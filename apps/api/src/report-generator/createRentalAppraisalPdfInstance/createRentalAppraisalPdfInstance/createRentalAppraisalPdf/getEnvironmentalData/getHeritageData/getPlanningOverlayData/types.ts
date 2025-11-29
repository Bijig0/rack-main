import { z } from "zod";
import { GeometrySchema } from "../../../../../wfsDataToolkit/types";

// Planning Scheme Overlay properties from open-data-platform:plan_overlay
export const PlanningOverlayPropertiesSchema = z.object({
  pfi: z.number().optional().nullable(),
  scheme_code: z.string().optional().nullable(), // e.g., "HO", "ESO", "VPO"
  lga_code: z.string().optional().nullable(),
  lga: z.string().optional().nullable(), // Local Government Area
  zone_num: z.number().optional().nullable(),
  zone_status: z.string().optional().nullable(),
  zone_code: z.string().optional().nullable(), // e.g., "HO655", "ESO1"
  zone_description: z.string().optional().nullable(), // e.g., "HERITAGE OVERLAY (HO655)"
  gaz_begin_date: z.string().optional().nullable(),
  pfi_created: z.string().optional().nullable(),
  ufi: z.number().optional().nullable(),
  ufi_created: z.string().optional().nullable(),
});

export type PlanningOverlayProperties = z.infer<
  typeof PlanningOverlayPropertiesSchema
>;

export const PlanningOverlayFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: PlanningOverlayPropertiesSchema,
  geometry: GeometrySchema,
});

export type PlanningOverlayFeature = z.infer<
  typeof PlanningOverlayFeatureSchema
>;

export const PlanningOverlayFeaturesSchema = z.array(
  PlanningOverlayFeatureSchema
);
export type PlanningOverlayFeatures = z.infer<
  typeof PlanningOverlayFeaturesSchema
>;

// Heritage-specific overlay data
export const HeritageOverlayDataSchema = z.object({
  overlayCode: z.string(), // e.g., "HO123"
  overlayName: z.string(), // e.g., "Heritage Overlay"
  description: z.string().optional(),
  lga: z.string().optional(), // Local Government Area
  schedule: z.string().optional(),
  gazettalDate: z.string().optional(),
  affectsProperty: z.boolean(), // Whether property is within overlay
  distanceMeters: z.number().optional(), // Distance to overlay if not affecting property
});

export type HeritageOverlayData = z.infer<typeof HeritageOverlayDataSchema>;
