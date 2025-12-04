import { faker } from "@faker-js/faker";
import {
  RentalAppraisalDataSchema,
  type RentalAppraisalData,
} from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";

// ============================================================================
// Australian Location Data
// ============================================================================

const AUSTRALIAN_SUBURBS = [
  { suburb: "Melbourne", state: "VIC", postcode: "3000", council: "City of Melbourne", lat: -37.8136, lng: 144.9631 },
  { suburb: "Richmond", state: "VIC", postcode: "3121", council: "City of Yarra", lat: -37.8183, lng: 144.9987 },
  { suburb: "South Yarra", state: "VIC", postcode: "3141", council: "City of Stonnington", lat: -37.8387, lng: 144.9929 },
  { suburb: "Fitzroy", state: "VIC", postcode: "3065", council: "City of Yarra", lat: -37.7987, lng: 144.9782 },
  { suburb: "Carlton", state: "VIC", postcode: "3053", council: "City of Melbourne", lat: -37.8004, lng: 144.9667 },
  { suburb: "Brunswick", state: "VIC", postcode: "3056", council: "City of Moreland", lat: -37.7665, lng: 144.9601 },
  { suburb: "St Kilda", state: "VIC", postcode: "3182", council: "City of Port Phillip", lat: -37.8676, lng: 144.9804 },
  { suburb: "Prahran", state: "VIC", postcode: "3181", council: "City of Stonnington", lat: -37.8498, lng: 144.9925 },
  { suburb: "Hawthorn", state: "VIC", postcode: "3122", council: "City of Boroondara", lat: -37.8226, lng: 145.0354 },
  { suburb: "Toorak", state: "VIC", postcode: "3142", council: "City of Stonnington", lat: -37.8407, lng: 145.0136 },
  { suburb: "Kew", state: "VIC", postcode: "3101", council: "City of Boroondara", lat: -37.8074, lng: 145.0345 },
  { suburb: "Camberwell", state: "VIC", postcode: "3124", council: "City of Boroondara", lat: -37.8264, lng: 145.0578 },
];

const AUSTRALIAN_STREETS = [
  "Collins Street", "Bourke Street", "Swanston Street", "Chapel Street",
  "Brunswick Street", "Smith Street", "High Street", "Bay Street",
  "Church Street", "Victoria Street", "Albert Road", "Queen Street",
  "King Street", "George Street", "Pitt Street", "Oxford Street",
  "Crown Street", "William Street", "Glenferrie Road", "Burke Road",
];

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Unit", "Villa"];

const SCHOOL_TYPES = ["Primary School", "Secondary College", "Grammar School", "Catholic School"];

// ============================================================================
// Helper Functions
// ============================================================================

function generateStreetAddress(suburb: typeof AUSTRALIAN_SUBURBS[0]): string {
  const streetNumber = faker.number.int({ min: 1, max: 500 });
  const street = faker.helpers.arrayElement(AUSTRALIAN_STREETS);
  return `${streetNumber} ${street}, ${suburb.suburb} ${suburb.state} ${suburb.postcode}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

// ============================================================================
// Cover Page Data
// ============================================================================

function generateCoverPageData(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  return {
    addressCommonName: generateStreetAddress(suburb),
    reportDate: formatDate(new Date()),
  };
}

// ============================================================================
// Property Info
// ============================================================================

function generateNearbySchools(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const count = faker.number.int({ min: 2, max: 4 });
  return Array.from({ length: count }, () => ({
    type: faker.helpers.arrayElement(SCHOOL_TYPES),
    name: `${suburb.suburb} ${faker.helpers.arrayElement(SCHOOL_TYPES)}`,
    address: `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(AUSTRALIAN_STREETS)}, ${suburb.suburb}`,
    distance: `${faker.number.float({ min: 0.3, max: 2.5, fractionDigits: 1 })}km`,
  }));
}

function generateSimilarPropertiesForSale(basePrice: number, propertyType: string) {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from({ length: count }, () => {
    const variation = faker.number.float({ min: 0.85, max: 1.15 });
    const price = Math.round(basePrice * variation);
    const priceHigh = Math.round(price * 1.08);
    const suburb = faker.helpers.arrayElement(AUSTRALIAN_SUBURBS);
    return {
      address: generateStreetAddress(suburb),
      price: `$${price.toLocaleString()} - $${priceHigh.toLocaleString()}`,
      bedrooms: faker.number.int({ min: 2, max: 5 }),
      bathrooms: faker.number.int({ min: 1, max: 3 }),
      parking: faker.number.int({ min: 1, max: 3 }),
      propertyType,
    };
  });
}

function generateSimilarPropertiesForRent(baseWeeklyRent: number, propertyType: string) {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from({ length: count }, () => {
    const variation = faker.number.float({ min: 0.9, max: 1.1 });
    const suburb = faker.helpers.arrayElement(AUSTRALIAN_SUBURBS);
    return {
      address: generateStreetAddress(suburb),
      pricePerWeek: Math.round(baseWeeklyRent * variation),
      bedrooms: faker.number.int({ min: 2, max: 5 }),
      bathrooms: faker.number.int({ min: 1, max: 3 }),
      parking: faker.number.int({ min: 1, max: 3 }),
      propertyType,
    };
  });
}

const REAL_ESTATE_AGENCIES = [
  "Ray White", "LJ Hooker", "Harcourts", "Barry Plant", "Jellis Craig",
  "Marshall White", "Kay & Burton", "Buxton", "McGrath", "Belle Property",
  "Nelson Alexander", "Biggin & Scott", "Fletchers", "Gary Peer",
];

function generatePropertyTimeline(basePrice: number, weeklyRent: number) {
  const count = faker.number.int({ min: 2, max: 6 });
  const events: Array<{
    occurenceType: "sold" | "leased" | "rented";
    price: number;
    occurenceDate: Date;
    occurenceBroker: string | null;
  }> = [];

  // Generate events going back in time
  let currentDate = new Date();
  let currentPrice = basePrice;
  let currentRent = weeklyRent;

  for (let i = 0; i < count; i++) {
    // Go back 1-5 years for each event
    currentDate = faker.date.past({ years: faker.number.int({ min: 1, max: 5 }), refDate: currentDate });

    // Prices were lower in the past (roughly 3-8% less per year)
    const priceReduction = faker.number.float({ min: 0.92, max: 0.97 });
    currentPrice = Math.round(currentPrice * priceReduction);
    currentRent = Math.round(currentRent * priceReduction);

    const occurenceType = faker.helpers.arrayElement(["sold", "leased", "rented"] as const);
    const price = occurenceType === "sold" ? currentPrice : currentRent * 52; // Annual rent for leased/rented

    events.push({
      occurenceType,
      price,
      occurenceDate: currentDate,
      occurenceBroker: faker.datatype.boolean({ probability: 0.8 })
        ? faker.helpers.arrayElement(REAL_ESTATE_AGENCIES)
        : null,
    });
  }

  // Sort by date descending (most recent first)
  return events.sort((a, b) => b.occurenceDate.getTime() - a.occurenceDate.getTime());
}

function generatePropertyInfo(suburb: typeof AUSTRALIAN_SUBURBS[0], propertyType: string) {
  const bedrooms = faker.number.int({ min: 2, max: 5 });
  const bathrooms = faker.number.int({ min: 1, max: 3 });
  const yearBuilt = faker.number.int({ min: 1920, max: 2024 });
  const landArea = faker.number.int({ min: 300, max: 800 });
  const floorArea = faker.number.int({ min: 120, max: 350 });
  const frontageWidth = faker.number.float({ min: 10, max: 20, fractionDigits: 1 });
  const distanceFromCBD = faker.number.float({ min: 3, max: 25, fractionDigits: 1 });

  const basePriceMultiplier = propertyType === "House" ? 1.4 : propertyType === "Apartment" ? 0.75 : 1;
  const locationMultiplier = distanceFromCBD < 10 ? 1.4 : distanceFromCBD < 15 ? 1.15 : 1;
  const basePrice = Math.round(faker.number.int({ min: 800000, max: 1800000 }) * basePriceMultiplier * locationMultiplier);

  const estimatedLow = basePrice;
  const estimatedHigh = Math.round(basePrice * 1.12);
  const estimatedMid = Math.round((estimatedLow + estimatedHigh) / 2);

  const weeklyRent = Math.round(basePrice * 0.0004 + faker.number.int({ min: 400, max: 800 }));

  return {
    bedroomCount: bedrooms,
    bathroomCount: bathrooms,
    yearBuilt,
    landArea: { value: landArea, unit: "m²" as const },
    floorArea: { value: floorArea, unit: "m²" as const },
    frontageWidth,
    propertyType,
    council: suburb.council,
    distanceFromCBD: { value: distanceFromCBD, unit: "km" as const },
    nearbySchools: generateNearbySchools(suburb),
    propertyImage: {
      url: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
      alt: `${propertyType} in ${suburb.suburb}`,
      isPrimary: true,
    },
    estimatedValue: {
      low: estimatedLow,
      mid: estimatedMid,
      high: estimatedHigh,
      currency: "AUD",
      source: faker.helpers.arrayElement(["corelogic", "domain", "custom_model"] as const),
      confidence: faker.number.float({ min: 0.75, max: 0.95, fractionDigits: 2 }),
      updatedAt: new Date(),
    },
    similarPropertiesForSale: generateSimilarPropertiesForSale(estimatedMid, propertyType),
    similarPropertiesForRent: generateSimilarPropertiesForRent(weeklyRent, propertyType),
    propertyTimeline: generatePropertyTimeline(estimatedMid, weeklyRent),
    appraisalSummary: `This ${propertyType.toLowerCase()} is located in the desirable suburb of ${suburb.suburb}, approximately ${distanceFromCBD}km from the Melbourne CBD. The property features ${bedrooms} bedrooms and ${bathrooms} bathrooms across ${floorArea}m² of living space on a ${landArea}m² block. Built in ${yearBuilt}, it presents excellent value with an estimated market range of $${estimatedLow.toLocaleString()} to $${estimatedHigh.toLocaleString()}. The rental market in this area remains strong with weekly rents averaging around $${weeklyRent}.`,
  };
}

// ============================================================================
// Planning & Zoning Data
// ============================================================================

function generatePlanningZoningData(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const hasHeritage = faker.datatype.boolean({ probability: 0.2 });
  const zoneCode = faker.helpers.arrayElement(["GRZ1", "GRZ2", "NRZ1", "RGZ1", "MUZ"]);
  const zoneDescriptions: Record<string, string> = {
    GRZ1: "General Residential Zone - Schedule 1",
    GRZ2: "General Residential Zone - Schedule 2",
    NRZ1: "Neighbourhood Residential Zone - Schedule 1",
    RGZ1: "Residential Growth Zone - Schedule 1",
    MUZ: "Mixed Use Zone",
  };

  const zonePrecinctOptions = [
    undefined,
    "Heritage Precinct" as const,
    "Design and Development Precinct" as const,
    "Activity Centre Precinct" as const,
  ];

  return {
    heritageOverlays: hasHeritage ? [{ code: `HO${faker.number.int({ min: 100, max: 500 })}`, name: `${suburb.suburb} Heritage Precinct` }] : [],
    landUse: "Residential",
    localPlan: { localPlan: `${suburb.suburb} Structure Plan`, lgaName: suburb.council },
    localPlanPrecinct: faker.datatype.boolean() ? `Precinct ${faker.number.int({ min: 1, max: 5 })}` : null,
    localPlanSubprecinct: null,
    overlays: faker.datatype.boolean({ probability: 0.3 }) ? [
      { overlayCode: "DDO", overlayNumber: faker.number.int({ min: 1, max: 20 }), overlayDescription: "Design and Development Overlay" },
    ] : null,
    planningScheme: `${suburb.council} Planning Scheme`,
    regionalPlan: { regionalPlan: "Plan Melbourne 2017-2050" },
    zoneCode,
    zoneDescription: zoneDescriptions[zoneCode] || "General Residential Zone",
    zonePrecinct: faker.helpers.arrayElement(zonePrecinctOptions),
  };
}

// ============================================================================
// Environmental Data
// ============================================================================

const FIRE_NAMES = ["Black Saturday", "Ash Wednesday", "Canberra Fires", "Blue Mountains", "Grampians Fire"];
const FIRE_TYPES = ["Bushfire", "Grassfire", "Forest Fire", "Scrub Fire"];
const WATERWAY_NAMES = ["Yarra River", "Merri Creek", "Moonee Ponds Creek", "Maribyrnong River", "Dandenong Creek"];

function generateFireHistory() {
  const count = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: count }, () => ({
    fireId: `FIRE-${faker.string.alphanumeric(8).toUpperCase()}`,
    fireName: faker.helpers.arrayElement(FIRE_NAMES),
    fireType: faker.helpers.arrayElement(FIRE_TYPES),
    fireSeason: `${faker.number.int({ min: 1990, max: 2020 })}-${faker.number.int({ min: 2021, max: 2024 })}`,
    ignitionDate: faker.date.past({ years: 30 }).toISOString().split('T')[0],
    area: { measurement: faker.number.int({ min: 100, max: 50000 }), unit: "hectares" },
    distance: { measurement: faker.number.float({ min: 5, max: 50, fractionDigits: 1 }), unit: "km" },
    district: faker.helpers.arrayElement(["North East", "Gippsland", "Western", "Central"]),
    region: "Victoria",
  }));
}

function generateCharacterOverlays(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const count = faker.number.int({ min: 1, max: 2 });
  return Array.from({ length: count }, (_, i) => ({
    overlayCode: `${faker.helpers.arrayElement(["NCO", "SLO"])}${faker.number.int({ min: 1, max: 10 })}`,
    overlayType: faker.helpers.arrayElement(["NCO", "SLO"]),
    overlayName: `${suburb.suburb} ${faker.helpers.arrayElement(["Heritage", "Garden", "Bush", "Urban"])} Character Area`,
    description: `Protects the ${faker.helpers.arrayElement(["garden suburban", "heritage residential", "bush garden"])} character of the area.`,
    lga: suburb.council,
    affectsProperty: i === 0,
    distanceMeters: i === 0 ? 0 : faker.number.int({ min: 50, max: 500 }),
  }));
}

function generateCoastalHazardZones() {
  const count = faker.number.int({ min: 1, max: 2 });
  return Array.from({ length: count }, (_, i) => ({
    hazardType: faker.helpers.arrayElement(["Erosion", "Inundation", "Storm Surge", "Sea Level Rise"]),
    description: `${faker.helpers.arrayElement(["Coastal", "Marine", "Tidal"])} hazard zone with ${faker.helpers.arrayElement(["low", "moderate", "high"])} risk assessment.`,
    affectsProperty: i === 0,
    distanceMeters: faker.number.int({ min: 100, max: 2000 }),
  }));
}

function generateWaterwayFeatures() {
  const count = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: count }, (_, i) => ({
    featureType: faker.helpers.arrayElement(["River", "Creek", "Wetland", "Lake", "Drain"]),
    name: faker.helpers.arrayElement(WATERWAY_NAMES),
    distanceMeters: faker.number.int({ min: 100, max: 1500 }),
    inBuffer: i === 0,
  }));
}

function generateLandslideHazardZones() {
  const count = faker.number.int({ min: 1, max: 2 });
  return Array.from({ length: count }, (_, i) => ({
    hazardType: faker.helpers.arrayElement(["Landslip", "Erosion", "Steep Slopes", "Subsidence"]),
    overlayCode: `ESO${faker.number.int({ min: 1, max: 5 })}`,
    description: `Area identified as having ${faker.helpers.arrayElement(["potential", "known", "historic"])} ${faker.helpers.arrayElement(["landslip", "erosion", "slope instability"])} risk.`,
    affectsProperty: i === 0,
    distanceMeters: faker.number.int({ min: 50, max: 800 }),
  }));
}

function generateWastewaterPlants(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const count = faker.number.int({ min: 1, max: 2 });
  return Array.from({ length: count }, () => ({
    facilityName: `${faker.helpers.arrayElement(["Eastern", "Western", "Northern", "Southern"])} Treatment Plant`,
    facilityType: faker.helpers.arrayElement(["Sewage Treatment", "Water Reclamation", "Wastewater Processing"]),
    operator: faker.helpers.arrayElement(["Melbourne Water", "South East Water", "Yarra Valley Water"]),
    capacity: `${faker.number.int({ min: 50, max: 500 })} ML/day`,
    status: "Operational",
    state: "VIC",
    distance: { measurement: faker.number.float({ min: 2, max: 15, fractionDigits: 1 }), unit: "km" },
    coordinates: {
      lat: suburb.lat + faker.number.float({ min: -0.1, max: 0.1 }),
      lon: suburb.lng + faker.number.float({ min: -0.1, max: 0.1 }),
    },
  }));
}

function generateLandfills(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const count = faker.number.int({ min: 1, max: 2 });
  return Array.from({ length: count }, () => ({
    landfillRegisterNumber: faker.number.int({ min: 1000, max: 9999 }),
    referenceNumber: `LF-${faker.string.alphanumeric(6).toUpperCase()}`,
    address: `${faker.number.int({ min: 1, max: 500 })} ${faker.helpers.arrayElement(AUSTRALIAN_STREETS)}`,
    suburb: faker.helpers.arrayElement(AUSTRALIAN_SUBURBS).suburb,
    council: suburb.council,
    latitude: suburb.lat + faker.number.float({ min: -0.05, max: 0.05 }),
    extraAddressInformation: null,
    longitude: suburb.lng + faker.number.float({ min: -0.05, max: 0.05 }),
    landfillName: `${faker.helpers.arrayElement(["Clayton", "Tullamarine", "Werribee", "Brooklyn"])} Landfill`,
    siteName: `${faker.helpers.arrayElement(["Metro", "Regional", "Municipal"])} Waste Facility`,
    status: faker.helpers.arrayElement(["Closed", "Operating"]),
    operatingStatus: faker.helpers.arrayElement(["Closed", "Operating"]),
    wasteTypeAccepted: faker.helpers.arrayElement(["Solid Inert", "Putrescible", "Industrial", "Mixed"]),
    estimatedYearOfClosure: faker.helpers.arrayElement([null, "1984", "1995", "2010"]),
    provenance: "EPA Victoria",
    estimatedTotalWasteVolume: faker.helpers.arrayElement([null, "500,000 m³", "1,200,000 m³"]),
    licenceNumber: `EPA-${faker.number.int({ min: 10000, max: 99999 })}`,
    historicLicenceNumber: null,
    dataExtractedOn: new Date().toISOString(),
    distance: { measurement: faker.number.float({ min: 3, max: 12, fractionDigits: 1 }), unit: "km" },
  }));
}

function generateEnvironmentalData(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const floodRisk = faker.helpers.arrayElement(["MINIMAL", "LOW", "MODERATE"] as const);

  return {
    biodiversity: {
      isInBiodiversityOverlay: false,
      sensitivityLevel: "low" as const,
      distanceToNearestHabitat: faker.number.int({ min: 500, max: 3000 }),
      summary: "Property is in a developed urban area with low biodiversity sensitivity.",
      alerts: [
        "Native vegetation assessment may be required for significant works",
        "Consider wildlife corridors in any landscaping plans",
      ],
    },
    bushfireRisk: {
      fireHistory: generateFireHistory(),
      riskAnalysis: {
        overallRisk: "LOW" as const,
        riskFactors: {
          inBushfireProneArea: false,
          historicalFiresNearby: faker.number.int({ min: 1, max: 5 }),
          recentFiresNearby: faker.number.int({ min: 0, max: 2 }),
        },
        summary: "Property is located in an established urban area with minimal bushfire risk.",
        recommendations: [
          "Maintain defendable space around the property",
          "Ensure gutters are regularly cleared of debris",
          "Consider a bushfire survival plan",
        ],
      },
    },
    characterData: {
      significanceLevel: faker.helpers.arrayElement(["LOW", "MODERATE"] as const),
      characterOverlays: generateCharacterOverlays(suburb),
      affectedByCharacterOverlay: true,
      requiresCharacterAssessment: false,
      description: `The property is located within the ${suburb.suburb} residential area with typical suburban character.`,
      recommendations: [
        "New development should respect the existing streetscape",
        "Front setbacks should be consistent with neighbouring properties",
      ],
    },
    coastalHazardsData: {
      riskLevel: "MINIMAL" as const,
      coastalHazardZones: generateCoastalHazardZones(),
      affectedByCoastalHazard: false,
      isCoastalProperty: false,
      description: "Property is not located in a coastal hazard area.",
      recommendations: [
        "No coastal-specific requirements apply to this property",
      ],
    },
    easementsData: {
      hasEasement: faker.datatype.boolean({ probability: 0.3 }),
      type: faker.helpers.arrayElement(["drainage", "sewerage", "utility"] as const),
      locationDescription: faker.datatype.boolean() ? "rear boundary" : "side boundary",
      impactLevel: "low" as const,
      alerts: [
        "Building over easements requires authority consent",
        "Check with relevant utility provider before excavation",
      ],
    },
    heritageData: {
      significanceLevel: faker.helpers.arrayElement(["MINIMAL", "LOW"] as const),
      heritageListings: [
        `${suburb.suburb} Residential Precinct`,
        "Victorian Heritage Register",
      ],
      planningOverlays: [
        {
          code: `HO${faker.number.int({ min: 100, max: 500 })}`,
          name: `${suburb.suburb} Heritage Overlay`,
          affectsProperty: false,
          distance: faker.number.int({ min: 100, max: 500 }),
        },
      ],
      heritageInventoryItems: faker.number.int({ min: 0, max: 3 }),
      requiresHeritagePermit: false,
      description: "No significant heritage constraints identified for this property.",
      recommendations: [
        "Consider heritage impact for any visible external changes",
        "Consult council heritage advisor for major renovations",
      ],
    },
    floodRiskData: {
      riskLevel: floodRisk,
      affectedByHistoricalFlood: false,
      within100YearFloodExtent: floodRisk !== "MINIMAL",
      floodSources: [{
        sourceName: "Yarra River",
        sourceType: faker.helpers.arrayElement(["Historical", "Modelled"]),
        distanceMeters: faker.number.int({ min: 200, max: 1000 }),
        affectsProperty: false,
        dataQuality: faker.helpers.arrayElement(["High", "Medium"]),
      }],
      nearbyFloodZonesCount: faker.number.int({ min: 1, max: 3 }),
      ...(floodRisk !== "MINIMAL" && {
        minimumDistanceToFloodZone: faker.number.int({ min: 100, max: 500 }),
      }),
      description: floodRisk === "MINIMAL"
        ? "Property is not located within any identified flood zones."
        : `Property is located ${faker.number.int({ min: 100, max: 500 })}m from a flood overlay area.`,
      recommendations: [
        "Consider flood insurance options",
        "Ensure adequate drainage on the property",
        "Review Melbourne Water flood maps for detailed information",
      ],
    },
    waterwaysData: {
      significanceLevel: "MINIMAL" as const,
      waterwayFeatures: generateWaterwayFeatures(),
      inWaterwayBuffer: false,
      nearestWaterwayDistance: faker.number.int({ min: 500, max: 2000 }),
      requiresWaterwayAssessment: false,
      description: "No significant waterway constraints identified.",
      recommendations: [
        "Maintain stormwater management on property",
        "Avoid discharge of pollutants to stormwater system",
      ],
    },
    steepLandData: {
      riskLevel: "MINIMAL" as const,
      landslideHazardZones: generateLandslideHazardZones(),
      affectedByLandslideRisk: false,
      requiresGeotechnicalAssessment: false,
      description: "Property is located on relatively flat terrain with no landslide risk.",
      recommendations: [
        "Standard foundation design should be adequate",
        "Consider soil testing for significant excavation works",
      ],
    },
    noisePollutionData: {
      noiseLevel: faker.helpers.arrayElement(["LOW", "MODERATE"] as const),
      primarySources: [
        {
          roadName: faker.helpers.arrayElement(AUSTRALIAN_STREETS),
          roadType: "Arterial Road",
          classification: "ARTERIAL" as const,
          distanceMeters: faker.number.int({ min: 100, max: 500 }),
          estimatedNoiseLevel: faker.number.int({ min: 55, max: 70 }),
        },
        {
          roadName: faker.helpers.arrayElement(AUSTRALIAN_STREETS),
          roadType: "Local Road",
          classification: "LOCAL" as const,
          distanceMeters: faker.number.int({ min: 20, max: 100 }),
          estimatedNoiseLevel: faker.number.int({ min: 40, max: 55 }),
        },
      ],
      nearbyRoadsCount: faker.number.int({ min: 2, max: 5 }),
      estimatedAverageNoiseLevel: faker.number.int({ min: 45, max: 60 }),
      description: "Property experiences typical suburban noise levels from local and arterial traffic.",
    },
    odoursData: {
      wasteWaterPlants: generateWastewaterPlants(suburb),
      landfills: generateLandfills(suburb),
      odourLevelAnalysis: {
        overallLevel: "low" as const,
        odourSources: {
          landfillsWithin10km: faker.number.int({ min: 1, max: 3 }),
          wastewaterPlantsWithin10km: faker.number.int({ min: 1, max: 2 }),
          industrialFacilitiesWithin5km: faker.number.int({ min: 0, max: 2 }),
        },
        summary: "Minor odour sources identified within 10km but unlikely to impact property.",
        considerations: [
          "Prevailing winds may occasionally carry odours from treatment facilities",
          "Industrial activity in the broader area is minimal",
        ],
      },
    },
  };
}

// ============================================================================
// Infrastructure Data
// ============================================================================

function generateInfrastructureData(suburb: typeof AUSTRALIAN_SUBURBS[0]) {
  const nearbyPlace = (name: string) => ({
    name,
    place_id: faker.string.alphanumeric(20),
    address: `${faker.number.int({ min: 1, max: 200 })} ${faker.helpers.arrayElement(AUSTRALIAN_STREETS)}, ${suburb.suburb}`,
    location: {
      lat: suburb.lat + faker.number.float({ min: -0.01, max: 0.01 }),
      lng: suburb.lng + faker.number.float({ min: -0.01, max: 0.01 }),
    },
  });

  const electricityData = {
    isConnectedToGrid: true,
    distanceToNearestTransmissionLine: faker.number.int({ min: 500, max: 3000 }),
    distanceToNearestFacility: faker.number.int({ min: 200, max: 1000 }),
    impactLevel: "none" as const,
    alerts: [],
  };

  return {
    electricityInfrastructureData: electricityData,
    nearbyEmergencyServices: [
      nearbyPlace(`${suburb.suburb} Police Station`),
      nearbyPlace(`${suburb.suburb} Fire Station`),
    ],
    nearbyParks: [
      nearbyPlace(`${suburb.suburb} Gardens`),
      nearbyPlace(`${faker.helpers.arrayElement(["Central", "Victoria", "Memorial"])} Park`),
    ],
    nearbyPlaygrounds: [
      nearbyPlace(`${suburb.suburb} Playground`),
    ],
    nearbyShoppingMalls: [
      nearbyPlace(`${suburb.suburb} Shopping Centre`),
    ],
    sewageData: {
      isConnected: true,
      connectionType: "Mains Sewer",
      nearestPipeline: {
        pipelineId: faker.string.alphanumeric(10),
        sewerName: `${suburb.suburb} Main Sewer`,
        unitType: "PIPE",
        unitTypeDescription: "Gravity Sewer Pipe",
        material: "PVC",
        pipeWidth: 225,
        pipeLength: { measurement: 150, unit: "m" },
        serviceStatus: "Active",
        distance: { measurement: faker.number.int({ min: 10, max: 50 }), unit: "m" },
      },
      distanceToNearestPipeline: faker.number.int({ min: 10, max: 50 }),
      confidence: 0.95,
    },
    stormwaterData: {
      drainageCatchment: {
        name: `${suburb.suburb} Drainage Catchment`,
        area: faker.number.int({ min: 50, max: 200 }),
        waterway: "Yarra River",
      },
      nearbyRetardingBasins: [],
      stormwaterRiskLevel: "LOW" as const,
      hasStormwaterDrainage: true,
      description: "Property is connected to the municipal stormwater drainage system.",
      recommendations: [],
    },
    waterData: {
      isConnectedToMains: true,
      distanceToNearestMain: faker.number.int({ min: 5, max: 30 }),
      nearestWaterMain: {
        diameter: 150,
        material: "Cast Iron",
        status: "Active",
        pressureZone: `Zone ${faker.number.int({ min: 1, max: 5 })}`,
      },
      alerts: [],
    },
    publicTransport: [
      {
        stopId: faker.string.alphanumeric(8),
        stopName: `${suburb.suburb} Station`,
        mode: "Train",
        distance: { measurement: faker.number.int({ min: 300, max: 1200 }), unit: "m" },
        coordinates: { lat: suburb.lat, lon: suburb.lng },
        routes: ["Lilydale Line", "Belgrave Line"],
      },
      {
        stopId: faker.string.alphanumeric(8),
        stopName: `${faker.helpers.arrayElement(AUSTRALIAN_STREETS)}/${suburb.suburb}`,
        mode: "Tram",
        distance: { measurement: faker.number.int({ min: 100, max: 500 }), unit: "m" },
        coordinates: { lat: suburb.lat + 0.002, lon: suburb.lng + 0.001 },
        routes: ["Route 75", "Route 109"],
      },
    ],
    electricity: electricityData,
  };
}

// ============================================================================
// Location & Suburb Data
// ============================================================================

function generateLocationAndSuburbData() {
  const populationAmount = faker.number.int({ min: 15000, max: 45000 });
  const populationGrowth = faker.number.float({ min: 0.5, max: 3.5, fractionDigits: 1 });
  const distanceFromCBD = faker.number.float({ min: 5, max: 20, fractionDigits: 1 });

  // Simple SVG pie chart for occupancy
  const ownerOccupied = faker.number.int({ min: 45, max: 65 });

  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="#4CAF50" />
    <text x="50" y="55" text-anchor="middle" fill="white" font-size="8">Owner ${ownerOccupied}%</text>
  </svg>`;

  return {
    fiveYearPopulationGrowth: populationGrowth,
    occupancyChart: { svg, width: 200, height: 200 },
    populationAmount,
    distanceFromCBD: { value: distanceFromCBD, unit: "km" as const },
  };
}

// ============================================================================
// Main Generator Function
// ============================================================================

export function generateFakeRentalAppraisalData(): RentalAppraisalData {
  const suburb = faker.helpers.arrayElement(AUSTRALIAN_SUBURBS);
  const propertyType = faker.helpers.arrayElement(PROPERTY_TYPES);

  const fakeData = {
    coverPageData: generateCoverPageData(suburb),
    propertyInfo: generatePropertyInfo(suburb, propertyType),
    planningZoningData: generatePlanningZoningData(suburb),
    environmentalData: generateEnvironmentalData(suburb),
    infrastructureData: generateInfrastructureData(suburb),
    locationAndSuburbData: generateLocationAndSuburbData(),
  };

  // Validate through schema before returning
  const validatedData = RentalAppraisalDataSchema.parse(fakeData);

  return validatedData;
}

if (import.meta.main) {
  const fakeData = generateFakeRentalAppraisalData();
  console.log(JSON.stringify(fakeData, null, 2));
}
