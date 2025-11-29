import { createFeatureSpecificVicmapResponseSchema } from "../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { FireHistoryFeatureSchema } from "./types";

export const getFireHistoryResponseSchema = () => {
  return createFeatureSpecificVicmapResponseSchema(FireHistoryFeatureSchema);
};
