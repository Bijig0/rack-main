import { BiodiversityData } from "./getBiodiversityData/createBiodiversityResponseSchema/types";
import { InferredBushfireRiskData } from "./getBushFireRiskData/createBushfireRiskResponseSchema/types";
import { BushfireRiskData } from "./getBushFireRiskData/getBushfireRiskData";
import { InferredEasementData } from "./getEasmentsData/types";
import { InferredFloodRiskData } from "./getFloodRiskData/types";
import { InferredHeritageData } from "./getHeritageData/createHeritageResponseSchema/inferRawHeritageData/types";
import { NoisePollutionData as InferredNoisePollutionData } from "./getNoisePollutionData/types";
import { InferredOdoursData } from "./getOdoursData/types";



export type EnvironmentalData = {
  easements?: EasementData;
  heritage?: HeritageData;
  character?: CharacterData;
  floodRisk?: FloodRiskData;
  biodiversity?: BiodiversityData;
  coastalHazards?: CoastalHazardsData;
  waterways?: WaterwaysData;
  wetlands?: WetlandsData;
  bushfireRisk?: BushfireRiskData;
  steepLand?: SteepLandData;
  noisePollution?: NoisePollutionData;
  odours?: OdoursData;
};
