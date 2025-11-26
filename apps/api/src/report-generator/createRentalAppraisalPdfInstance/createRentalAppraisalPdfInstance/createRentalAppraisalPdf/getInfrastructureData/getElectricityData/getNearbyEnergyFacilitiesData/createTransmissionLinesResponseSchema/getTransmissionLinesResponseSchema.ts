import { createFeatureSpecificVicmapResponseSchema } from "../../../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import { TransmissionLineFeatureSchema } from "./types";

export const getTransmissionLinesResponseSchema = () => {
  // Reuse the generic Vicmap response creator with transmission line feature schema
  return createFeatureSpecificVicmapResponseSchema(
    TransmissionLineFeatureSchema
  );
};
