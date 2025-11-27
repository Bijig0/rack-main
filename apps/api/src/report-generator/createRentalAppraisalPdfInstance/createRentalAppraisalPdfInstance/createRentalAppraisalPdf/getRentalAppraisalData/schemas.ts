import { z } from "zod";
import { EnvironmentalDataSchema } from "../getEnvironmentalData/types";
import { InfrastructureDataSchema } from "../getInfrastructureData/types/types";
import { LocationAndSuburbDataSchema } from "../getLocationAndSuburbData/getLocationAndSuburbData";
import { PlanningZoningDataSchema } from "../getPlanningZoningData/types";
import { PropertyInfoSchema } from "../getPropertyInfo/utils/types";
import { CoverPageDataSchema } from "../getCoverPageData/getCoverPageData";

// ============================================================================
// Rental Appraisal Data Schema (Merged)
// ============================================================================

// DOM INject, where the text is below Floor Area (select this by doing big selection), floor area data

export const RentalAppraisalDataSchema = z.object({
  coverPageData: CoverPageDataSchema,
  propertyInfo: PropertyInfoSchema,
  planningZoningData: PlanningZoningDataSchema.nullable(),
  environmentalData: EnvironmentalDataSchema,
  infrastructureData: InfrastructureDataSchema,
  locationAndSuburbData: LocationAndSuburbDataSchema,
  // pricelabsData: PricelabsDataSchema,
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
