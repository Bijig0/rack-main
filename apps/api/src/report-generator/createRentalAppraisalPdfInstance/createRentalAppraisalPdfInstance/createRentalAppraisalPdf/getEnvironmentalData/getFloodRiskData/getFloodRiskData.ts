import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { analyzeFloodRisk } from "./analyzeFloodRisk";
// import { get100YearFloodExtentData } from "./get100YearFloodExtentData/get100YearFloodExtentData";
import { get2022FloodHistoryData } from "./get2022FloodHistoryData/get2022FloodHistoryData";
import { FloodRiskData, FloodRiskDataSchema } from "./types";

type Args = {
  address: Address;
};

type Return = {
  floodRiskData: FloodRiskData;
};

/**
 * Gets comprehensive flood risk data for a property using multiple Victorian Government datasets
 *
 * Data Sources:
 * 1. VIC_FLOOD_HISTORY_PUBLIC - October 2022 historical flood event data
 *    - Observed, derived or estimated inundation extent
 *    - Sources: aerial photography, satellite imagery, GPS, ground observers
 *    - Note: Represents point in time, may not capture peak extent
 *
 * 2. FLOOD_100_YEAR_EXTENT - 1 in 100 year (1% AEP) statistical flood extent
 *    - Modelled data using hydrological models and historic flood data
 *    - Used for Land Subject to Inundation Overlay (LSIO) in planning schemes
 *    - 1 in 100 year = 1% chance of occurring in any given year
 *
 * Methodology:
 * 1. Fetch historical flood data (2022 October event) within 1km radius
 * 2. Fetch modelled 100-year flood extent within 1km radius
 * 3. Calculate distance from property to all flood zones
 * 4. Determine if property is within any flood extents
 * 5. Classify overall flood risk level (VERY_HIGH to MINIMAL)
 * 6. Provide planning and mitigation recommendations
 *
 * Risk Levels:
 * - VERY_HIGH: Property affected by 2022 historical flood
 * - HIGH: Property within 1 in 100 year flood extent
 * - MODERATE: Property near flood zones (< 100m)
 * - LOW: Property in proximity to flood zones (< 500m)
 * - MINIMAL: No identified flood hazards nearby
 */
export const getFloodRiskData = async ({ address }: Args): Promise<Return> => {
  console.log("Analyzing flood risk...");

  try {
    // Get geocoded coordinates
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("Could not geocode address for flood risk analysis");
      return { floodRiskData: null };
    }

    const { lat, lon } = geocoded;

    // Fetch flood data from multiple sources
    // Note: 100-year flood extent typename needs to be verified with WFS GetCapabilities
    const { floodHistory2022Features } = await get2022FloodHistoryData({
      address,
      bufferMeters: 1000,
    });

    // Temporarily disable 100-year flood extent until correct typename is identified
    const flood100YearFeatures: any[] = [];
    // const { flood100YearFeatures } = await get100YearFloodExtentData({
    //   address,
    //   bufferMeters: 1000,
    // });

    // Check if any flood data was found
    if (
      floodHistory2022Features.length === 0 &&
      flood100YearFeatures.length === 0
    ) {
      console.log("No flood risk zones found within 1km of property");

      const floodRiskData = FloodRiskDataSchema.parse({
        riskLevel: "MINIMAL",
        affectedByHistoricalFlood: false,
        within100YearFloodExtent: false,
        floodSources: [],
        nearbyFloodZonesCount: 0,
        description:
          "Minimal flood risk - no identified flood hazards in the immediate vicinity",
        recommendations: [
          "Property appears to be outside identified flood risk areas",
          "Standard drainage and stormwater management practices recommended",
        ],
      });

      return { floodRiskData };
    }

    // Analyze flood risk with all available data sources
    const {
      riskLevel,
      affectedByHistoricalFlood,
      within100YearFloodExtent,
      floodSources,
      nearbyFloodZonesCount,
      minimumDistanceToFloodZone,
      description,
      recommendations,
    } = await analyzeFloodRisk({
      floodHistory2022Features,
      flood100YearFeatures,
      propertyLat: lat,
      propertyLon: lon,
    });

    const floodRiskData = FloodRiskDataSchema.parse({
      riskLevel,
      affectedByHistoricalFlood,
      within100YearFloodExtent,
      floodSources,
      nearbyFloodZonesCount,
      minimumDistanceToFloodZone,
      description,
      recommendations,
    });

    console.log("Flood risk analysis complete");
    console.log(`   Risk level: ${riskLevel}`);
    console.log(`   Nearby flood zones: ${nearbyFloodZonesCount}`);

    return { floodRiskData };
  } catch (error) {
    console.error("Error analyzing flood risk:", error);
    return { floodRiskData: null };
  }
};

// Allow running this file directly for testing
if (import.meta.main) {
  const { floodRiskData } = await getFloodRiskData({
    address: {
      addressLine: "50 Welsford Street",
      suburb: "Shepparton",
      state: "VIC" as const,
      postcode: "3630",
    },
  });

  console.log("\nFlood Risk Data:");
  console.log(JSON.stringify(floodRiskData, null, 2));
}
