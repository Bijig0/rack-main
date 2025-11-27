/**
 * Script to split public_transport_lines.geojson.gz by MODE
 * This creates smaller files that can be loaded on-demand
 * Run with: bun split-by-mode.ts
 */

import fs from "fs";
import path from "path";
import { gunzipSync, gzipSync } from "zlib";

const INPUT_FILE = path.join(__dirname, "public_transport_lines.geojson.gz");
const OUTPUT_DIR = path.join(__dirname, "lines-by-mode");

interface Feature {
  type: "Feature";
  properties: {
    MODE: string;
    SHAPE_ID: string;
    HEADSIGN?: string;
    SHORT_NAME?: string;
    LONG_NAME?: string;
    [key: string]: unknown;
  };
  geometry: unknown;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

async function splitByMode() {
  console.log("Loading public transport lines...");

  const compressedData = fs.readFileSync(INPUT_FILE);
  const rawData = gunzipSync(compressedData).toString("utf-8");
  const data = JSON.parse(rawData) as FeatureCollection;

  console.log(`Total features: ${data.features.length}`);

  // Group features by mode
  const modeMap = new Map<string, Feature[]>();

  for (const feature of data.features) {
    const mode = feature.properties.MODE || "UNKNOWN";
    if (!modeMap.has(mode)) {
      modeMap.set(mode, []);
    }
    modeMap.get(mode)!.push(feature);
  }

  console.log(`\nFound ${modeMap.size} transport modes:`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Also create a mode index with bounding boxes for quick lookup
  const modeIndex: Record<string, {
    featureCount: number;
    bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number };
    filename: string;
  }> = {};

  // Write each mode to a separate file
  for (const [mode, features] of modeMap) {
    const sanitizedName = mode.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const filename = `${sanitizedName}.geojson.gz`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Calculate bounding box for this mode
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

    const modeCollection: FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    const jsonData = JSON.stringify(modeCollection);
    const compressedMode = gzipSync(jsonData);

    fs.writeFileSync(filePath, compressedMode);

    const uncompressedSize = (jsonData.length / 1024 / 1024).toFixed(2);
    const compressedSize = (compressedMode.length / 1024 / 1024).toFixed(2);

    console.log(`  ${mode}: ${features.length} features (${compressedSize}MB compressed, ${uncompressedSize}MB uncompressed)`);

    modeIndex[mode] = {
      featureCount: features.length,
      bbox: { minLat, maxLat, minLon, maxLon },
      filename,
    };
  }

  // Write mode index
  const indexPath = path.join(OUTPUT_DIR, "mode-index.json");
  fs.writeFileSync(indexPath, JSON.stringify(modeIndex, null, 2));
  console.log(`\nMode index written to: ${indexPath}`);

  console.log("\nDone! Mode files created in:", OUTPUT_DIR);
}

function extractCoordinates(geometry: unknown): [number, number][] {
  const coords: [number, number][] = [];

  if (!geometry || typeof geometry !== "object") return coords;

  const geo = geometry as { type: string; coordinates: unknown };

  if (geo.type === "LineString") {
    const lineCoords = geo.coordinates as [number, number][];
    for (const coord of lineCoords) {
      coords.push([coord[0], coord[1]]);
    }
  } else if (geo.type === "MultiLineString") {
    const multiCoords = geo.coordinates as [number, number][][];
    for (const line of multiCoords) {
      for (const coord of line) {
        coords.push([coord[0], coord[1]]);
      }
    }
  }

  return coords;
}

splitByMode().catch(console.error);
