import { z } from "zod";

/**
 * Drainage catchment information schema
 *
 * Represents the drainage catchment area that the property belongs to.
 * Data sourced from Melbourne Water catchment boundaries.
 */
export const DrainageCatchmentSchema = z.object({
  name: z.string(),
  area: z.number(), // hectares
  waterway: z.string(),
});

export type DrainageCatchment = z.infer<typeof DrainageCatchmentSchema>;

/**
 * Retarding basin information schema
 *
 * Retarding basins are flood mitigation infrastructure that temporarily
 * store stormwater during heavy rainfall to reduce downstream flooding.
 */
export const RetardingBasinSchema = z.object({
  name: z.string(),
  distance: z.number(), // meters from property
  capacity: z.number().optional(), // megalitres (ML) - may not be available for all basins
  type: z.string(), // "Retarding Basin", "Dam", "Reservoir", etc.
  owner: z.string().optional(), // Managing authority
});

export type RetardingBasin = z.infer<typeof RetardingBasinSchema>;

/**
 * Stormwater risk level classification
 *
 * - VERY_HIGH: Property in flood-prone area with minimal flood protection
 * - HIGH: Property in area with some flood risk, limited retarding basin capacity nearby
 * - MODERATE: Property with moderate flood protection from nearby infrastructure
 * - LOW: Property with good stormwater management and flood protection
 */
export const StormwaterRiskLevelSchema = z.enum([
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
]);

export type StormwaterRiskLevel = z.infer<typeof StormwaterRiskLevelSchema>;

/**
 * Complete stormwater infrastructure data schema
 *
 * Contains all stormwater-related information for a property including:
 * - Drainage catchment area
 * - Nearby flood retarding basins
 * - Stormwater risk assessment
 * - Infrastructure availability
 * - Planning recommendations
 */
export const StormwaterDataSchema = z.object({
  drainageCatchment: DrainageCatchmentSchema.optional(),
  nearbyRetardingBasins: z.array(RetardingBasinSchema),
  stormwaterRiskLevel: StormwaterRiskLevelSchema.optional(),
  hasStormwaterDrainage: z.boolean(),
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type StormwaterData = z.infer<typeof StormwaterDataSchema>;
