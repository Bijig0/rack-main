import axios from "axios";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { getOdoursVicmapResponseSchema } from "./getOdoursVicmapResponseSchema";
import { inferRawOdourData } from "./inferOdoursData/InferRawOdourData";
import { InferredOdoursData } from "./types";

type Args = {
  lat: number;
  lon: number;
};

const VLR_WFS_URL = WFS_DATA_URL;

/**
 * Get landfill data from Victorian Landfill Register (VLR)
 * Landfills are a primary source of odour complaints
 */
export const getLandfillData = async ({
  lat,
  lon,
}: Args): Promise<InferredOdoursData[]> => {
  const params = createWfsParams({
    lat,
    lon,
    buffer: 0.5, // 50km buffer - odour can travel long distances
    typeName: "open-data-platform:vlr_point",
  });

  const response = await axios.get(VLR_WFS_URL, {
    params,
    timeout: 15000,
  });

  console.log(
    "Raw landfill data response:",
    JSON.stringify(response.data, null, 2)
  );

  const parsedVlrResponse = getOdoursVicmapResponseSchema().parse(
    response.data
  );

  const { inferredOdoursData } = await inferRawOdourData({
    features: parsedVlrResponse.features,
    propertyLat: lat,
    propertyLon: lon,
  });

  // Sort by distance (closest first)
  inferredOdoursData.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  return inferredOdoursData;
};

if (import.meta.main) {
  const landfills = await getLandfillData({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== LANDFILL DATA ===");
  console.log(`Found ${landfills.length} landfills within 50km`);

  // Show closest 5
  landfills.slice(0, 5).forEach((landfill, index) => {
    console.log(`\n${index + 1}. Site Name: ${landfill.siteName || "Unknown"}`);
    console.log(
      `   Distance: ${landfill.distance?.measurement.toFixed(2)}${
        landfill.distance?.unit
      }`
    );
    console.log(`   Status: ${landfill.status}`);
  });
}
