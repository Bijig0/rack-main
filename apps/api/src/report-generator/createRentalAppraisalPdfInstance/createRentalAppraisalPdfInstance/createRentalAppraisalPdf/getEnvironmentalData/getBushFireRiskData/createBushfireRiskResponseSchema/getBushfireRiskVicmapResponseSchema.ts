import { createFeatureSpecificVicmapResponseSchema } from "../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { BushfireRiskFeatureSchema } from "./types";

export const getBushfireRiskVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(BushfireRiskFeatureSchema);
};
