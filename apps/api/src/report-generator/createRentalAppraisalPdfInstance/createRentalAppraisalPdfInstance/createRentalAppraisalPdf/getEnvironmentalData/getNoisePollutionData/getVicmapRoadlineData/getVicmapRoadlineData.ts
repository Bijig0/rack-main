import axios from "axios";
import { Address } from "../../../../../../../shared/types";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../wfsDataToolkit/types";
import { RoadFeatures, RoadFeaturesSchema } from "../types";

type Args = {
  address: Address;
  bufferMeters?: number; // Search radius in meters
};

type Return = {
  roadFeatures: RoadFeatures;
};

/**
 * Fetches nearby road data from Vicmap Transport using WFS
 * Uses open-data-platform:tr_road layer to get road information within a specified buffer
 */
export const getVicmapRoadlineData = async ({
  address,
  bufferMeters = 500, // Default 500m radius
}: Args): Promise<Return> => {
  console.log(`Fetching Vicmap road data within ${bufferMeters}m of address...`);

  try {
    const geocoded = await geocodeAddress({ address });

    if (!geocoded) {
      console.log("❌ Geocoding failed");
      return { roadFeatures: [] };
    }

    const { lat, lon } = geocoded;

    // Convert meters to degrees (approximately 111km per degree at equator)
    const bufferDegrees = bufferMeters / 111000;

    // Create WFS parameters using the standard toolkit
    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:tr_road",
    });

    const response = await axios.get(WFS_DATA_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("✅ No Vicmap roads found within buffer");
      return { roadFeatures: [] };
    }

    const roadFeatures = RoadFeaturesSchema.parse(features);

    console.log(
      `✅ Found ${roadFeatures.length} Vicmap road(s) within ${bufferMeters}m`
    );

    return { roadFeatures };
  } catch (error) {
    console.error("Error fetching Vicmap road data:", error);
    return { roadFeatures: [] };
  }
};

if (import.meta.main) {
  const { roadFeatures } = await getVicmapRoadlineData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
    bufferMeters: 300,
  });

  console.log(`\nFound ${roadFeatures.length} roads:`);
  roadFeatures.forEach((road) => {
    console.log(
      `- ${road.properties.road_name || "Unnamed"} (${
        road.properties.road_type || "Unknown type"
      })`
    );
  });
}
