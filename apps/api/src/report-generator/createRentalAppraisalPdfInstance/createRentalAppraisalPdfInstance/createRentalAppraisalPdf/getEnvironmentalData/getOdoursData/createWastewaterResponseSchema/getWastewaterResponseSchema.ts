import { createFeatureSpecificVicmapResponseSchema } from "../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { WastewaterFeatureSchema } from "./types";

export const getWastewaterResponseSchema = () => {
  return createFeatureSpecificVicmapResponseSchema(WastewaterFeatureSchema);
};
