import { createFeatureSpecificVicmapResponseSchema } from "../../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { HeritageFeatureSchema } from "./types";

export const getHeritageVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(HeritageFeatureSchema);
};
