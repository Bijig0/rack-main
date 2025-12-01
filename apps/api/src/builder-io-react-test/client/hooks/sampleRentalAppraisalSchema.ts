import { JsonSchema } from "./useGetRentalAppraisalSchema";

/**
 * Sample hardcoded schema based on RentalAppraisalData structure
 * This is used as a fallback in development mode when the schema fetch fails
 */
export const sampleRentalAppraisalSchema: JsonSchema = {
  type: "object",
  properties: {
    coverPageData: {
      type: "object",
      properties: {
        addressCommonName: { type: "string" },
        reportDate: { type: "string" },
      },
    },
    propertyInfo: {
      type: "object",
      properties: {
        bedroomCount: {
          type: "object",
          properties: {
            value: { type: "number" },
            source: { type: "string" },
          },
        },
        bathroomCount: {
          type: "object",
          properties: {
            value: { type: "number" },
            source: { type: "string" },
          },
        },
        yearBuilt: {
          type: "object",
          properties: {
            value: { type: "number" },
            source: { type: "string" },
          },
        },
        landArea: {
          type: "object",
          properties: {
            value: { type: "number" },
            unit: { type: "string" },
            source: { type: "string" },
          },
        },
        floorArea: {
          type: "object",
          properties: {
            value: { type: "number" },
            unit: { type: "string" },
            source: { type: "string" },
          },
        },
        frontageWidth: {
          type: "object",
          properties: {
            value: { type: "number" },
            unit: { type: "string" },
            source: { type: "string" },
          },
        },
        propertyType: {
          type: "object",
          properties: {
            type: { type: "string" },
            subtype: { type: "string", nullable: true },
          },
        },
        council: {
          type: "object",
          properties: {
            name: { type: "string" },
            jurisdiction: { type: "string" },
          },
        },
        distanceFromCBD: {
          type: "object",
          properties: {
            distance: { type: "number" },
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
              distance: { type: "number" },
              rating: { type: "number", nullable: true },
            },
          },
        },
        propertyImage: {
          type: "object",
          properties: {
            url: { type: "string" },
            caption: { type: "string", nullable: true },
          },
        },
        estimatedValue: {
          type: "object",
          properties: {
            low: { type: "number" },
            high: { type: "number" },
            median: { type: "number" },
            currency: { type: "string" },
          },
        },
        similarPropertiesForSale: {
          type: "array",
          items: {
            type: "object",
            properties: {
              address: { type: "string" },
              price: { type: "number" },
              bedrooms: { type: "number" },
              bathrooms: { type: "number" },
              landArea: { type: "number" },
            },
          },
        },
        similarPropertiesForRent: {
          type: "array",
          items: {
            type: "object",
            properties: {
              address: { type: "string" },
              rentPerWeek: { type: "number" },
              bedrooms: { type: "number" },
              bathrooms: { type: "number" },
            },
          },
        },
        appraisalSummary: {
          type: "object",
          properties: {
            estimatedRentPerWeek: { type: "number" },
            estimatedRentPerMonth: { type: "number" },
            confidence: { type: "string" },
            notes: { type: "string", nullable: true },
          },
        },
      },
    },
    planningZoningData: {
      type: "object",
      nullable: true,
      properties: {
        heritageOverlays: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              code: { type: "string" },
              description: { type: "string", nullable: true },
            },
          },
        },
        landUse: {
          type: "object",
          properties: {
            current: { type: "string" },
            permitted: { type: "array", items: { type: "string" } },
            prohibited: { type: "array", items: { type: "string" } },
          },
        },
        localPlan: {
          type: "object",
          nullable: true,
          properties: {
            name: { type: "string" },
            reference: { type: "string" },
          },
        },
        localPlanPrecinct: {
          type: "object",
          properties: {
            name: { type: "string" },
            code: { type: "string" },
          },
        },
        localPlanSubprecinct: {
          type: "object",
          properties: {
            name: { type: "string" },
            code: { type: "string" },
          },
        },
        overlays: {
          type: "array",
          nullable: true,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              code: { type: "string" },
              impact: { type: "string" },
            },
          },
        },
        planningScheme: {
          type: "object",
          properties: {
            name: { type: "string" },
            authority: { type: "string" },
          },
        },
        regionalPlan: {
          type: "object",
          nullable: true,
          properties: {
            name: { type: "string" },
            reference: { type: "string" },
          },
        },
        zoneCode: {
          type: "object",
          properties: {
            code: { type: "string" },
            name: { type: "string" },
          },
        },
        zoneDescription: {
          type: "object",
          properties: {
            description: { type: "string" },
            purpose: { type: "string" },
          },
        },
        zonePrecinct: {
          type: "object",
          properties: {
            name: { type: "string" },
            code: { type: "string" },
          },
        },
      },
    },
    environmentalData: {
      type: "object",
      properties: {
        biodiversity: {
          type: "object",
          nullable: true,
          properties: {
            hasProtectedSpecies: { type: "boolean" },
            vegetationType: { type: "string", nullable: true },
            significance: { type: "string", nullable: true },
          },
        },
        bushfireRisk: {
          type: "object",
          nullable: true,
          properties: {
            riskLevel: { type: "string" },
            bmoRequirements: { type: "string", nullable: true },
          },
        },
        characterData: {
          type: "object",
          nullable: true,
          properties: {
            areaCharacter: { type: "string" },
            protectedElements: { type: "array", items: { type: "string" } },
          },
        },
        coastalHazardsData: {
          type: "object",
          nullable: true,
          properties: {
            erosionRisk: { type: "string" },
            inundationRisk: { type: "string" },
          },
        },
        easementsData: {
          type: "array",
          nullable: true,
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              beneficiary: { type: "string" },
              width: { type: "number", nullable: true },
            },
          },
        },
        heritageData: {
          type: "object",
          nullable: true,
          properties: {
            isListed: { type: "boolean" },
            listingType: { type: "string", nullable: true },
            significance: { type: "string", nullable: true },
          },
        },
        floodRiskData: {
          type: "object",
          nullable: true,
          properties: {
            floodZone: { type: "string" },
            riskLevel: { type: "string" },
            aep: { type: "number", nullable: true },
          },
        },
        waterwaysData: {
          type: "object",
          nullable: true,
          properties: {
            nearbyWaterways: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string" },
                  distance: { type: "number" },
                },
              },
            },
            bufferRequirements: { type: "string", nullable: true },
          },
        },
        steepLandData: {
          type: "object",
          nullable: true,
          properties: {
            slope: { type: "number" },
            category: { type: "string" },
            restrictions: { type: "string", nullable: true },
          },
        },
        noisePollutionData: {
          type: "object",
          nullable: true,
          properties: {
            sources: { type: "array", items: { type: "string" } },
            level: { type: "string" },
          },
        },
        odoursData: {
          type: "object",
          properties: {
            sources: { type: "array", items: { type: "string" } },
            impact: { type: "string" },
          },
        },
      },
    },
    infrastructureData: {
      type: "object",
      properties: {
        electricityInfrastructureData: {
          type: "object",
          properties: {
            provider: { type: "string" },
            nearbyTransmissionLines: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  distance: { type: "number" },
                  voltage: { type: "number" },
                },
              },
            },
            substations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                },
              },
            },
          },
        },
        nearbyEmergencyServices: {
          type: "object",
          properties: {
            fireStations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                },
              },
            },
            hospitals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                  type: { type: "string" },
                },
              },
            },
            policeStations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                },
              },
            },
          },
        },
        nearbyParks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              distance: { type: "number" },
              size: { type: "number", nullable: true },
              amenities: { type: "array", items: { type: "string" } },
            },
          },
        },
        nearbyPlaygrounds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              distance: { type: "number" },
              facilities: { type: "array", items: { type: "string" } },
            },
          },
        },
        nearbyShoppingMalls: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              distance: { type: "number" },
              size: { type: "string" },
            },
          },
        },
        sewageData: {
          type: "object",
          properties: {
            provider: { type: "string" },
            system: { type: "string" },
            capacity: { type: "string", nullable: true },
          },
        },
        stormwaterData: {
          type: "object",
          properties: {
            system: { type: "string" },
            drainageNetwork: { type: "string" },
            floodMitigation: { type: "string", nullable: true },
          },
        },
        waterData: {
          type: "object",
          properties: {
            provider: { type: "string" },
            supply: { type: "string" },
            quality: { type: "string", nullable: true },
          },
        },
        publicTransport: {
          type: "object",
          properties: {
            trainStations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                  lines: { type: "array", items: { type: "string" } },
                },
              },
            },
            busStops: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                  routes: { type: "array", items: { type: "string" } },
                },
              },
            },
            tramStops: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  distance: { type: "number" },
                  routes: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        electricity: {
          type: "object",
          properties: {
            provider: { type: "string" },
            nearbyTransmissionLines: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  distance: { type: "number" },
                  voltage: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    locationAndSuburbData: {
      type: "object",
      properties: {
        fiveYearPopulationGrowth: {
          type: "object",
          properties: {
            growthPercentage: { type: "number" },
            trend: { type: "string" },
          },
        },
        occupancyChart: {
          type: "object",
          properties: {
            ownerOccupied: { type: "number" },
            rented: { type: "number" },
            other: { type: "number" },
          },
        },
        populationAmount: {
          type: "object",
          properties: {
            total: { type: "number" },
            density: { type: "number" },
          },
        },
        distanceFromCBD: {
          type: "object",
          properties: {
            distance: { type: "number" },
            unit: { type: "string" },
          },
        },
      },
    },
  },
};
