import axios from "axios";
import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../wfsDataToolkit/types";
import { RoadFeatures, RoadFeaturesSchema } from "./types";

type Args = {
  address: Address;
  bufferMeters?: number; // Search radius in meters
};

type Return = {
  roadFeatures: RoadFeatures;
};

const ROAD_WFS_URL = "https://opendata.maps.vic.gov.au/geoserver/wfs";

/**
 * Fetches nearby road data from Vicmap Transport using WFS
 * Uses TR_ROAD layer to get road information within a specified buffer
 */
export const getRoadData = async ({
  address,
  bufferMeters = 500, // Default 500m radius
}: Args): Promise<Return> => {
  console.log(`Fetching road data within ${bufferMeters}m of address...`);

  try {
    const geocoded = await geocodeAddress({ address });

    if (!geocoded) {
      console.log("❌ Geocoding failed");
      return { roadFeatures: [] };
    }

    const { lat, lon } = geocoded;

    // Convert meters to degrees (approximately 111km per degree at equator)
    const bufferDegrees = bufferMeters / 111000;

    // Create WFS parameters manually for Vicmap Transport service
    const params = {
      SERVICE: "WFS",
      VERSION: "2.0.0",
      REQUEST: "GetFeature",
      OUTPUTFORMAT: "application/json",
      typeName: "datavic:TR_ROAD",
      BBOX: `${lon - bufferDegrees},${lat - bufferDegrees},${
        lon + bufferDegrees
      },${lat + bufferDegrees},EPSG:4326`,
    };

    const response = await axios.get(ROAD_WFS_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("✅ No roads found within buffer");
      return { roadFeatures: [] };
    }

    const roadFeatures = RoadFeaturesSchema.parse(features);

    console.log(`✅ Found ${roadFeatures.length} road(s) within ${bufferMeters}m`);

    return { roadFeatures };
  } catch (error) {
    console.error("Error fetching road data:", error);
    return { roadFeatures: [] };
  }
};

if (import.meta.main) {
  const { roadFeatures } = await getRoadData({
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
    console.log(`- ${road.properties.road_name || "Unnamed"} (${road.properties.road_type || "Unknown type"})`);
  });
}
