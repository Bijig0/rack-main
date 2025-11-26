import { BiodiversityData } from "./getBiodiversityData/createBiodiversityResponseSchema/types";
import { BushfireRiskData } from "./getBushFireRiskData/getBushfireRiskData";
import { CharacterData } from "./getCharacterData/types";
import { CoastalHazardData } from "./getCoastalHazardData/types";
import { EasementData } from "./getEasmentsData/types";
import { FloodRiskData } from "./getFloodRiskData/types";
import { HeritageAnalysisData } from "./getHeritageData/analyzeHeritageData";
import { NoisePollutionData } from "./getNoisePollutionData/types";
import { SteepLandData } from "./getSteepLandData/types";
import { WaterwayData } from "./getWaterwayData/types";

export type EnvironmentalData = {
  biodiversity?: BiodiversityData;
  bushfireRisk?: BushfireRiskData;
  characterData?: CharacterData;
  coastalHazardsData?: CoastalHazardData;
  easementsData?: EasementData;
  heritageData?: HeritageAnalysisData;
  floodRiskData?: FloodRiskData;
  waterwaysData?: WaterwayData;
  steepLandData?: SteepLandData;
  noisePollutionData?: NoisePollutionData;
  odoursData?: OdourData;
};
