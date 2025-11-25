import { z } from "zod";
import { PropertyInfoSchema } from "../createPropertyInfoSection/getPropertyInfo/utils/types";

// ============================================================================
// Cover Page Data Schema
// ============================================================================

export const CoverPageDataSchema = z.object({
  addressCommonName: z.string(),
  reportDate: z.string().date(),
});

export type CoverPageData = z.infer<typeof CoverPageDataSchema>;

// ============================================================================
// Planning Zoning Data Schema
// ============================================================================

export const PlanningOverlayItemSchema = z.object({
  overlayCode: z.string(),
  overlayNumber: z.number().optional(),
  overlayDescription: z.string(),
});

export const PlanningZoningDataSchema = z
  .object({
    regionalPlan: z.string().optional(),
    landUse: z.string().optional(),
    planningScheme: z.string().optional(),
    zone: z.string().optional(),
    zoneCode: z.string().optional(),
    overlays: z.array(PlanningOverlayItemSchema).optional(),
    heritageOverlays: z.array(z.string()).optional(),
    zonePrecinct: z.string().optional(),
    localPlan: z.string().optional(),
    localPlanPrecinct: z.string().optional(),
    localPlanSubprecinct: z.string().optional(),
  })
  .nullable();

export type PlanningZoningData = z.infer<typeof PlanningZoningDataSchema>;

// ============================================================================
// Environmental Data Schema
// ============================================================================

export const EnvironmentalDataSchema = z.object({
  easements: z.any().optional(), // EasementData type
  heritage: z.any().optional(), // HeritageData type
  character: z.any().optional(), // CharacterData type
  floodRisk: z.any().optional(), // FloodRiskData type
  biodiversity: z.any().optional(), // BiodiversityData type
  coastalHazards: z.any().optional(), // CoastalHazardsData type
  waterways: z.any().optional(), // WaterwaysData type
  wetlands: z.any().optional(), // WetlandsData type
  bushfireRisk: z.any().optional(), // BushfireRiskData type
  steepLand: z.any().optional(), // SteepLandData type
  noisePollution: z.any().optional(), // NoisePollutionData type
  odours: z.any().optional(), // OdoursData type
});

export type EnvironmentalData = z.infer<typeof EnvironmentalDataSchema>;

// ============================================================================
// Infrastructure Data Schema
// ============================================================================

export const InfrastructureDataSchema = z
  .object({
    sewer: z.boolean().optional(),
    water: z.boolean().optional(),
    stormwater: z.boolean().optional(),
    electricity: z.boolean().optional(),
    publicTransport: z
      .object({
        available: z.boolean(),
        distance: z.number().optional(),
      })
      .optional(),
    shoppingCenter: z
      .object({
        available: z.boolean(),
        distance: z.number().optional(),
      })
      .optional(),
    parkAndPlayground: z
      .object({
        available: z.boolean(),
        distance: z.number().optional(),
      })
      .optional(),
    emergencyServices: z
      .object({
        available: z.boolean(),
        distance: z.number().optional(),
      })
      .optional(),
  })
  .nullable();

export type InfrastructureData = z.infer<typeof InfrastructureDataSchema>;

// ============================================================================
// Location Suburb Data Schema
// ============================================================================

export const LocationSuburbDataSchema = z.object({
  suburb: z.string(),
  state: z.string(),
  distanceToCBD: z.number().optional(),
  population: z.number().optional(),
  populationGrowth: z.number().optional(),
  occupancyData: z
    .object({
      purchaser: z.number(),
      renting: z.number(),
      other: z.number(),
    })
    .optional(),
  rentalYieldGrowth: z.array(z.number()).optional(),
});

export type LocationSuburbData = z.infer<typeof LocationSuburbDataSchema>;

// ============================================================================
// Pricelabs Data Schema
// ============================================================================

export const PricelabsDataSchema = z
  .object({
    dailyRate: z.number().optional(),
    weeklyRate: z.number().optional(),
    monthlyRate: z.number().optional(),
    annualRevenue: z.number().optional(),
    occupancyRate: z.number().optional(),
  })
  .nullable();

export type PricelabsData = z.infer<typeof PricelabsDataSchema>;

// ============================================================================
// Rental Appraisal Data Schema (Merged)
// ============================================================================

// DOM INject, where the text is below Floor Area (select this by doing big selection), floor area data

export const RentalAppraisalDataSchema = z.object({
  coverPageData: CoverPageDataSchema,
  propertyInfo: PropertyInfoSchema,
  planningZoningData: PlanningZoningDataSchema,
  environmentalData: EnvironmentalDataSchema,
  infrastructureData: InfrastructureDataSchema,
  locationSuburbData: LocationSuburbDataSchema,
  pricelabsData: PricelabsDataSchema,
});

export type RentalAppraisalData = z.infer<typeof RentalAppraisalDataSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate rental appraisal data with detailed error messages
 */
export function validateRentalAppraisalData(data: unknown): {
  success: boolean;
  data?: RentalAppraisalData;
  errors?: string[];
} {
  const result = RentalAppraisalDataSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map(
    (err) => `${err.path.join(".")}: ${err.message}`
  );

  return { success: false, errors };
}

/**
 * Parse rental appraisal data with type assertion
 */
export function parseRentalAppraisalData(data: unknown): RentalAppraisalData {
  return RentalAppraisalDataSchema.parse(data);
}
