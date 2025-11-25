import { faker } from "@faker-js/faker";
import type { RentalAppraisalData } from "../report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getRentalAppraisalData/schemas";

const AUSTRALIAN_SUBURBS = [
  { suburb: "Melbourne", state: "VIC", postcode: "3000" },
  { suburb: "Richmond", state: "VIC", postcode: "3121" },
  { suburb: "South Yarra", state: "VIC", postcode: "3141" },
  { suburb: "Fitzroy", state: "VIC", postcode: "3065" },
  { suburb: "Carlton", state: "VIC", postcode: "3053" },
  { suburb: "Brunswick", state: "VIC", postcode: "3056" },
  { suburb: "St Kilda", state: "VIC", postcode: "3182" },
  { suburb: "Prahran", state: "VIC", postcode: "3181" },
  { suburb: "Hawthorn", state: "VIC", postcode: "3122" },
  { suburb: "Toorak", state: "VIC", postcode: "3142" },
  { suburb: "Sydney", state: "NSW", postcode: "2000" },
  { suburb: "Bondi", state: "NSW", postcode: "2026" },
  { suburb: "Surry Hills", state: "NSW", postcode: "2010" },
  { suburb: "Paddington", state: "NSW", postcode: "2021" },
  { suburb: "Newtown", state: "NSW", postcode: "2042" },
  { suburb: "Brisbane", state: "QLD", postcode: "4000" },
  { suburb: "Fortitude Valley", state: "QLD", postcode: "4006" },
  { suburb: "West End", state: "QLD", postcode: "4101" },
];

const AUSTRALIAN_STREETS = [
  "Collins Street",
  "Bourke Street",
  "Swanston Street",
  "Chapel Street",
  "Brunswick Street",
  "Smith Street",
  "High Street",
  "Bay Street",
  "Church Street",
  "Victoria Street",
  "Albert Road",
  "Queen Street",
  "King Street",
  "George Street",
  "Pitt Street",
  "Oxford Street",
  "Crown Street",
  "William Street",
];

const COUNCILS = [
  "City of Melbourne",
  "City of Yarra",
  "City of Stonnington",
  "City of Port Phillip",
  "City of Boroondara",
  "City of Moreland",
  "City of Darebin",
  "City of Sydney",
  "City of Brisbane",
  "Woollahra Municipal Council",
  "Inner West Council",
];

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Unit", "Villa"];

const SCHOOL_TYPES = [
  "Primary School",
  "Secondary College",
  "Grammar School",
  "Catholic School",
  "Public School",
];

const ZONES = [
  { zone: "General Residential Zone", code: "GRZ1" },
  { zone: "Neighbourhood Residential Zone", code: "NRZ1" },
  { zone: "Residential Growth Zone", code: "RGZ1" },
  { zone: "Mixed Use Zone", code: "MUZ" },
  { zone: "Commercial 1 Zone", code: "C1Z" },
];

const OVERLAYS = [
  { code: "HO", description: "Heritage Overlay" },
  { code: "SBO", description: "Special Building Overlay" },
  { code: "DDO", description: "Design and Development Overlay" },
  { code: "VPO", description: "Vegetation Protection Overlay" },
  { code: "ESO", description: "Environmental Significance Overlay" },
];

function generateStreetAddress(suburb: {
  suburb: string;
  state: string;
  postcode: string;
}): string {
  const streetNumber = faker.number.int({ min: 1, max: 500 });
  const street = faker.helpers.arrayElement(AUSTRALIAN_STREETS);
  return `${streetNumber} ${street}, ${suburb.suburb} ${suburb.state} ${suburb.postcode}`;
}

function generateNearbySchools() {
  const count = faker.number.int({ min: 2, max: 4 });
  return Array.from({ length: count }, () => ({
    type: faker.helpers.arrayElement(SCHOOL_TYPES),
    name: `${faker.person.lastName()} ${faker.helpers.arrayElement(
      SCHOOL_TYPES
    )}`,
    address: `${faker.number.int({
      min: 1,
      max: 200,
    })} ${faker.helpers.arrayElement(AUSTRALIAN_STREETS)}`,
    distance: `${faker.number.float({
      min: 0.2,
      max: 3,
      fractionDigits: 1,
    })}km`,
  }));
}

function generateSimilarPropertiesForSale(
  basePrice: number,
  propertyType: string
) {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from({ length: count }, () => {
    const variation = faker.number.float({ min: 0.8, max: 1.2 });
    const price = Math.round(basePrice * variation);
    const priceHigh = Math.round(price * 1.1);
    return {
      address: generateStreetAddress(
        faker.helpers.arrayElement(AUSTRALIAN_SUBURBS)
      ),
      price: `$${price.toLocaleString()} - $${priceHigh.toLocaleString()}`,
      bedrooms: faker.number.int({ min: 1, max: 5 }),
      bathrooms: faker.number.int({ min: 1, max: 3 }),
      parking: faker.number.int({ min: 0, max: 3 }),
      propertyType,
    };
  });
}

function generateSimilarPropertiesForRent(
  baseWeeklyRent: number,
  propertyType: string
) {
  const count = faker.number.int({ min: 3, max: 5 });
  return Array.from({ length: count }, () => {
    const variation = faker.number.float({ min: 0.85, max: 1.15 });
    return {
      address: generateStreetAddress(
        faker.helpers.arrayElement(AUSTRALIAN_SUBURBS)
      ),
      pricePerWeek: Math.round(baseWeeklyRent * variation),
      bedrooms: faker.number.int({ min: 1, max: 5 }),
      bathrooms: faker.number.int({ min: 1, max: 3 }),
      parking: faker.number.int({ min: 0, max: 3 }),
      propertyType,
    };
  });
}

function generatePlanningOverlays() {
  const count = faker.number.int({ min: 0, max: 3 });
  if (count === 0) return undefined;

  return Array.from({ length: count }, () => {
    const overlay = faker.helpers.arrayElement(OVERLAYS);
    return {
      overlayCode: overlay.code,
      overlayNumber: faker.number.int({ min: 1, max: 50 }),
      overlayDescription: overlay.description,
    };
  });
}

export function generateFakeRentalAppraisalData(): RentalAppraisalData {
  const suburb = faker.helpers.arrayElement(AUSTRALIAN_SUBURBS);
  const propertyType = faker.helpers.arrayElement(PROPERTY_TYPES);
  const distanceFromCBD = faker.number.float({
    min: 1,
    max: 40,
    fractionDigits: 1,
  });

  // Base values for consistent pricing
  const basePriceMultiplier =
    propertyType === "House" ? 1.5 : propertyType === "Apartment" ? 0.7 : 1;
  const locationMultiplier =
    distanceFromCBD < 10 ? 1.5 : distanceFromCBD < 20 ? 1.2 : 1;
  const basePrice =
    faker.number.int({ min: 600000, max: 2000000 }) *
    basePriceMultiplier *
    locationMultiplier;
  const estimatedMid = Math.round(basePrice);
  const estimatedLow = Math.round(basePrice * 0.9);
  const estimatedHigh = Math.round(basePrice * 1.1);

  const weeklyRent = faker.number.int({ min: 400, max: 1500 });
  const dailyRate = faker.number.int({ min: 150, max: 600 });
  const occupancyRate = faker.number.float({
    min: 0.6,
    max: 0.95,
    fractionDigits: 2,
  });

  const zoneInfo = faker.helpers.arrayElement(ZONES);

  return {
    coverPageData: {
      addressCommonName: generateStreetAddress(suburb),
      reportDate: new Date(),
    },
    propertyInfo: {
      yearBuilt: faker.number.int({ min: 1950, max: 2024 }),
      landArea: {
        value: faker.number.int({ min: 200, max: 1500 }),
        unit: "m²",
      },
      floorArea: {
        value: faker.number.int({ min: 80, max: 500 }),
        unit: "m²",
      },
      frontageWidth: faker.number.float({ min: 8, max: 30, fractionDigits: 1 }),
      propertyType,
      council: faker.helpers.arrayElement(COUNCILS),
      nearbySchools: generateNearbySchools(),
      propertyImage: {
        url: `https://picsum.photos/seed/${faker.string.alphanumeric(
          8
        )}/800/600`,
        alt: `Property image for ${propertyType}`,
        isPrimary: true,
      },
      estimatedValue: {
        low: estimatedLow,
        mid: estimatedMid,
        high: estimatedHigh,
        currency: "AUD",
        source: faker.helpers.arrayElement([
          "corelogic",
          "domain",
          "custom_model",
        ] as const),
        confidence: faker.number.float({
          min: 0.7,
          max: 0.95,
          fractionDigits: 2,
        }),
        updatedAt: new Date(),
      },
      distanceFromCBD: {
        value: distanceFromCBD,
        unit: "km",
      },
      similarPropertiesForSale: generateSimilarPropertiesForSale(
        estimatedMid,
        propertyType
      ),
      similarPropertiesForRent: generateSimilarPropertiesForRent(
        weeklyRent,
        propertyType
      ),
      appraisalSummary: `This ${propertyType.toLowerCase()} is located in the desirable suburb of ${
        suburb.suburb
      }, approximately ${distanceFromCBD}km from the CBD. The property features ${faker.number.int(
        { min: 2, max: 5 }
      )} bedrooms and ${faker.number.int({
        min: 1,
        max: 3,
      })} bathrooms. Based on recent market analysis and comparable sales in the area, the estimated value range is $${estimatedLow.toLocaleString()} to $${estimatedHigh.toLocaleString()}. The rental market in this area remains strong with weekly rents averaging around $${weeklyRent} per week.`,
    },
    planningZoningData: {
      regionalPlan: "Metropolitan Melbourne",
      landUse: "Residential",
      planningScheme: `${suburb.suburb} Planning Scheme`,
      zone: zoneInfo.zone,
      zoneCode: zoneInfo.code,
      overlays: generatePlanningOverlays(),
      heritageOverlays: faker.datatype.boolean()
        ? [`HO${faker.number.int({ min: 1, max: 500 })}`]
        : undefined,
      zonePrecinct: faker.datatype.boolean()
        ? `Precinct ${faker.number.int({ min: 1, max: 10 })}`
        : undefined,
      localPlan: faker.datatype.boolean()
        ? `${suburb.suburb} Local Area Plan`
        : undefined,
    },
    environmentalData: {
      floodRisk: {
        hasRisk: faker.datatype.boolean({ probability: 0.2 }),
        riskLevel: faker.helpers.arrayElement(["Low", "Medium", "High"]),
      },
      bushfireRisk: {
        hasRisk: faker.datatype.boolean({ probability: 0.15 }),
        riskLevel: faker.helpers.arrayElement([
          "BAL-LOW",
          "BAL-12.5",
          "BAL-19",
          "BAL-29",
        ]),
      },
      heritage: {
        isHeritage: faker.datatype.boolean({ probability: 0.1 }),
        heritageType: faker.helpers.arrayElement([
          "Local",
          "State",
          "National",
        ]),
      },
    },
    infrastructureData: {
      sewer: true,
      water: true,
      stormwater: true,
      electricity: true,
      publicTransport: {
        available: true,
        distance: faker.number.float({ min: 0.1, max: 2, fractionDigits: 1 }),
      },
      shoppingCenter: {
        available: true,
        distance: faker.number.float({ min: 0.2, max: 3, fractionDigits: 1 }),
      },
      parkAndPlayground: {
        available: true,
        distance: faker.number.float({ min: 0.1, max: 1.5, fractionDigits: 1 }),
      },
      emergencyServices: {
        available: true,
        distance: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
      },
    },
    locationSuburbData: {
      suburb: suburb.suburb,
      state: suburb.state,
      distanceToCBD: distanceFromCBD,
      population: faker.number.int({ min: 5000, max: 80000 }),
      populationGrowth: faker.number.float({
        min: -1,
        max: 5,
        fractionDigits: 1,
      }),
      occupancyData: {
        purchaser: faker.number.int({ min: 40, max: 70 }),
        renting: faker.number.int({ min: 25, max: 50 }),
        other: faker.number.int({ min: 2, max: 10 }),
      },
      rentalYieldGrowth: Array.from({ length: 5 }, () =>
        faker.number.float({ min: -2, max: 8, fractionDigits: 1 })
      ),
    },
    pricelabsData: {
      dailyRate,
      weeklyRate: dailyRate * 6,
      monthlyRate: dailyRate * 6 * 4,
      annualRevenue: Math.round(dailyRate * 365 * occupancyRate),
      occupancyRate,
    },
  };
}

if (import.meta.main) {
  const placeholderRentalAppraisalData = generateFakeRentalAppraisalData();
  console.log({ placeholderRentalAppraisalData });
}
