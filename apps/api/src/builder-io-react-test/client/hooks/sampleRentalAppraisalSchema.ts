import { JsonSchema } from "./useGetRentalAppraisalSchema";

/**
 * Sample hardcoded schema based on actual RentalAppraisalData structure
 * This is used in development mode when the schema fetch endpoint is not available
 * Generated from actual API response data
 */
export const sampleRentalAppraisalSchema: JsonSchema = {
  type: "object",
  properties: {
    coverPageData: {
      type: "object",
      properties: {
        reportDate: { type: "string" },
        addressCommonName: { type: "string" },
      },
    },
    propertyInfo: {
      type: "object",
      properties: {
        council: { type: "string" },
        yearBuilt: { type: "integer" },
        propertyType: { type: "string" },
        frontageWidth: { type: "integer" },
        landArea: {
          type: "object",
          properties: {
            value: { type: "integer" },
            unit: { type: "string" },
          },
        },
        floorArea: {
          type: "object",
          properties: {
            value: { type: "integer" },
            unit: { type: "string" },
          },
        },
        distanceFromCBD: {
          type: "object",
          properties: {
            value: { type: "number" },
            unit: { type: "string" },
          },
        },
        nearbySchools: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              address: { type: "string" },
              distance: { type: "string" },
            },
          },
        },
        propertyImage: {
          type: "object",
          properties: {
            url: { type: "string" },
            alt: { type: "string" },
            isPrimary: { type: "boolean" },
          },
        },
        estimatedValue: {
          type: "object",
          properties: {
            low: { type: "integer" },
            mid: { type: "integer" },
            high: { type: "integer" },
            source: { type: "string" },
            currency: { type: "string" },
            updatedAt: { type: "string" },
            confidence: { type: "number" },
          },
        },
        appraisalSummary: { type: "string" },
        similarPropertiesForSale: {
          type: "array",
          items: {
            type: "object",
            properties: {
              price: { type: "string" },
              address: { type: "string" },
              parking: { type: "integer" },
              bedrooms: { type: "integer" },
              bathrooms: { type: "integer" },
              propertyType: { type: "string" },
            },
          },
        },
        similarPropertiesForRent: {
          type: "array",
          items: {
            type: "object",
            properties: {
              address: { type: "string" },
              parking: { type: "integer" },
              bedrooms: { type: "integer" },
              bathrooms: { type: "integer" },
              pricePerWeek: { type: "integer" },
              propertyType: { type: "string" },
            },
          },
        },
      },
    },
    pricelabsData: {
      type: "object",
      properties: {
        dailyRate: { type: "integer" },
        weeklyRate: { type: "integer" },
        monthlyRate: { type: "integer" },
        annualRevenue: { type: "integer" },
        occupancyRate: { type: "number" },
      },
    },
    environmentalData: {
      type: "object",
      properties: {
        heritage: {
          type: "object",
          properties: {
            isHeritage: { type: "boolean" },
            heritageType: { type: "string" },
          },
        },
        floodRisk: {
          type: "object",
          properties: {
            hasRisk: { type: "boolean" },
            riskLevel: { type: "string" },
          },
        },
        bushfireRisk: {
          type: "object",
          properties: {
            hasRisk: { type: "boolean" },
            riskLevel: { type: "string" },
          },
        },
      },
    },
    infrastructureData: {
      type: "object",
      properties: {
        sewer: { type: "boolean" },
        water: { type: "boolean" },
        stormwater: { type: "boolean" },
        electricity: { type: "boolean" },
        shoppingCenter: {
          type: "object",
          properties: {
            distance: { type: "number" },
            available: { type: "boolean" },
          },
        },
        publicTransport: {
          type: "object",
          properties: {
            distance: { type: "number" },
            available: { type: "boolean" },
          },
        },
        emergencyServices: {
          type: "object",
          properties: {
            distance: { type: "number" },
            available: { type: "boolean" },
          },
        },
        parkAndPlayground: {
          type: "object",
          properties: {
            distance: { type: "number" },
            available: { type: "boolean" },
          },
        },
      },
    },
    locationSuburbData: {
      type: "object",
      properties: {
        state: { type: "string" },
        suburb: { type: "string" },
        population: { type: "integer" },
        distanceToCBD: { type: "number" },
        populationGrowth: { type: "number" },
        occupancyData: {
          type: "object",
          properties: {
            other: { type: "integer" },
            renting: { type: "integer" },
            purchaser: { type: "integer" },
          },
        },
        rentalYieldGrowth: {
          type: "array",
          items: { type: "number" },
        },
      },
    },
    planningZoningData: {
      type: "object",
      properties: {
        zone: { type: "string" },
        zoneCode: { type: "string" },
        landUse: { type: "string" },
        localPlan: { type: "string" },
        regionalPlan: { type: "string" },
        zonePrecinct: { type: "string" },
        planningScheme: { type: "string" },
        overlays: {
          type: "array",
          items: {
            type: "object",
            properties: {
              overlayCode: { type: "string" },
              overlayNumber: { type: "integer" },
              overlayDescription: { type: "string" },
            },
          },
        },
        heritageOverlays: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
};
