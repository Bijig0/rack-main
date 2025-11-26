import { z } from "zod";
import { HeritageOverlaysSchema } from "./getHeritageOverlays/types";
import { LandUseSchema } from "./getLandUse/types";
import { LocalPlanDataSchema } from "./getLocalPlan/types";
import { LocalPlanPrecinctSchema } from "./getLocalPlanPrecinct/types";
import { LocalPlanSubprecinctSchema } from "./getLocalPlanSubprecinct/types";
import { PlanningOverlayDataSchema, PlanningOverlayItemSchema } from "./getPlanningOverlay/types";
import { PlanningSchemeSchema } from "./getPlanningScheme/types";
import { RegionalPlanSchema } from "./getRegionalPlan/types";
import { ZoneCodeSchema } from "./getZoneCode/types";
import { ZoneDescriptionSchema } from "./getZoneDescription/types";
import { ZonePrecinctTypeSchema } from "./getZonePrecinct/types";

/**
 * Complete Planning and Zoning Data Schema
 *
 * Combines all planning data points into a single comprehensive schema.
 */
export const PlanningZoningDataSchema = z.object({
  heritageOverlays: HeritageOverlaysSchema,
  landUse: LandUseSchema,
  localPlan: LocalPlanDataSchema.nullish(),
  localPlanPrecinct: LocalPlanPrecinctSchema,
  localPlanSubprecinct: LocalPlanSubprecinctSchema,
  overlays: PlanningOverlayDataSchema.nullish(),
  planningScheme: PlanningSchemeSchema,
  regionalPlan: RegionalPlanSchema.nullish(),
  zoneCode: ZoneCodeSchema,
  zoneDescription: ZoneDescriptionSchema,
  zonePrecinct: ZonePrecinctTypeSchema,
});

export type PlanningZoningData = z.infer<typeof PlanningZoningDataSchema> | null;

// Re-export all types for convenience
export { HeritageOverlaysSchema, type HeritageOverlays } from "./getHeritageOverlays/types";
export { LandUseSchema, type LandUse } from "./getLandUse/types";
export { LocalPlanDataSchema, type LocalPlanData } from "./getLocalPlan/types";
export { LocalPlanPrecinctSchema, type LocalPlanPrecinct } from "./getLocalPlanPrecinct/types";
export { LocalPlanSubprecinctSchema, type LocalPlanSubprecinct } from "./getLocalPlanSubprecinct/types";
export { PlanningOverlayItemSchema, type PlanningOverlayItem } from "./getPlanningOverlay/types";
export { PlanningSchemeSchema, type PlanningScheme } from "./getPlanningScheme/types";
export { RegionalPlanSchema, type RegionalPlan } from "./getRegionalPlan/types";
export { ZoneCodeSchema, type ZoneCode } from "./getZoneCode/types";
export { ZoneDescriptionSchema, type ZoneDescription } from "./getZoneDescription/types";
export { ZonePrecinctTypeSchema, type ZonePrecinctType } from "./getZonePrecinct/types";
