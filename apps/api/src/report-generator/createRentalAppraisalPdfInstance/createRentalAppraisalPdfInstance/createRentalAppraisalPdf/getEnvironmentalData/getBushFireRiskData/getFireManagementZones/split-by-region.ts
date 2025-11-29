/**
 * Script to split fire_management_zones.geojson.gz by REGION_NAME
 * This creates smaller regional files that can be loaded on-demand
 * Run with: bun split-by-region.ts
 */

import fs from "fs";
import path from "path";
import { gunzipSync, gzipSync } from "zlib";

const INPUT_FILE = path.join(__dirname, "fire_management_zones.geojson.gz");
const OUTPUT_DIR = path.join(__dirname, "regions");

interface Feature {
  type: "Feature";
  properties: {
    REGION_NAME: string;
    DISTRICT_NAME: string;
    ZONETYPE: string;
    X_ZONETYPE: string;
    [key: string]: unknown;
  };
  geometry: unknown;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

async function splitByRegion() {
  console.log("Loading fire management zones...");

  const compressedData = fs.readFileSync(INPUT_FILE);
  const rawData = gunzipSync(compressedData).toString("utf-8");
  const data = JSON.parse(rawData) as FeatureCollection;

  console.log(`Total features: ${data.features.length}`);

  // Group features by region
  const regionMap = new Map<string, Feature[]>();

  for (const feature of data.features) {
    const regionName = feature.properties.REGION_NAME || "UNKNOWN";
    if (!regionMap.has(regionName)) {
      regionMap.set(regionName, []);
    }
    regionMap.get(regionName)!.push(feature);
  }

  console.log(`\nFound ${regionMap.size} regions:`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Also create a region index with bounding boxes for quick lookup
  const regionIndex: Record<string, {
    featureCount: number;
    bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number };
    filename: string;
  }> = {};

  // Write each region to a separate file
  for (const [regionName, features] of regionMap) {
    const sanitizedName = regionName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const filename = `${sanitizedName}.geojson.gz`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Calculate bounding box for this region
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    for (const feature of features) {
      const coords = extractCoordinates(feature.geometry);
      for (const [lon, lat] of coords) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
      }
    }

    const regionCollection: FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    const jsonData = JSON.stringify(regionCollection);
    const compressedRegion = gzipSync(jsonData);

    fs.writeFileSync(filePath, compressedRegion);

    const uncompressedSize = (jsonData.length / 1024 / 1024).toFixed(2);
    const compressedSize = (compressedRegion.length / 1024 / 1024).toFixed(2);

    console.log(`  ${regionName}: ${features.length} features (${compressedSize}MB compressed, ${uncompressedSize}MB uncompressed)`);

    regionIndex[regionName] = {
      featureCount: features.length,
      bbox: { minLat, maxLat, minLon, maxLon },
      filename,
    };
  }

  // Write region index
  const indexPath = path.join(OUTPUT_DIR, "region-index.json");
  fs.writeFileSync(indexPath, JSON.stringify(regionIndex, null, 2));
  console.log(`\nRegion index written to: ${indexPath}`);

  console.log("\nDone! Regional files created in:", OUTPUT_DIR);
}

function extractCoordinates(geometry: unknown): [number, number][] {
  const coords: [number, number][] = [];

  if (!geometry || typeof geometry !== "object") return coords;

  const geo = geometry as { type: string; coordinates: unknown };

  if (geo.type === "Polygon") {
    const polygonCoords = geo.coordinates as [number, number][][];
    for (const ring of polygonCoords) {
      for (const coord of ring) {
        coords.push([coord[0], coord[1]]);
      }
    }
  } else if (geo.type === "MultiPolygon") {
    const multiCoords = geo.coordinates as [number, number][][][];
    for (const polygon of multiCoords) {
      for (const ring of polygon) {
        for (const coord of ring) {
          coords.push([coord[0], coord[1]]);
        }
      }
    }
  }

  return coords;
}

splitByRegion().catch(console.error);
