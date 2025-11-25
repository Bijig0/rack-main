import { z } from "zod";

/**
 * OpenStreetMap Overpass API endpoint
 */
const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

/**
 * OSM element properties schema
 */
const OSMTagsSchema = z.record(z.string(), z.string()).optional();

const OSMNodeSchema = z.object({
  type: z.literal("node"),
  id: z.number(),
  lat: z.number(),
  lon: z.number(),
  tags: OSMTagsSchema,
});

const OSMWaySchema = z.object({
  type: z.literal("way"),
  id: z.number(),
  nodes: z.array(z.number()).optional(),
  geometry: z
    .array(
      z.object({
        lat: z.number(),
        lon: z.number(),
      })
    )
    .optional(),
  tags: OSMTagsSchema,
});

const OSMElementSchema = z.union([OSMNodeSchema, OSMWaySchema]);

const OSMResponseSchema = z.object({
  version: z.number(),
  generator: z.string(),
  elements: z.array(OSMElementSchema),
});

type OSMResponse = z.infer<typeof OSMResponseSchema>;

type Args = {
  lon: number;
  lat: number;
  bufferMeters?: number;
};

type Return = {
  hydrants: OSMResponse | null;
  waterFeatures: OSMResponse | null;
};

/**
 * Converts a buffer in meters to degrees (approximate)
 */
const metersToDegrees = (meters: number): number => {
  return meters / 111000;
};

/**
 * Queries OpenStreetMap Overpass API for water infrastructure data
 *
 * @param lon - Longitude of the point
 * @param lat - Latitude of the point
 * @param bufferMeters - Buffer radius in meters (default: 500m)
 * @returns Water infrastructure data from OpenStreetMap
 *
 * @example
 * ```typescript
 * const data = await queryOSMWater({
 *   lon: 145.0352,
 *   lat: -37.8136,
 *   bufferMeters: 500
 * });
 * console.log(`Found ${data.hydrants?.elements.length || 0} hydrants`);
 * ```
 */
export const queryOSMWater = async ({
  lon,
  lat,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  const buffer = metersToDegrees(bufferMeters);

  const south = lat - buffer;
  const west = lon - buffer;
  const north = lat + buffer;
  const east = lon + buffer;

  try {
    // Query 1: Fire hydrants
    const hydrantQuery = `
      [out:json][timeout:25];
      (
        node["emergency"="fire_hydrant"](${south},${west},${north},${east});
        node["emergency"="water_hydrant"](${south},${west},${north},${east});
      );
      out body;
    `;

    const hydrantResponse = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(hydrantQuery)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    let hydrants: OSMResponse | null = null;

    if (hydrantResponse.ok) {
      try {
        const hydrantData = await hydrantResponse.json();
        hydrants = OSMResponseSchema.parse(hydrantData);
      } catch (error) {
        console.warn("Failed to parse OSM hydrant data:", error);
      }
    } else {
      console.warn(
        `OSM hydrant request failed: ${hydrantResponse.status} ${hydrantResponse.statusText}`
      );
    }

    // Query 2: Water-related features (pipes, towers, etc.)
    const waterQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="drinking_water"](${south},${west},${north},${east});
        way["man_made"="pipeline"]["substance"="water"](${south},${west},${north},${east});
        node["man_made"="water_tower"](${south},${west},${north},${east});
        node["man_made"="water_well"](${south},${west},${north},${east});
      );
      out body;
      >;
      out skel qt;
    `;

    const waterResponse = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(waterQuery)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    let waterFeatures: OSMResponse | null = null;

    if (waterResponse.ok) {
      try {
        const waterData = await waterResponse.json();
        waterFeatures = OSMResponseSchema.parse(waterData);
      } catch (error) {
        console.warn("Failed to parse OSM water features data:", error);
      }
    } else {
      console.warn(
        `OSM water features request failed: ${waterResponse.status} ${waterResponse.statusText}`
      );
    }

    return { hydrants, waterFeatures };
  } catch (error) {
    console.error("Error querying OpenStreetMap Overpass API:", error);
    return { hydrants: null, waterFeatures: null };
  }
};

if (import.meta.main) {
  console.log("\n=== OPENSTREETMAP WATER QUERY TEST ===\n");

  // Test location: Kew
  const testLon = 145.0352;
  const testLat = -37.8136;

  console.log(
    `Querying OpenStreetMap for coordinates: ${testLat}, ${testLon}`
  );
  console.log("Buffer: 500 meters\n");

  const result = await queryOSMWater({
    lon: testLon,
    lat: testLat,
    bufferMeters: 500,
  });

  console.log("=== RESULTS ===\n");

  console.log(`Hydrants Found: ${result.hydrants?.elements.length || 0}`);
  if (result.hydrants && result.hydrants.elements.length > 0) {
    console.log("\nSample Hydrant:");
    const hydrant = result.hydrants.elements[0];
    if (hydrant.type === "node") {
      console.log(`  ID: ${hydrant.id}`);
      console.log(`  Location: ${hydrant.lat}, ${hydrant.lon}`);
      console.log(`  Tags: ${JSON.stringify(hydrant.tags || {}, null, 2)}`);
    }
  }

  console.log(
    `\nWater Features Found: ${result.waterFeatures?.elements.length || 0}`
  );
  if (result.waterFeatures && result.waterFeatures.elements.length > 0) {
    console.log("\nSample Water Feature:");
    const feature = result.waterFeatures.elements[0];
    console.log(`  Type: ${feature.type}`);
    console.log(`  ID: ${feature.id}`);
    console.log(`  Tags: ${JSON.stringify(feature.tags || {}, null, 2)}`);
  }
}
