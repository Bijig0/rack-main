// schemas/demographics.schema.ts

const API_URL =
  "https://propertyhub.corelogic.asia/clspa-gateway/propertyhub/user/neighbourhood/suburb/Kew%20VIC%203101?propertyId=16062963";

import { z } from "zod";

// Census Data Point Schema
const CensusDataPointSchema = z.object({
  dateTime: z.string(),
  value: z.number(),
});

// Census Response Item Schema
const CensusResponseItemSchema = z.object({
  countryName: z.string(),
  localityName: z.string().optional(),
  locationType: z.string(),
  metricTypeGroup: z.string(),
  metricTypeOrderId: z.number(),
  metricTypeShort: z.string(),
  seriesDataList: z.array(CensusDataPointSchema),
  councilAreaName: z.string().optional(),
  stateName: z.string().optional(),
});

// Age and Gender Schema
export const AgeAndGenderSchema = z.object({
  censusResponseList: z.array(CensusResponseItemSchema),
});

// Household Income Schema
export const HouseholdIncomeSchema = z.object({
  censusResponseList: z.array(CensusResponseItemSchema),
});

// Household Structure Schema
export const HouseholdStructureSchema = z.object({
  censusResponseList: z.array(CensusResponseItemSchema),
});

// Occupancy Schema
export const OccupancySchema = z.object({
  censusResponseList: z.array(CensusResponseItemSchema),
});

// Demographics Summary Schema
export const DemographicsSummarySchema = z.object({
  distanceFromCityCenter: z.string(),
  cityCenter: z.string(),
  population: z.string(),
  populationChange: z.string(),
  censusSummaryDescription: z.string(),
  ageAndGender: AgeAndGenderSchema,
  householdIncome: HouseholdIncomeSchema,
  householdStructure: HouseholdStructureSchema,
  occupancy: OccupancySchema,
});

// Complete Property Demographics Schema
export const PropertyDemographicsSchema = z.object({
  localityName: z.string(),
  demographics: DemographicsSummarySchema,
  lastUpdated: z.string().datetime().optional(),
});

// Helper type exports
export type CensusDataPoint = z.infer<typeof CensusDataPointSchema>;
export type CensusResponseItem = z.infer<typeof CensusResponseItemSchema>;
export type AgeAndGender = z.infer<typeof AgeAndGenderSchema>;
export type HouseholdIncome = z.infer<typeof HouseholdIncomeSchema>;
export type HouseholdStructure = z.infer<typeof HouseholdStructureSchema>;
export type Occupancy = z.infer<typeof OccupancySchema>;
export type DemographicsSummary = z.infer<typeof DemographicsSummarySchema>;
export type PropertyDemographics = z.infer<typeof PropertyDemographicsSchema>;

// Validation helper function
export function validateDemographicsData(data: unknown): PropertyDemographics {
  return PropertyDemographicsSchema.parse(data);
}

// Partial validation for individual sections
export function validateAgeAndGender(data: unknown): AgeAndGender {
  return AgeAndGenderSchema.parse(data);
}

export function validateHouseholdIncome(data: unknown): HouseholdIncome {
  return HouseholdIncomeSchema.parse(data);
}

export function validateHouseholdStructure(data: unknown): HouseholdStructure {
  return HouseholdStructureSchema.parse(data);
}

export function validateOccupancy(data: unknown): Occupancy {
  return OccupancySchema.parse(data);
}
