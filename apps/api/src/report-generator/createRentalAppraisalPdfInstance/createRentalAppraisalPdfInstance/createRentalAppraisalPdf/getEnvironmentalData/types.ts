import z from "zod";
import { BiodiversityDataSchema } from "./getBiodiversityData/createBiodiversityResponseSchema/types";
import { CharacterDataSchema } from "./getCharacterData/types";
import { CoastalHazardDataSchema } from "./getCoastalHazardData/types";
import { EasementDataSchema } from "./getEasmentsData/types";
import { FloodRiskDataSchema } from "./getFloodRiskData/types";
import { HeritageAnalysisDataSchema } from "./getHeritageData/analyzeHeritageData";
import { NoisePollutionDataSchema } from "./getNoisePollutionData/types";
import { OdourDataSchema } from "./getOdoursData/getOdourData";
import { SteepLandDataSchema } from "./getSteepLandData/types";
import { WaterwayDataSchema } from "./getWaterwayData/types";
import { BushfireRiskDataSchema } from "./getBushFireRiskData/getBushfireRiskData";

export const EnvironmentalDataSchema = z.object({
  biodiversity: BiodiversityDataSchema.nullable(),
  bushfireRisk: BushfireRiskDataSchema.nullable(),
  characterData: CharacterDataSchema.nullable(),
  coastalHazardsData: CoastalHazardDataSchema.nullable(),
  easementsData: EasementDataSchema.nullable(),
  heritageData: HeritageAnalysisDataSchema.nullable(),
  floodRiskData: FloodRiskDataSchema.nullable(),
  waterwaysData: WaterwayDataSchema.nullable(),
  steepLandData: SteepLandDataSchema.nullable(),
  noisePollutionData: NoisePollutionDataSchema.nullable(),
  odoursData: OdourDataSchema,
});

export type EnvironmentalData = z.infer<typeof EnvironmentalDataSchema>;
