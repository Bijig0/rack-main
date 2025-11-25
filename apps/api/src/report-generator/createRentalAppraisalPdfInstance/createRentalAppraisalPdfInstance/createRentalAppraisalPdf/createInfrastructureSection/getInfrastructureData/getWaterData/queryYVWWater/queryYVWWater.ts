import {
  YVWWaterPipeFeatureCollectionSchema,
  YVWHydrantFeatureCollectionSchema,
  YVWDistributionZoneFeatureCollectionSchema,
  type YVWWaterPipeFeatureCollection,
  type YVWHydrantFeatureCollection,
  type YVWDistributionZoneFeatureCollection,
} from "../types";

/**
 * Yarra Valley Water WFS endpoint
 */
const YVW_WFS_ENDPOINT = "https://webmap.yvw.com.au/YVWAssets/service.svc/get";

/**
 * TypeNames for different YVW layers
 */
const YVW_TYPENAMES = {
  WATER_PIPES: "yvw:WATERPIPES",
  WATER_HYDRANTS: "yvw:WATERHYDRANTS",
  WATER_DISTRIBUTION_ZONES: "yvw:WDZ_SHAPES",
  WATER_STORAGES: "yvw:WATERSTORAGES",
} as const;

type Args = {
  lon: number;
  lat: number;
  bufferMeters?: number;
};

type Return = {
  waterPipes: YVWWaterPipeFeatureCollection | null;
  hydrants: YVWHydrantFeatureCollection | null;
  distributionZones: YVWDistributionZoneFeatureCollection | null;
};

/**
 * Converts a buffer in meters to degrees (approximate)
 * At Melbourne's latitude (~37.8°), 1 degree ≈ 111km
 * So 1 meter ≈ 0.000009 degrees
 *
 * @param meters - Buffer distance in meters
 * @returns Buffer distance in degrees
 */
const metersToDegrees = (meters: number): number => {
  return meters / 111000; // Approximate conversion
};

/**
 * Creates WFS parameters for YVW queries
 *
 * @param lon - Longitude
 * @param lat - Latitude
 * @param typeName - WFS layer type name
 * @param buffer - Buffer in degrees
 * @returns URL search parameters
 */
const createYVWParams = (
  lon: number,
  lat: number,
  typeName: string,
  buffer: number
): URLSearchParams => {
  const params = new URLSearchParams({
    SERVICE: "WFS",
    VERSION: "2.0.0",
    REQUEST: "GetFeature",
    OUTPUTFORMAT: "application/json",
    typeName,
    BBOX: `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer},EPSG:4326`,
  });

  return params;
};

/**
 * Queries Yarra Valley Water WFS endpoint for water infrastructure data
 *
 * @param lon - Longitude of the point
 * @param lat - Latitude of the point
 * @param bufferMeters - Buffer radius in meters (default: 500m)
 * @returns Water infrastructure data from YVW
 *
 * @example
 * ```typescript
 * const data = await queryYVWWater({
 *   lon: 145.0352,
 *   lat: -37.8136,
 *   bufferMeters: 500
 * });
 * console.log(`Found ${data.waterPipes?.features.length || 0} water pipes`);
 * ```
 */
export const queryYVWWater = async ({
  lon,
  lat,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  const buffer = metersToDegrees(bufferMeters);

  try {
    // Query water pipes
    const pipesParams = createYVWParams(
      lon,
      lat,
      YVW_TYPENAMES.WATER_PIPES,
      buffer
    );
    const pipesUrl = `${YVW_WFS_ENDPOINT}?${pipesParams.toString()}`;

    const pipesResponse = await fetch(pipesUrl);
    let waterPipes: YVWWaterPipeFeatureCollection | null = null;

    if (pipesResponse.ok) {
      try {
        const contentType = pipesResponse.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await pipesResponse.text();
          console.warn(
            `YVW water pipes returned non-JSON content-type: ${contentType}`,
            text.substring(0, 200)
          );
        } else {
          const pipesData = await pipesResponse.json();
          waterPipes = YVWWaterPipeFeatureCollectionSchema.parse(pipesData);
        }
      } catch (error) {
        console.warn("Failed to parse YVW water pipes data:", error);
        // The API might be blocked or returning non-JSON data
      }
    } else {
      console.warn(
        `YVW water pipes request failed: ${pipesResponse.status} ${pipesResponse.statusText}`
      );
    }

    // Query hydrants
    const hydrantsParams = createYVWParams(
      lon,
      lat,
      YVW_TYPENAMES.WATER_HYDRANTS,
      buffer
    );
    const hydrantsUrl = `${YVW_WFS_ENDPOINT}?${hydrantsParams.toString()}`;

    const hydrantsResponse = await fetch(hydrantsUrl);
    let hydrants: YVWHydrantFeatureCollection | null = null;

    if (hydrantsResponse.ok) {
      try {
        const contentType = hydrantsResponse.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await hydrantsResponse.text();
          console.warn(
            `YVW hydrants returned non-JSON content-type: ${contentType}`,
            text.substring(0, 200)
          );
        } else {
          const hydrantsData = await hydrantsResponse.json();
          hydrants = YVWHydrantFeatureCollectionSchema.parse(hydrantsData);
        }
      } catch (error) {
        console.warn("Failed to parse YVW hydrants data:", error);
        // The API might be blocked or returning non-JSON data
      }
    } else {
      console.warn(
        `YVW hydrants request failed: ${hydrantsResponse.status} ${hydrantsResponse.statusText}`
      );
    }

    // Query distribution zones (smaller buffer for zones)
    const zonesParams = createYVWParams(
      lon,
      lat,
      YVW_TYPENAMES.WATER_DISTRIBUTION_ZONES,
      buffer * 2 // Larger buffer for zones
    );
    const zonesUrl = `${YVW_WFS_ENDPOINT}?${zonesParams.toString()}`;

    const zonesResponse = await fetch(zonesUrl);
    let distributionZones: YVWDistributionZoneFeatureCollection | null = null;

    if (zonesResponse.ok) {
      try {
        const contentType = zonesResponse.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await zonesResponse.text();
          console.warn(
            `YVW distribution zones returned non-JSON content-type: ${contentType}`,
            text.substring(0, 200)
          );
        } else {
          const zonesData = await zonesResponse.json();
          distributionZones =
            YVWDistributionZoneFeatureCollectionSchema.parse(zonesData);
        }
      } catch (error) {
        console.warn("Failed to parse YVW distribution zones data:", error);
        // The API might be blocked or returning non-JSON data
      }
    } else {
      console.warn(
        `YVW distribution zones request failed: ${zonesResponse.status} ${zonesResponse.statusText}`
      );
    }

    return {
      waterPipes,
      hydrants,
      distributionZones,
    };
  } catch (error) {
    console.error("Error querying YVW WFS endpoint:", error);
    return {
      waterPipes: null,
      hydrants: null,
      distributionZones: null,
    };
  }
};

if (import.meta.main) {
  console.log("\n=== YVW WATER QUERY TEST ===\n");

  // Test location: Kew (known YVW service area)
  const testLon = 145.0352;
  const testLat = -37.8136;

  console.log(`Querying YVW data for coordinates: ${testLat}, ${testLon}`);
  console.log("Buffer: 500 meters\n");

  const result = await queryYVWWater({
    lon: testLon,
    lat: testLat,
    bufferMeters: 500,
  });

  console.log("=== RESULTS ===\n");

  console.log(
    `Water Pipes Found: ${result.waterPipes?.features.length || 0}`
  );
  if (result.waterPipes && result.waterPipes.features.length > 0) {
    console.log("\nSample Water Pipe:");
    const pipe = result.waterPipes.features[0];
    console.log(`  Asset ID: ${pipe.properties.ASSET_ID || "N/A"}`);
    console.log(`  Diameter: ${pipe.properties.PIPE_DIAMETER || "N/A"}mm`);
    console.log(`  Material: ${pipe.properties.PIPE_MATERIAL || "N/A"}`);
    console.log(`  Status: ${pipe.properties.SERVICE_STATUS || "N/A"}`);
  }

  console.log(
    `\nHydrants Found: ${result.hydrants?.features.length || 0}`
  );
  if (result.hydrants && result.hydrants.features.length > 0) {
    console.log("\nSample Hydrant:");
    const hydrant = result.hydrants.features[0];
    console.log(`  Asset ID: ${hydrant.properties.MXASSETNUM || "N/A"}`);
    console.log(`  Type: ${hydrant.properties.HYDRANT_TYPE || "N/A"}`);
    console.log(`  Status: ${hydrant.properties.SERVICE_STATUS || "N/A"}`);
  }

  console.log(
    `\nDistribution Zones Found: ${result.distributionZones?.features.length || 0}`
  );
  if (result.distributionZones && result.distributionZones.features.length > 0) {
    console.log("\nSample Distribution Zone:");
    const zone = result.distributionZones.features[0];
    console.log(`  Zone ID: ${zone.properties.ZONE_ID || "N/A"}`);
    console.log(`  Zone Name: ${zone.properties.ZONE_NAME || "N/A"}`);
    console.log(`  Pressure Zone: ${zone.properties.PRESSURE_ZONE || "N/A"}`);
  }
}
