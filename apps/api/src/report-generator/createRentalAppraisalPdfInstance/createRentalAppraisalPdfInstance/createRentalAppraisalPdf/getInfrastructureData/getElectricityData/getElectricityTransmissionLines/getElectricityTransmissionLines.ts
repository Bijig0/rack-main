import axios from "axios";
import { getTransmissionLinesResponseSchema } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/getTransmissionLinesResponseSchema";
import { inferRawTransmissionLineData } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/inferRawTransmissionLineData/inferRawTransmissionLineData";
import { InferredTransmissionLineData } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

const NATIONAL_ELECTRICITY_WFS_URL =
  "https://services.ga.gov.au/gis/services/National_Electricity_Infrastructure/MapServer/WFSServer";

type Args = {
  lat: number;
  lon: number;
};

/**
 * Get electricity transmission lines from National Electricity Infrastructure
 */
export const getElectricityTransmissionLines = async ({
  lat,
  lon,
}: Args): Promise<InferredTransmissionLineData[]> => {
  const buffer = 0.1; // 10km buffer - adjust as needed

  // GeoJSON format works with Geoscience Australia WFS
  const transmissionLinesParams = {
    SERVICE: "WFS",
    VERSION: "2.0.0",
    REQUEST: "GetFeature",
    OUTPUTFORMAT: "GEOJSON",
    typeName:
      "National_Electricity_Infrastructure:Electricity_Transmission_Lines",
    count: 50, // Get up to 50 transmission lines
  };

  const transmissionLinesResponse = await axios.get(
    NATIONAL_ELECTRICITY_WFS_URL,
    {
      params: transmissionLinesParams,
      timeout: 15000,
    }
  );

  console.log(
    "Raw transmission lines response:",
    JSON.stringify(transmissionLinesResponse.data, null, 2)
  );

  const parsedTransmissionLinesResponse =
    getTransmissionLinesResponseSchema().parse(transmissionLinesResponse.data);

  const transmissionLinesFeatures = parsedTransmissionLinesResponse.features;

  console.log({ transmissionLinesFeatures }, { depth: null });

  const { inferredTransmissionLineData } = inferRawTransmissionLineData({
    features: transmissionLinesFeatures,
    propertyLat: lat,
    propertyLon: lon,
  });

  return inferredTransmissionLineData;
};

if (import.meta.main) {
  const transmissionLines = await getElectricityTransmissionLines({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== ELECTRICITY TRANSMISSION LINES ===");
  console.log(JSON.stringify(transmissionLines, null, 2));

  console.log(`\n✓ Found ${transmissionLines.length} transmission lines`);
}
