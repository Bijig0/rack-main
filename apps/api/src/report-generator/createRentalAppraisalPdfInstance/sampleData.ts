import { PropertyReportData } from "./types";

export const samplePropertyReportData: PropertyReportData = {
  // First Page
  addressCommonName: "123 Collins Street, Melbourne VIC 3000",
  reportDate: new Date("2025-11-01"),
  reportId: "PR-2025-001234",
  companyLogo: undefined, // Can add base64 encoded logo here

  // Executive Summary - Property Info
  yearBuilt: 2015,
  landArea: 450,
  floorArea: 320,
  frontageWidth: 15,
  propertyType: "house",
  council: "City of Melbourne",
  schoolCatchments: [
    "Melbourne High School",
    "University High School",
    "Carlton Primary School",
  ],
  propertyImage: undefined, // Can add base64 encoded image here
  estimatedValueRange: {
    min: 1200000,
    max: 1400000,
    source: "CoreLogic",
  },
  distanceToCBD: 2.5,

  // Planning and Zoning
  planningZoning: {
    regionalPlan: "Plan Melbourne 2017-2050",
    landUse: "Residential",
    planningScheme: "Melbourne Planning Scheme",
    zone: "General Residential Zone - Schedule 1",
    zonePrecinct: "Inner Melbourne",
    localPlan: "Central City Local Area",
    localPlanPrecinct: "East Melbourne Precinct",
    localPlanSubprecinct: "Collins Street Heritage Area",
  },

  // Environmental and Planning Considerations
  environmentalConsiderations: {
    easements: true,
    heritage: false,
    character: true,
    floodRisk: false,
    biodiversity: false,
    coastalHazards: false,
    waterways: false,
    wetlands: false,
    bushfireRisk: false,
    steepLand: false,
    noisePollution: true,
    odours: false,
  },

  // Infrastructure
  infrastructure: {
    sewer: true,
    water: true,
    stormwater: true,
    electricity: true,
    publicTransport: {
      available: true,
      distance: 0.3,
    },
    shoppingCenter: {
      available: true,
      distance: 0.8,
    },
    parkAndPlayground: {
      available: true,
      distance: 0.5,
    },
    emergencyServices: {
      available: true,
      distance: 1.2,
    },
  },

  // Floor Plan
  floorPlanImage: undefined, // Can add base64 encoded floor plan here

  // Location and Suburb
  suburb: "Melbourne",
  state: "VIC",
  population: 169961,
  populationGrowth: 12.5,
  occupancyData: {
    purchaser: 35,
    renting: 60,
    other: 5,
  },
  rentalYieldGrowth: [3.2, 3.4, 3.6, 3.8, 4.1],

  // Pricelabs Estimate
  pricelabsEstimate: {
    dailyRate: 250,
    weeklyRate: 1650,
    monthlyRate: 6500,
    annualRevenue: 75000,
    occupancyRate: 82,
  },
};
