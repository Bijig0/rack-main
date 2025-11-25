// Shared types between API and Web apps
// These are simplified types for API responses - full schemas live in apps/api

export type CoverPageData = {
  addressCommonName: string;
  reportDate: Date | string;
};

export type PropertyImage = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
} | null;

export type EstimatedValueRange = {
  low: number;
  mid: number;
  high: number;
  currency?: string;
  source?: "corelogic" | "domain" | "custom_model" | "manual";
  confidence?: number;
  updatedAt?: Date | string;
} | null;

export type NearbySchool = {
  type: string;
  name: string;
  address: string;
  distance: string;
};

export type SimilarPropertyForSale = {
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  propertyType: string;
};

export type SimilarPropertyForRent = {
  address: string;
  pricePerWeek: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  propertyType: string;
};

export type PropertyInfo = {
  yearBuilt?: number | null;
  landArea?: { value: number; unit: "m²" } | null;
  floorArea?: { value: number; unit: "m²" } | null;
  frontageWidth?: number;
  propertyType?: string | null;
  council?: string | null;
  nearbySchools?: NearbySchool[] | null;
  propertyImage?: PropertyImage;
  estimatedValue?: EstimatedValueRange;
  distanceFromCBD?: { value: number; unit: "km" } | null;
  similarPropertiesForSale?: SimilarPropertyForSale[] | null;
  similarPropertiesForRent?: SimilarPropertyForRent[] | null;
  appraisalSummary?: string | null;
};

export type PlanningOverlayItem = {
  overlayCode: string;
  overlayNumber?: number;
  overlayDescription: string;
};

export type PlanningZoningData = {
  regionalPlan?: string;
  landUse?: string;
  planningScheme?: string;
  zone?: string;
  zoneCode?: string;
  overlays?: PlanningOverlayItem[];
  heritageOverlays?: string[];
  zonePrecinct?: string;
  localPlan?: string;
  localPlanPrecinct?: string;
  localPlanSubprecinct?: string;
} | null;

export type EnvironmentalData = {
  easements?: unknown;
  heritage?: unknown;
  character?: unknown;
  floodRisk?: unknown;
  biodiversity?: unknown;
  coastalHazards?: unknown;
  waterways?: unknown;
  wetlands?: unknown;
  bushfireRisk?: unknown;
  steepLand?: unknown;
  noisePollution?: unknown;
  odours?: unknown;
};

export type InfrastructureData = {
  sewer?: boolean;
  water?: boolean;
  stormwater?: boolean;
  electricity?: boolean;
  publicTransport?: { available: boolean; distance?: number };
  shoppingCenter?: { available: boolean; distance?: number };
  parkAndPlayground?: { available: boolean; distance?: number };
  emergencyServices?: { available: boolean; distance?: number };
} | null;

export type LocationSuburbData = {
  suburb: string;
  state: string;
  distanceToCBD?: number;
  population?: number;
  populationGrowth?: number;
  occupancyData?: {
    purchaser: number;
    renting: number;
    other: number;
  };
  rentalYieldGrowth?: number[];
};

export type PricelabsData = {
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  annualRevenue?: number;
  occupancyRate?: number;
} | null;

export type RentalAppraisalData = {
  coverPageData: CoverPageData;
  propertyInfo: PropertyInfo;
  planningZoningData: PlanningZoningData;
  environmentalData: EnvironmentalData;
  infrastructureData: InfrastructureData;
  locationSuburbData: LocationSuburbData;
  pricelabsData: PricelabsData;
};
