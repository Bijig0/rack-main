import { InferredBiodiversityData } from "./getBiodiversityData/createBiodiversityResponseSchema/types";
import { InferredBushfireRiskData } from "./getBushFireRiskData/createBushfireRiskResponseSchema/types";
import { InferredEasementData } from "./getEasmentsData/types";
import { InferredFloodRiskData } from "./getFloodRiskData/types";
import { InferredHeritageData } from "./getHeritageData/createHeritageResponseSchema/inferRawHeritageData/types";
import { NoisePollutionData as InferredNoisePollutionData } from "./getNoisePollutionData/types";
import { InferredOdoursData } from "./getOdoursData/types";

// Type aliases for cleaner separation between data fetching and data usage layer
type EasementData = InferredEasementData;
type HeritageData = InferredHeritageData;
type CharacterData = InferredCharacterData;
type FloodRiskData = InferredFloodRiskData;
type BiodiversityData = InferredBiodiversityData;
type CoastalHazardsData = InferredCoastalHazardsData;
type WaterwaysData = InferredWaterwaysData;
type WetlandsData = InferredWetlandsData;
type BushfireRiskData = InferredBushfireRiskData;
type SteepLandData = InferredSteepLandData;
type NoisePollutionData = InferredNoisePollutionData;
type OdoursData = InferredOdoursData;

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
