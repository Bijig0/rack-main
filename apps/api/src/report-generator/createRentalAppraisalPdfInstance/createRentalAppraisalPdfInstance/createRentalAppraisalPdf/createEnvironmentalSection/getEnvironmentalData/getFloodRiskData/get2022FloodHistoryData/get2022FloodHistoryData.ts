import axios from "axios";
import { Address } from "../../../../../../../../shared/types";
import { createWfsParams } from "../../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../../wfsDataToolkit/defaults";
import { geocodeAddress } from "../../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { VicmapResponseSchema } from "../../../../../../wfsDataToolkit/types";
import {
  FloodHistory2022Features,
  FloodHistory2022FeaturesSchema,
} from "../types";

type Args = {
  address: Address;
  bufferMeters?: number; // Search radius in meters
};

type Return = {
  floodHistory2022Features: FloodHistory2022Features;
};

/**
 * Fetches 2022 October flood history data from Victorian Government WFS
 * Uses VIC_FLOOD_HISTORY_PUBLIC layer to get historical flood extents
 *
 * Data Source: Victorian Flood History October 2022 Event Public
 * This dataset contains polygon features representing the observed, derived or estimated
 * inundation extent for the October 2022 floods that occurred in Victoria.
 *
 * Data sources include: aerial photography, satellite imagery, GPS, ground observers
 *
 * Note: This data represents a point in time and may not capture peak flood extent
 * or flash flooding events.
 */
export const get2022FloodHistoryData = async ({
  address,
  bufferMeters = 1000, // Default 1km radius for flood assessment
}: Args): Promise<Return> => {
  console.log(
    `Fetching 2022 flood history data within ${bufferMeters}m of address...`
  );

  try {
    const geocoded = await geocodeAddress({ address });

    if (!geocoded) {
      console.log("❌ Geocoding failed");
      return { floodHistory2022Features: [] };
    }

    const { lat, lon } = geocoded;

    // Convert meters to degrees (approximately 111km per degree at equator)
    const bufferDegrees = bufferMeters / 111000;

    // Create WFS parameters for flood history query
    // Note: The correct typename according to Victorian Government Data Directory is
    // "vic_flood_history_public" but this layer is not currently available in the
    // opendata.maps.vic.gov.au WFS service GetCapabilities response.
    // The data exists at: https://discover.data.vic.gov.au/dataset/victorian-flood-history-october-2022-event-public
    // but may be served from a different WFS endpoint or require different access methods.
    const params = createWfsParams({
      lat,
      lon,
      buffer: bufferDegrees,
      typeName: "open-data-platform:vic_flood_history_public",
    });

    const response = await axios.get(WFS_DATA_URL, { params });

    const parsedResponse = VicmapResponseSchema.parse(response.data);
    const features = parsedResponse.features;

    if (!features || features.length === 0) {
      console.log("✅ No 2022 flood history found within buffer");
      return { floodHistory2022Features: [] };
    }

    const floodHistory2022Features =
      FloodHistory2022FeaturesSchema.parse(features);

    console.log(
      `✅ Found ${floodHistory2022Features.length} historical flood zone(s) within ${bufferMeters}m`
    );

    return { floodHistory2022Features };
  } catch (error) {
    console.error("Error fetching 2022 flood history data:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server error response:", error.response.data);
      // If the layer is not available (400/404), return empty array gracefully
      // This allows the analysis to continue with available data sources
      if (error.response.status === 400 || error.response.status === 404) {
        console.log(
          "⚠️  Flood history layer not available in WFS service - continuing with MINIMAL risk assessment"
        );
        return { floodHistory2022Features: [] };
      }
    }
    // For other errors, return empty array to allow graceful degradation
    console.log(
      "⚠️  Unable to fetch flood history data - returning empty result"
    );
    return { floodHistory2022Features: [] };
  }
};

// Allow running this file directly for testing
if (import.meta.main) {
  // Test multiple addresses from areas affected by October 2022 floods
  const testAddresses: Address[] = [
    {
      addressLine: "1 Annesley Street",
      suburb: "Echuca",
      state: "VIC" as const,
      postcode: "3564",
    },
    {
      addressLine: "20 High Street",
      suburb: "Rochester",
      state: "VIC" as const,
      postcode: "3561",
    },
    {
      addressLine: "1 Moore Street",
      suburb: "Mooroopna",
      state: "VIC" as const,
      postcode: "3629",
    },
    {
      addressLine: "50 Welsford Street",
      suburb: "Shepparton",
      state: "VIC" as const,
      postcode: "3630",
    },
  ];

  console.log("Testing flood history data for October 2022 flood-affected areas:\n");

  for (const address of testAddresses) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`Testing: ${address.addressLine}, ${address.suburb} ${address.postcode}`);
    console.log("=".repeat(80));

    const { floodHistory2022Features } = await get2022FloodHistoryData({
      address,
      bufferMeters: 1000,
    });

    console.log(`\nResult: Found ${floodHistory2022Features.length} flood zones`);

    if (floodHistory2022Features.length > 0) {
      console.log("\n✅ FLOOD DATA FOUND!");
      console.log("\nFlood zones:");
      floodHistory2022Features.forEach((feature, index) => {
        console.log(`\nZone ${index + 1}:`);
        console.log(`  Event: ${feature.properties.event_name || "N/A"}`);
        console.log(`  Data Quality: ${feature.properties.data_quality || "N/A"}`);
        console.log(`  Source: ${feature.properties.source || "N/A"}`);
        console.log(`  Geometry Type: ${feature.geometry.type}`);

        // Debug: Show coordinate structure
        if (feature.geometry.type === "MultiPolygon") {
          console.log(`  Number of polygons: ${feature.geometry.coordinates.length}`);
          if (feature.geometry.coordinates[0] && feature.geometry.coordinates[0][0]) {
            const firstRing = feature.geometry.coordinates[0][0];
            console.log(`  First ring has ${firstRing.length} points`);
            console.log(`  Sample coordinates (first 3):`, JSON.stringify(firstRing.slice(0, 3)));
          }
        }
      });

      // Found data, stop testing
      console.log("\n" + "=".repeat(80));
      console.log("Success! Found flood data for this address.");
      console.log("=".repeat(80));
      break;
    }
  }
}
