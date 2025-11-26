#!/Users/a61403/.bun/bin/bun
import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { analyzeNoiseLevel } from "./analyzeNoiseLevel";
import { getTrafficSignalData } from "./getTrafficSignalData/getTrafficSignalData";
import { getVicmapRoadlineData } from "./getVicmapRoadlineData/getVicmapRoadlineData";
import { NoisePollutionData, NoisePollutionDataSchema } from "./types";

type Args = {
  address: Address;
};

type Return = {
  noisePollutionData: NoisePollutionData;
};

/**
 * Gets noise pollution data for a property based on nearby road infrastructure
 *
 * Methodology:
 * 1. Fetches nearby roads from Vicmap Transport within 500m radius
 * 2. Classifies roads by type (freeway, highway, arterial, main, collector, local)
 * 3. Calculates distance from property to each road
 * 4. Estimates noise levels using distance attenuation model (6 dB per doubling distance)
 * 5. Provides overall noise classification and description
 *
 * Noise Level Categories:
 * - VERY_HIGH: Major highways/freeways within 50m (~75+ dB(A))
 * - HIGH: Arterial roads within 100m or highways 50-200m (~65-75 dB(A))
 * - MODERATE: Main roads within 100m or arterials 100-300m (~55-65 dB(A))
 * - LOW: Collector roads or distant main roads (~45-55 dB(A))
 * - MINIMAL: Only local roads or no significant roads (~35-45 dB(A))
 */
export const getNoisePollutionData = async ({
  address,
}: Args): Promise<Return> => {
  console.log("\n🔊 Analyzing noise pollution...");

  try {
    // Get geocoded coordinates
    const geocoded = await geocodeAddress({ address });
    if (!geocoded) {
      console.log("❌ Could not geocode address for noise analysis");
      return { noisePollutionData: null };
    }

    const { lat, lon } = geocoded;

    // Fetch nearby road data from Vicmap Transport
    const { roadFeatures } = await getVicmapRoadlineData({
      address,
      bufferMeters: 500, // 500m radius
    });

    console.log(`\nFound ${roadFeatures.length} roads:`);
    roadFeatures.forEach((road) => {
      console.log(
        `- ${road.properties.road_name || "Unnamed"} (${
          road.properties.road_type || "Unknown type"
        })`
      );
    });

    // Fetch traffic signal volume data
    const { trafficData } = await getTrafficSignalData({
      address,
      radiusKm: 2,
    });

    // Analyze noise levels with both road and traffic data
    const {
      noiseLevel,
      noiseSources,
      estimatedAverageNoiseLevel,
      trafficVolumeContribution,
      description,
    } = await analyzeNoiseLevel({
      roadFeatures,
      propertyLat: lat,
      propertyLon: lon,
      trafficData,
    });

    const noisePollutionData = NoisePollutionDataSchema.parse({
      noiseLevel,
      primarySources: noiseSources,
      nearbyRoadsCount: roadFeatures.length,
      estimatedAverageNoiseLevel,
      trafficVolumeContribution,
      description,
    });

    console.log(`✅ Noise pollution analysis complete`);
    console.log(`   Level: ${noiseLevel}`);
    console.log(`   Average: ${estimatedAverageNoiseLevel} dB(A)`);
    console.log(`   Nearby roads: ${roadFeatures.length}`);

    return { noisePollutionData };
  } catch (error) {
    console.error("Error analyzing noise pollution:", error);
    return { noisePollutionData: null };
  }
};

if (import.meta.main) {
  const { noisePollutionData } = await getNoisePollutionData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log("\n📊 Noise Pollution Data:");
  console.log(JSON.stringify(noisePollutionData, null, 2));
}
