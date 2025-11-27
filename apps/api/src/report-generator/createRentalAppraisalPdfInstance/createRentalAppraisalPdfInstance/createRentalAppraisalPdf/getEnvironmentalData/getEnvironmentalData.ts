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

const getEnvironmentalData = async ({ address }: Args): Promise<Return> => {
  console.log(
    `Fetching environmental data for: ${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`
  );

  // Fetch environmental data from multiple sources
  // Force GC between heavy operations to manage memory

  const { biodiversityData } = await getBiodiversityData({ address });

  const { fireHistory, fireManagementZones, riskAnalysis } =
    await getBushfireRiskData({ address });

  const { characterData } = await getCharacterData({ address });

  const { coastalHazardData } = await getCoastalHazardData({ address });

  const { easementData } = await getEasementsData({ address });

  const { floodRiskData } = await getFloodRiskData({ address });

  const { heritageData } = await getHeritageData({ address });

  const { noisePollutionData } = await getNoisePollutionData({ address });

  const { odourLevelAnalysis, landfills, wasteWaterPlants } =
    await getOdourData({ address });

  const { steepLandData } = await getSteepLandData({ address });

  const { waterwayData } = await getWaterwayData({ address });

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
