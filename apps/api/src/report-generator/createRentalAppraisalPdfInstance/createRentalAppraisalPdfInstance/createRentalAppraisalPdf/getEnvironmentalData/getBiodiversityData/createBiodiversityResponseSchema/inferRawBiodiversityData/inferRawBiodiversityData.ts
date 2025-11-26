import { numberToString } from "../../../../../../../../utils/numberToString/numberToString";
import {
  FaunaFeatures,
  FloraFeatures,
  InferredFaunaData,
  InferredFaunaDataSchema,
  InferredFloraData,
  InferredFloraDataSchema,
} from "../types";

type Args = {
  faunaFeatures: FaunaFeatures;
  floraFeatures: FloraFeatures;
};

type Return = {
  inferredFaunaData: InferredFaunaData[];
  inferredFloraData: InferredFloraData[];
};

export function inferBiodiversityData({
  faunaFeatures,
  floraFeatures,
}: Args): Return {
  // console.log({ faunaFeatures, floraFeatures });

  const inferredFaunaData = faunaFeatures.map((feature) => {
    const { properties } = feature;

    const recordId = numberToString.parse(properties.record_id);
    const locationDescription = properties.locn_desc;
    const scientificName = properties.sci_name;
    const commonName = properties.comm_name;
    const taxonType = properties.taxon_type;

    return InferredFaunaDataSchema.parse({
      type: "fauna",
      recordId,
      locationDescription,
      scientificName,
      commonName,
      taxonType,
    });
  });

  const inferredFloraData = floraFeatures.map((feature) => {
    const { properties } = feature;

    const recordId = numberToString.parse(properties.record_id);
    const scientificName = properties.sci_name;
    const commonName = properties.comm_name;
    const locationDescription = properties.locn_desc;
    const origin = properties.origin;
    const victorianLifeCategory = properties.vic_lf;

    return InferredFloraDataSchema.parse({
      type: "flora",
      recordId,
      scientificName,
      commonName,
      locationDescription,
      origin,
      victorianLifeCategory,
    });
  });

  return {
    inferredFaunaData: inferredFaunaData,
    inferredFloraData,
  };
}
