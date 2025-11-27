import axios from "axios";
import { getFireHistoryResponseSchema } from "./createFireHistoryResponseSchema/getFireHistoryResponseSchema";
import { inferRawFireHistoryData } from "./createFireHistoryResponseSchema/inferRawFireHistoryData/inferRawFireHistoryData";
import { InferredFireHistoryData } from "./createFireHistoryResponseSchema/types";

type Args = {
  lat: number;
  lon: number;
};

const FIRE_HISTORY_WFS_URL = "https://opendata.maps.vic.gov.au/geoserver/wfs";

/**
 * Get historical fire records from Victorian government data
 * Includes bushfires and planned burns since 1903
 */
export const getFireHistory = async ({
  lat,
  lon,
}: Args): Promise<InferredFireHistoryData[]> => {
  const buffer = 0.1; // 10km buffer

  // Manually construct WFS params since this is from opendata.maps.vic.gov.au
  const params = {
    SERVICE: "WFS",
    VERSION: "2.0.0",
    REQUEST: "GetFeature",
    OUTPUTFORMAT: "application/json",
    typeName: "fire_history_scar", // From data.vic.gov.au
    BBOX: `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer},EPSG:4326`,
    count: 100, // Get up to 100 fire records
  };

  const response = await axios.get(FIRE_HISTORY_WFS_URL, {
    params,
    timeout: 15000,
  });

  const parsedResponse = getFireHistoryResponseSchema().parse(response.data);
  const features = parsedResponse.features;

  const { inferredFireHistoryData } = inferRawFireHistoryData({
    features,
    propertyLat: lat,
    propertyLon: lon,
  });

  // Sort by distance (closest first)
  inferredFireHistoryData.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  return inferredFireHistoryData;
};

if (import.meta.main) {
  const fireHistory = await getFireHistory({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== FIRE HISTORY ===");
  console.log(`Found ${fireHistory.length} historical fires`);

  // Show first 10 fires
  console.log("\nClosest 10 fires:");
  fireHistory.slice(0, 10).forEach((fire, index) => {
    console.log(`\n${index + 1}. ${fire.fireName || fire.fireId || "Unnamed fire"}`);
    console.log(`   Type: ${fire.fireType}`);
    console.log(`   Season: ${fire.fireSeason}`);
    console.log(`   Distance: ${fire.distance?.measurement.toFixed(2)}${fire.distance?.unit}`);
    console.log(`   Area: ${fire.area?.measurement.toFixed(2)}${fire.area?.unit}`);
  });

  console.log(`\n✓ Found ${fireHistory.length} historical fire records`);
}
