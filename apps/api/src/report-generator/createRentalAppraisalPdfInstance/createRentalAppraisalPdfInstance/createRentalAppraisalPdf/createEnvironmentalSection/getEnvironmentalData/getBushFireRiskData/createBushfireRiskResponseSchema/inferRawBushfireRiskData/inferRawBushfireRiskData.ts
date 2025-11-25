import {
  BushfireRiskFeature,
  InferredBushfireRiskData,
  InferredBushfireRiskDataSchema,
} from "../types";

type Args = {
  features: BushfireRiskFeature[];
};

type Return = {
  inferredBushfireRiskData: InferredBushfireRiskData[];
};

export function inferRawBushfireRiskData({ features }: Args): Return {
  const inferredBushfireRiskData: InferredBushfireRiskData[] = features.map(
    (feature) => {
      const props = feature.properties;

      // Human-readable fields
      const humanReadable = {
        lga:
          props.lga_name && props.lga_code
            ? `${props.lga_name} (Code: ${props.lga_code})`
            : props.lga_name,
        bushfirePlanReference: props.plan_number,
        gazettalDate: props.gazettal_date,
        areaKm2: props.bpa_area_ha ? props.bpa_area_ha / 100 : undefined, // hectares → km²
      } satisfies InferredBushfireRiskData;

      // Validate with Zod schema
      return InferredBushfireRiskDataSchema.parse(humanReadable);
    }
  );

  return {
    inferredBushfireRiskData,
  };
}
