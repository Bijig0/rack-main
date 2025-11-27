import axios from "axios";
import { getWastewaterResponseSchema } from "./createWastewaterResponseSchema/getWastewaterResponseSchema";
import { inferRawWastewaterData } from "./createWastewaterResponseSchema/inferRawWastewaterData/inferRawWastewaterData";
import { InferredWastewaterData } from "./createWastewaterResponseSchema/types";

type Args = {
  lat: number;
  lon: number;
};

const WASTEWATER_WFS_URL =
  "https://services.ga.gov.au/gis/services/Wastewater_Treatment_Facilities/MapServer/WFSServer";

/**
 * Get wastewater treatment plants from Geoscience Australia
 * Wastewater treatment facilities are significant odour sources
 */
export const getWastewaterTreatmentPlants = async ({
  lat,
  lon,
}: Args): Promise<InferredWastewaterData[]> => {
  const buffer = 10; // 20km buffer - wastewater odour can travel significant distances

  // Manually construct WFS params for Geoscience Australia
  const params = {
    SERVICE: "WFS",
    VERSION: "2.0.0",
    REQUEST: "GetFeature",
    OUTPUTFORMAT: "GEOJSON",
    typeName:
      "Wastewater_Treatment_Facilities:National_Wastewater_Treatment_Facilities",
    BBOX: `${lon - buffer},${lat - buffer},${lon + buffer},${
      lat + buffer
    },EPSG:4326`,
    count: 50,
  };
  const response = await axios.get(WASTEWATER_WFS_URL, {
    params,
    timeout: 30000, // Increased to 30 seconds
  });

  const parsedResponse = getWastewaterResponseSchema().parse(response.data);
  const features = parsedResponse.features;

  const { inferredWastewaterData } = inferRawWastewaterData({
    features,
    propertyLat: lat,
    propertyLon: lon,
  });

  // Sort by distance (closest first)
  inferredWastewaterData.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  return inferredWastewaterData;
};

if (import.meta.main) {
  const wastewaterPlants = await getWastewaterTreatmentPlants({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== WASTEWATER TREATMENT PLANTS ===");
  console.log(
    `Found ${wastewaterPlants.length} wastewater treatment plants within 20km`
  );

  // Show closest 5
  wastewaterPlants.slice(0, 5).forEach((plant, index) => {
    console.log(`\n${index + 1}. ${plant.facilityName || "Unknown facility"}`);
    console.log(`   Type: ${plant.facilityType}`);
    console.log(`   Operator: ${plant.operator}`);
    console.log(
      `   Distance: ${plant.distance?.measurement.toFixed(2)}${
        plant.distance?.unit
      }`
    );
  });

  console.log(
    `\n✓ Found ${wastewaterPlants.length} wastewater treatment plants`
  );
}
