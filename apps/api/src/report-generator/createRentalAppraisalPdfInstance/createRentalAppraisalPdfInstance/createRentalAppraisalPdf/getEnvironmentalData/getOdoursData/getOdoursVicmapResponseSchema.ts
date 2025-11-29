import { createFeatureSpecificVicmapResponseSchema } from "../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { OdoursFeatureSchema } from "./types";

export const getOdoursVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(OdoursFeatureSchema);
};
