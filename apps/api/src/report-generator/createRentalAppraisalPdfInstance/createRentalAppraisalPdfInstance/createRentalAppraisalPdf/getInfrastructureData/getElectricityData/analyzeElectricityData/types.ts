import { z } from "zod";

/**
 * Electricity access level classification
 * - EXCELLENT: Substation <500m OR multiple facilities <1km
 * - GOOD: Substation <1km OR facilities <2km
 * - ADEQUATE: Facilities <5km
 * - LIMITED: Facilities >5km
 */
export const ElectricityAccessLevelSchema = z.enum([
  "EXCELLENT",
  "GOOD",
  "ADEQUATE",
  "LIMITED",
]);

export type ElectricityAccessLevel = z.infer<
  typeof ElectricityAccessLevelSchema
>;

/**
 * Transmission line risk level based on proximity and voltage
 * - VERY_HIGH: High voltage line (<30m)
 * - HIGH: High voltage line (<100m) OR any line (<30m)
 * - MODERATE: Any line (<100m)
 * - LOW: Lines 100m-500m away
 * - MINIMAL: Lines >500m away
 */
export const TransmissionLineRiskLevelSchema = z.enum([
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "MINIMAL",
]);

export type TransmissionLineRiskLevel = z.infer<
  typeof TransmissionLineRiskLevelSchema
>;

/**
 * EMF (Electromagnetic Field) exposure level
 * - HIGH: >220kV within 50m
 * - MODERATE: >220kV within 100m OR >66kV within 50m
 * - LOW: Lines 100-300m away
 * - NEGLIGIBLE: Lines >300m away
 */
export const EMFExposureLevelSchema = z.enum([
  "HIGH",
  "MODERATE",
  "LOW",
  "NEGLIGIBLE",
]);

export type EMFExposureLevel = z.infer<typeof EMFExposureLevelSchema>;

/**
 * Nearest substation information
 */
export const NearestSubstationSchema = z.object({
  distance: z.number(),
  voltage: z.string().optional(),
  capacity: z.string().optional(),
});

export type NearestSubstation = z.infer<typeof NearestSubstationSchema>;

/**
 * Nearest transmission line information
 */
export const NearestTransmissionLineSchema = z.object({
  distance: z.number(),
  capacityKv: z.number().optional(),
});

export type NearestTransmissionLine = z.infer<
  typeof NearestTransmissionLineSchema
>;

/**
 * Comprehensive electricity infrastructure analysis
 */
export const ElectricityAnalysisSchema = z.object({
  accessLevel: ElectricityAccessLevelSchema,
  hasReliableAccess: z.boolean(),
  nearestSubstation: NearestSubstationSchema.optional(),
  facilityCount: z.number(),
  transmissionLineRisk: TransmissionLineRiskLevelSchema,
  nearestTransmissionLine: NearestTransmissionLineSchema.optional(),
  emfExposure: EMFExposureLevelSchema,
  networkRedundancy: z.number().min(0).max(100), // 0-100 score
  description: z.string(),
  recommendations: z.array(z.string()),
});

export type ElectricityAnalysis = z.infer<typeof ElectricityAnalysisSchema>;

/**
 * Impact level classification for electricity infrastructure
 */
export const ElectricityImpactLevelSchema = z.enum([
  "none",
  "low",
  "moderate",
  "high",
]);

export type ElectricityImpactLevel = z.infer<
  typeof ElectricityImpactLevelSchema
>;

/**
 * Alert for electricity infrastructure issues
 */
export const ElectricityAlertSchema = z.object({
  type: z.enum(["note", "risk"]),
  message: z.string(),
});

export type ElectricityAlert = z.infer<typeof ElectricityAlertSchema>;

/**
 * Simplified electricity infrastructure data for property reports
 *
 * This is the new format optimized for rental appraisal reports, focusing on
 * information that matters to landlords and tenants rather than technical details.
 */
export const ElectricityInfrastructureSchema = z.object({
  /** Whether the property is connected to the electricity grid */
  isConnectedToGrid: z.boolean(),

  /** Distance to the nearest high-voltage transmission line (if any) */
  distanceToNearestTransmissionLine: z.number().nullable(),

  /** Distance to the nearest substation or energy facility */
  distanceToNearestFacility: z.number().nullable(),

  /** Summary of potential impacts (visual, noise, none) */
  impactLevel: ElectricityImpactLevelSchema,

  /** Optional notes that matter for property reports */
  alerts: z.array(ElectricityAlertSchema).optional(),
});

export type ElectricityInfrastructure = z.infer<
  typeof ElectricityInfrastructureSchema
>;
