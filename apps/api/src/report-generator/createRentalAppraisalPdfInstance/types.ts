export type PropertyType = "house" | "apartment" | "townhouse" | "unit" | "land" | "other";

export type PropertyReportData = {
  // First Page
  addressCommonName: string;
  reportDate: Date;
  companyLogo?: string; // URL or base64
  reportId: string;

  // Executive Summary - Property Info
  yearBuilt?: number;
  landArea?: number; // in sqm
  floorArea?: number; // in sqm
  frontageWidth?: number; // in meters
  propertyType: PropertyType;
  council: string;
  schoolCatchments?: string[];
  propertyImage?: string; // URL or base64
  estimatedValueRange?: {
    min: number;
    max: number;
    source: "CoreLogic" | "Domain" | "Custom";
  };
  distanceToCBD?: number; // in km

  // Planning and Zoning
  planningZoning?: {
    regionalPlan?: string;
    landUse?: string;
    planningScheme?: string;
    zone?: string;
    zonePrecinct?: string;
    localPlan?: string;
    localPlanPrecinct?: string;
    localPlanSubprecinct?: string;
  };

  // Environmental and Planning Considerations
  environmentalConsiderations?: {
    easements?: boolean;
    heritage?: boolean;
    character?: boolean;
    floodRisk?: boolean;
    biodiversity?: boolean;
    coastalHazards?: boolean;
    waterways?: boolean;
    wetlands?: boolean;
    bushfireRisk?: boolean;
    steepLand?: boolean;
    noisePollution?: boolean;
    odours?: boolean;
  };

  // Infrastructure
  infrastructure?: {
    sewer?: boolean;
    water?: boolean;
    stormwater?: boolean;
    electricity?: boolean;
    publicTransport?: {
      available: boolean;
      distance?: number; // in km
    };
    shoppingCenter?: {
      available: boolean;
      distance?: number; // in km
    };
    parkAndPlayground?: {
      available: boolean;
      distance?: number; // in km
    };
    emergencyServices?: {
      available: boolean;
      distance?: number; // in km
    };
  };

  // Floor Plan
  floorPlanImage?: string; // URL or base64

  // Location and Suburb
  suburb: string;
  state: string;
  population?: number;
  populationGrowth?: number; // 5 year percentage change
  occupancyData?: {
    purchaser: number; // percentage
    renting: number; // percentage
    other: number; // percentage
  };
  rentalYieldGrowth?: number[]; // Array of historical yield percentages

  // Pricelabs Estimate
  pricelabsEstimate?: {
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    annualRevenue?: number;
    occupancyRate?: number;
  };
};
