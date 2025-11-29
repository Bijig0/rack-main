import { Address } from "../../../../../shared/types";
import { getBiodiversityData } from "./getBiodiversityData/getBiodiversityData";
import { getBushfireRiskData } from "./getBushFireRiskData/getBushfireRiskData";
import { getCharacterData } from "./getCharacterData/getCharacterData";
import { getCoastalHazardData } from "./getCoastalHazardData/getCoastalHazardData";
import { getEasementsData } from "./getEasmentsData/getEasementsData";
import { getFloodRiskData } from "./getFloodRiskData/getFloodRiskData";
import { getHeritageData } from "./getHeritageData/getHeritageData";
import { getNoisePollutionData } from "./getNoisePollutionData/getNoisePollutionData";
import { getOdourData } from "./getOdoursData/getOdourData";
import { getSteepLandData } from "./getSteepLandData/getSteepLandData";
import { getWaterwayData } from "./getWaterwayData/getWaterwayData";
import { EnvironmentalData } from "./types";

type Args = {
  address: Address;
};

type Return = {
  environmentalData: EnvironmentalData;
};

// Helper to suggest garbage collection
// Use blocking GC for memory-intensive operations to prevent OOM kills
const forceGC = (blocking = false) => {
  if (typeof Bun !== "undefined" && Bun.gc) {
    try {
      Bun.gc(blocking);
    } catch (error) {
      console.warn("⚠️  GC failed:", error);
    }
  }
};

/**
 * Logs current memory usage with a label
 */
const logMemoryUsage = (label: string) => {
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  const rssMB = Math.round(used.rss / 1024 / 1024);
  console.log(`   📊 [ENV ${label}] Heap: ${heapUsedMB} MB | RSS: ${rssMB} MB`);
};

const getEnvironmentalData = async ({ address }: Args): Promise<Return> => {
  console.log(
    `Fetching environmental data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Fetch environmental data from multiple sources
  // Force GC between heavy operations to manage memory

  logMemoryUsage("START");

  // Run easements FIRST before memory builds up from other operations
  console.log("📊 ENV: Starting easements data fetch...");
  const { easementData } = await getEasementsData({ address });
  forceGC(true);
  logMemoryUsage("After easements");

  console.log("📊 ENV: Starting biodiversity data fetch...");
  const { biodiversityData } = await getBiodiversityData({ address });
  forceGC();
  logMemoryUsage("After biodiversity");

  console.log("📊 ENV: Starting bushfire risk data fetch...");
  const { fireHistory, riskAnalysis } = await getBushfireRiskData({ address });
  forceGC();
  logMemoryUsage("After bushfire");

  console.log("📊 ENV: Starting character data fetch...");
  const { characterData } = await getCharacterData({ address });
  forceGC();
  logMemoryUsage("After character");

  console.log("📊 ENV: Starting coastal hazard data fetch...");
  const { coastalHazardData } = await getCoastalHazardData({ address });
  forceGC(true);
  logMemoryUsage("After coastal");

  console.log("📊 ENV: Starting flood risk data fetch...");
  const { floodRiskData } = await getFloodRiskData({ address });
  forceGC();
  logMemoryUsage("After flood");

  console.log("📊 ENV: Starting heritage data fetch...");
  const { heritageData } = await getHeritageData({ address });
  forceGC();
  logMemoryUsage("After heritage");

  // Force blocking GC before memory-intensive operation
  forceGC(true);
  console.log("📊 ENV: Starting noise pollution data fetch...");
  const { noisePollutionData } = await getNoisePollutionData({ address });
  forceGC(true);
  logMemoryUsage("After noise");

  console.log("📊 ENV: Starting odour data fetch...");
  const { odourLevelAnalysis, landfills, wasteWaterPlants } =
    await getOdourData({ address });
  forceGC(true);
  logMemoryUsage("After odour");

  console.log("📊 ENV: Starting steep land data fetch...");
  const { steepLandData } = await getSteepLandData({ address });
  forceGC();
  logMemoryUsage("After steepland");

  console.log("📊 ENV: Starting waterway data fetch...");
  const { waterwayData } = await getWaterwayData({ address });
  forceGC();
  logMemoryUsage("After waterway");

  const environmentalData = {
    biodiversity: biodiversityData,
    bushfireRisk: { fireHistory, riskAnalysis },
    characterData: characterData,
    coastalHazardsData: coastalHazardData,
    easementsData: easementData,
    heritageData: heritageData,
    floodRiskData: floodRiskData,
    waterwaysData: waterwayData,
    steepLandData: steepLandData,
    noisePollutionData: noisePollutionData,
    odoursData: {
      odourLevelAnalysis,
      landfills: landfills.slice(0, 3),
      wasteWaterPlants: wasteWaterPlants.slice(0, 3),
    },
  } satisfies EnvironmentalData;

  return { environmentalData };
};

if (import.meta.main) {
  const { environmentalData } = await getEnvironmentalData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log("\n📊 Environmental Data Summary:");
  console.log(JSON.stringify(environmentalData, null, 2));
}

export default getEnvironmentalData;
