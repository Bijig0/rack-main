import axios from "axios";
import { createWfsParams } from "../../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../../wfsDataToolkit/defaults";
import { getElectricityVicmapResponseSchema } from "../getElectricityTransmissionLines/createElectricityResponseSchema/getElectricityVicmapResponseSchema";
import { inferRawElectricityData } from "../getElectricityTransmissionLines/createElectricityResponseSchema/inferRawElectricityData/inferRawElectricityData";
import { InferredElectricityData } from "../getElectricityTransmissionLines/createElectricityResponseSchema/types";

const VIC_ELECTRICITY_WFS_URL = WFS_DATA_URL;

type Args = {
  lat: number;
  lon: number;
};

/**
 * Get nearby energy facilities from Victorian government data
 */
export const getNearbyEnergyFacilitiesData = async ({
  lat,
  lon,
}: Args): Promise<InferredElectricityData[]> => {
  const energyFacilitiesParams = createWfsParams({
    lat,
    lon,
    buffer: 0.1, // 10km buffer - adjust as needed
    typeName: "open-data-platform:energy_facilities", // PLACEHOLDER - update with actual layer name
  });

  const energyFacilitiesResponse = await axios.get(VIC_ELECTRICITY_WFS_URL, {
    params: energyFacilitiesParams,
    timeout: 15000,
  });

  console.log(
    "Raw energy facilities response:",
    JSON.stringify(energyFacilitiesResponse.data, null, 2)
  );

  const parsedEnergyFacilitiesResponse =
    getElectricityVicmapResponseSchema().parse(energyFacilitiesResponse.data);

  const energyFacilitiesFeatures = parsedEnergyFacilitiesResponse.features;

  console.log({ energyFacilitiesFeatures }, { depth: null });

  const { inferredElectricityData } = inferRawElectricityData({
    features: energyFacilitiesFeatures,
    propertyLat: lat,
    propertyLon: lon,
  });

  return inferredElectricityData;
};

if (import.meta.main) {
  const energyFacilities = await getNearbyEnergyFacilitiesData({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== NEARBY ENERGY FACILITIES ===");
  console.log(JSON.stringify(energyFacilities, null, 2));

  console.log(`\n✓ Found ${energyFacilities.length} energy facilities`);
}
