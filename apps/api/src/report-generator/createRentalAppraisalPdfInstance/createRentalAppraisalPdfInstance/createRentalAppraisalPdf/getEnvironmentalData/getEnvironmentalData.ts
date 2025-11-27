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

// Helper to suggest garbage collection (non-blocking)
// NOTE: Using Bun.gc(true) caused premature process exit, so we use the non-blocking version
const forceGC = () => {
  if (typeof Bun !== "undefined" && Bun.gc) {
    Bun.gc(false);
  }
};

const getEnvironmentalData = async ({ address }: Args): Promise<Return> => {
  console.log(
    `Fetching environmental data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Fetch environmental data from multiple sources
  // Force GC between heavy operations to manage memory

  console.log("📊 ENV: Starting biodiversity data fetch...");
  const { biodiversityData } = await getBiodiversityData({ address });
  forceGC();
  console.log("✅ ENV: Biodiversity data complete");

  console.log("📊 ENV: Starting bushfire risk data fetch...");
  const { fireHistory, riskAnalysis } = await getBushfireRiskData({ address });
  forceGC();
  console.log("✅ ENV: Bushfire risk data complete");

  console.log("📊 ENV: Starting character data fetch...");
  const { characterData } = await getCharacterData({ address });
  forceGC();
  console.log("✅ ENV: Character data complete");

  console.log("📊 ENV: Starting coastal hazard data fetch...");
  const { coastalHazardData } = await getCoastalHazardData({ address });
  forceGC();
  console.log("✅ ENV: Coastal hazard data complete");

  console.log("📊 ENV: Starting easements data fetch...");
  const { easementData } = await getEasementsData({ address });
  forceGC();
  console.log("✅ ENV: Easements data complete");

  console.log("📊 ENV: Starting flood risk data fetch...");
  const { floodRiskData } = await getFloodRiskData({ address });
  forceGC();
  console.log("✅ ENV: Flood risk data complete");

  console.log("📊 ENV: Starting heritage data fetch...");
  const { heritageData } = await getHeritageData({ address });
  forceGC();
  console.log("✅ ENV: Heritage data complete");

  console.log("📊 ENV: Starting noise pollution data fetch...");
  const { noisePollutionData } = await getNoisePollutionData({ address });
  forceGC();
  console.log("✅ ENV: Noise pollution data complete");

  console.log("📊 ENV: Starting odour data fetch...");
  const { odourLevelAnalysis, landfills, wasteWaterPlants } =
    await getOdourData({ address });
  forceGC();
  console.log("✅ ENV: Odour data complete");

  console.log("📊 ENV: Starting steep land data fetch...");
  const { steepLandData } = await getSteepLandData({ address });
  forceGC();
  console.log("✅ ENV: Steep land data complete");

  console.log("📊 ENV: Starting waterway data fetch...");
  const { waterwayData } = await getWaterwayData({ address });
  forceGC();
  console.log("✅ ENV: Waterway data complete");

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
