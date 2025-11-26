import { z } from "zod";

// Response schema for planning scheme zone from Vicmap Planning (plan_zone layer)
export const PlanningSchemeZoneFeaturePropertiesSchema = z.object({
  pfi: z.number().optional(),
  scheme_code: z.string().optional(),
  lga_code: z.string().optional(),
  lga: z.string().optional(),
  zone_num: z.number().optional(),
  zone_status: z.string().optional(),
  zone_code: z.string().optional(),
  zone_description: z.string().optional(),
  gaz_begin_date: z.string().optional(),
  pfi_created: z.string().optional(),
  ufi: z.number().optional(),
  ufi_created: z.string().optional(),
});

export const PlanningSchemeZoneFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string().optional(),
  geometry: z.any(),
  geometry_name: z.string().optional(),
  properties: PlanningSchemeZoneFeaturePropertiesSchema,
});

export const PlanningSchemeZoneFeaturesSchema = z.array(
  PlanningSchemeZoneFeatureSchema
);

export type PlanningSchemeZoneFeature = z.infer<typeof PlanningSchemeZoneFeatureSchema>;
export type PlanningSchemeZoneFeatures = z.infer<typeof PlanningSchemeZoneFeaturesSchema>;

// Cleaned/inferred planning zone data
export const PlanningZoneDataSchema = z.object({
  zoneCode: z.string(),
  zoneNumber: z.number().optional(),
  zoneDescription: z.string(),
  lgaName: z.string().optional(),
  lgaCode: z.string().optional(),
});

export type PlanningZoneData = z.infer<typeof PlanningZoneDataSchema> | null;
