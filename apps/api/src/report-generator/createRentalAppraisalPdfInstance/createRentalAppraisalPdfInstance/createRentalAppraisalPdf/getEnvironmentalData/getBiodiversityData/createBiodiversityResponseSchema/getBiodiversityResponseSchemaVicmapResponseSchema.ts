import { createFeatureSpecificVicmapResponseSchema } from "../../../../../wfsDataToolkit/createFeatureSpecificVicmapResponseSchema";
import {
  BiodiversityFeatureSchema,
  FaunaFeatureSchema,
  FloraFeatureSchema,
} from "./types";

export const getBiodiversityVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(BiodiversityFeatureSchema);
};

export const getFloraVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(FloraFeatureSchema);
};

export const getFaunaVicmapResponseSchema = () => {
  // Pass the custom feature schema into the generic Vicmap response creator
  return createFeatureSpecificVicmapResponseSchema(FaunaFeatureSchema);
};
