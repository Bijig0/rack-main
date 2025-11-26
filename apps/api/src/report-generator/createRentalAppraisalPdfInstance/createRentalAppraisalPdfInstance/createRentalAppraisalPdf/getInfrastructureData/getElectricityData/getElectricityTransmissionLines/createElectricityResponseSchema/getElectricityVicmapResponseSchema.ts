import { createFeatureSpecificVicmapResponseSchema } from "../../../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { ElectricityFeatureSchema } from "./types";

export const getElectricityVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(ElectricityFeatureSchema);
};
