import { z } from "zod";

/**
 * Melbourne Water ArcGIS REST API endpoints
 * Source: https://data-melbournewater.opendata.arcgis.com/
 */
const MELBOURNE_WATER_ENDPOINTS = {
  WATER_MAINS:
    "https://services5.arcgis.com/ZSYwjtv8RKVhkXIL/arcgis/rest/services/Water_Supply_Main_Pipelines/FeatureServer/0/query",
} as const;

/**
 * Melbourne Water pipe properties schema
 */
const MelbourneWaterPipePropertiesSchema = z.object({
  OBJECTID: z.number().optional(),
  PIPE_ID: z.string().optional(),
  PIPE_DIAMETER: z.number().optional(), // mm
  PIPE_MATERIAL: z.string().optional(),
  PIPE_TYPE: z.string().optional(),
  STATUS: z.string().optional(),
  INSTALLATION_DATE: z.string().nullable().optional(),
  OWNER: z.string().optional(),
  PRESSURE_ZONE: z.string().nullable().optional(),
  LENGTH_M: z.number().optional(),
});

const CoordinateSchema = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]);

const GeometrySchema = z.union([
  z.object({
    type: z.literal("LineString"),
    coordinates: z.array(CoordinateSchema),
  }),
  z.object({
    type: z.literal("MultiLineString"),
    coordinates: z.array(z.array(CoordinateSchema)),
  }),
]);

const MelbourneWaterFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.union([z.string(), z.number()]).optional(),
  properties: MelbourneWaterPipePropertiesSchema,
  geometry: GeometrySchema,
});

const MelbourneWaterFeatureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(MelbourneWaterFeatureSchema),
});

type MelbourneWaterFeatureCollection = z.infer<
  typeof MelbourneWaterFeatureCollectionSchema
>;

type Args = {
  lon: number;
  lat: number;
  bufferMeters?: number;
};

type Return = {
  waterMains: MelbourneWaterFeatureCollection | null;
};

/**
 * Converts a buffer in meters to degrees (approximate)
 * At Melbourne's latitude (~37.8°), 1 degree ≈ 111km
 * So 1 meter ≈ 0.000009 degrees
 */
const metersToDegrees = (meters: number): number => {
  return meters / 111000;
};

/**
 * Queries Melbourne Water ArcGIS REST API for water infrastructure data
 *
 * @param lon - Longitude of the point
 * @param lat - Latitude of the point
 * @param bufferMeters - Buffer radius in meters (default: 500m)
 * @returns Water infrastructure data from Melbourne Water
 *
 * @example
 * ```typescript
 * const data = await queryMelbourneWater({
 *   lon: 145.0352,
 *   lat: -37.8136,
 *   bufferMeters: 500
 * });
 * console.log(`Found ${data.waterMains?.features.length || 0} water mains`);
 * ```
 */
export const queryMelbourneWater = async ({
  lon,
  lat,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  const buffer = metersToDegrees(bufferMeters);

  try {
    // Build geometry for spatial query
    const geometry = JSON.stringify({
      xmin: lon - buffer,
      ymin: lat - buffer,
      xmax: lon + buffer,
      ymax: lat + buffer,
      spatialReference: { wkid: 4326 },
    });

    const params = new URLSearchParams({
      where: "1=1",
      geometry,
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      returnGeometry: "true",
      f: "geojson",
    });

    const url = `${MELBOURNE_WATER_ENDPOINTS.WATER_MAINS}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(
        `Melbourne Water API request failed: ${response.status} ${response.statusText}`
      );
      return { waterMains: null };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.warn(
        `Melbourne Water returned non-JSON content-type: ${contentType}`,
        text.substring(0, 200)
      );
      return { waterMains: null };
    }

    const data = await response.json();

    // Validate response
    const waterMains = MelbourneWaterFeatureCollectionSchema.parse(data);

    return { waterMains };
  } catch (error) {
    console.error("Error querying Melbourne Water API:", error);
    return { waterMains: null };
  }
};

if (import.meta.main) {
  console.log("\n=== MELBOURNE WATER QUERY TEST ===\n");

  // Test location: Kew (Melbourne Water service area)
  const testLon = 145.0352;
  const testLat = -37.8136;

  console.log(`Querying Melbourne Water for coordinates: ${testLat}, ${testLon}`);
  console.log("Buffer: 500 meters\n");

  const result = await queryMelbourneWater({
    lon: testLon,
    lat: testLat,
    bufferMeters: 500,
  });

  console.log("=== RESULTS ===\n");

  if (result.waterMains && result.waterMains.features.length > 0) {
    console.log(`Water Mains Found: ${result.waterMains.features.length}`);
    console.log("\nSample Water Main:");
    const main = result.waterMains.features[0];
    console.log(`  Pipe ID: ${main.properties.PIPE_ID || "N/A"}`);
    console.log(`  Diameter: ${main.properties.PIPE_DIAMETER || "N/A"}mm`);
    console.log(`  Material: ${main.properties.PIPE_MATERIAL || "N/A"}`);
    console.log(`  Type: ${main.properties.PIPE_TYPE || "N/A"}`);
    console.log(`  Status: ${main.properties.STATUS || "N/A"}`);
    console.log(`  Owner: ${main.properties.OWNER || "N/A"}`);
  } else {
    console.log("No water mains found in this area");
    console.log(
      "\nThis may indicate the property is outside Melbourne Water's service area."
    );
    console.log(
      "Consider checking other water authorities (YVW, SEW, City West Water)."
    );
  }
}
