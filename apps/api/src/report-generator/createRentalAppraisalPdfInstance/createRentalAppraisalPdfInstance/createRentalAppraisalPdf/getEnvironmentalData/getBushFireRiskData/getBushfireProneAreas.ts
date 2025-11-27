import axios from "axios";
import { createWfsParams } from "../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../wfsDataToolkit/defaults";
import { getBushfireRiskVicmapResponseSchema } from "./createBushfireRiskResponseSchema/getBushfireRiskVicmapResponseSchema";
import { inferRawBushfireRiskData } from "./createBushfireRiskResponseSchema/inferRawBushfireRiskData/inferRawBushfireRiskData";
import { InferredBushfireRiskData } from "./createBushfireRiskResponseSchema/types";

type Args = {
  lat: number;
  lon: number;
};

const BUSHFIRE_WFS_URL = WFS_DATA_URL;

/**
 * Get bushfire prone areas data from Victorian government
 */
export const getBushfireProneAreas = async ({
  lat,
  lon,
}: Args): Promise<InferredBushfireRiskData[]> => {
  const params = createWfsParams({
    lat,
    lon,
    buffer: 0.1, // 10km buffer
    typeName: "open-data-platform:bushfire_prone_area",
  });

  const response = await axios.get(BUSHFIRE_WFS_URL, {
    params,
    timeout: 15000,
  });

  const parsedResponse = getBushfireRiskVicmapResponseSchema().parse(
    response.data
  );
  const features = parsedResponse.features;

  const { inferredBushfireRiskData } = inferRawBushfireRiskData({
    features,
  });

  return inferredBushfireRiskData;
};

if (import.meta.main) {
  const bushfireProneAreas = await getBushfireProneAreas({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== BUSHFIRE PRONE AREAS ===");
  console.log(JSON.stringify(bushfireProneAreas, null, 2));

  console.log(`\n✓ Found ${bushfireProneAreas.length} bushfire prone areas`);
}
