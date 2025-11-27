import {
  Dataset,
  EasementFeatures,
  InferredEasementData,
  InferredEasementDataSchema,
} from "../types";
import computeEasementMeasurement from "./computeEasementLength/computeEasementLength";
import inferEasementDescription from "./inferEasementDescription/inferEasementDescription";
import inferEasementType from "./inferEasementType/inferEasementType";
import inferStatusText from "./inferStatusText/inferStatusText";

type Args = {
  features: EasementFeatures;
};

type Return = {
  inferredEasementData: InferredEasementData[];
};

/**
 * Summarizes Vicmap easement features into structured data objects.
 * Provides easement type, size (length or area), and status.
 */
export async function inferRawEasementData({
  features,
}: Args): Promise<Return> {
  if (!features || features.length === 0) {
    return { inferredEasementData: [] };
  }

  // Limit to first 10 features to avoid memory issues with AI calls
  const MAX_FEATURES = 10;
  const limitedFeatures = features.slice(0, MAX_FEATURES);

  if (features.length > MAX_FEATURES) {
    console.warn(`⚠️  Limiting easement processing to ${MAX_FEATURES} features (found ${features.length})`);
  }

  const inferredEasementDataPromises = limitedFeatures.map(
    async (feature): Promise<InferredEasementData> => {
      const { id, properties, geometry } = feature;
      const { status, ufi_created } = properties || {};

      const { easementType } = inferEasementType({ geometry });

      const { measurement, measurementText } = computeEasementMeasurement({
        feature,
      });

      // --- Build dataset info ---
      const date = ufi_created
        ? new Date(ufi_created).toISOString().split("T")[0]
        : "unknown date";

      const dataset = {
        name: "",
        url: "https://abc.com",
      } satisfies Dataset;

      // --- Build readable description ---
      const { inferredStatusText: statusText } = inferStatusText({
        rawStatus: status,
      });

      const { description } = await inferEasementDescription({
        rawEasementFeatures: feature,
        inferredEasementData: {
          status: statusText,
          type: easementType,
          measurement,
          dataset,
        },
      });
      // --- Build structured response ---
      return {
        dataset,
        type: easementType,
        measurement,
        status: statusText,
        description,
      };
    }
  );

  const inferredEasementData = await Promise.all(inferredEasementDataPromises);

  return { inferredEasementData };
}

if (import.meta.main) {
  const sampleFeatures = [
    {
      type: "Feature",
      id: "easement.845421",
      properties: {
        ufi: 729540427,
        pfi: "1128316",
        status: "A",
        task_id: 388080,
        pfi_created: null,
        ufi_old: 276433256,
        ufi_created: "2023-03-05T03:55:35Z",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [144.965464, -37.817438],
          [144.965757, -37.817353],
        ],
      },
    },
  ] as EasementFeatures;

  const result = await inferRawEasementData({
    features: sampleFeatures,
  });

  console.log(JSON.stringify(result, null, 2));

  // Validate the result
  result.inferredEasementData.forEach((data, index) => {
    const validation = InferredEasementDataSchema.safeParse(data);
    if (!validation.success) {
      console.error(`Validation failed for item ${index}:`, validation.error);
    } else {
      console.log(`Item ${index} is valid:`, validation.data);
    }
  });
}
