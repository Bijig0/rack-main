import { z } from "zod";

// Response schema for planning overlay from Vicmap Planning (plan_overlay layer)
export const PlanningOverlayFeaturePropertiesSchema = z.object({
  pfi: z.number().optional(),
  scheme_code: z.string().optional(),
  lga_code: z.string().optional(),
  lga: z.string().optional(),
  zone_num: z.number().optional(),
  zone_status: z.string().optional(),
  zone_code: z.string().optional(),
  zone_description: z.string().optional(),
  gaz_begin_date: z.string().nullable().optional(),
  pfi_created: z.string().nullable().optional(),
  ufi: z.number().optional(),
  ufi_created: z.string().optional(),
});

export const PlanningOverlayFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  geometry: z.any(),
  geometry_name: z.string().optional(),
  properties: PlanningOverlayFeaturePropertiesSchema,
  bbox: z.array(z.number()).optional(),
});

export const PlanningOverlayFeaturesSchema = z.array(
  PlanningOverlayFeatureSchema
);

export type PlanningOverlayFeature = z.infer<typeof PlanningOverlayFeatureSchema>;
export type PlanningOverlayFeatures = z.infer<typeof PlanningOverlayFeaturesSchema>;

// Cleaned/inferred planning overlay data
export const PlanningOverlayItemSchema = z.object({
  overlayCode: z.string(),
  overlayNumber: z.number().optional(),
  overlayDescription: z.string(),
});

export const PlanningOverlayDataSchema = z.array(PlanningOverlayItemSchema);

export type PlanningOverlayItem = z.infer<typeof PlanningOverlayItemSchema>;
export type PlanningOverlayData = z.infer<typeof PlanningOverlayDataSchema> | null;
