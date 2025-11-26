import fs from "fs";
import path from "path";
import zlib from "zlib";
import type { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import {
  ConnectionType,
  InferredSewagePipeline,
  SewageFeature,
  SewageFeatureCollectionSchema,
  SewageSummary,
} from "./types";

type Args = {
  address: Address;
  radiusKm?: number; // Default to 5km for main sewage pipelines
};

type Return = SewageSummary;

// Haversine formula to calculate distance between two points in km
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Find closest point on a line segment to a given point
const closestPointOnSegment = (
  pointLat: number,
  pointLon: number,
  segmentStart: [number, number],
  segmentEnd: [number, number]
): { lat: number; lon: number; distance: number } => {
  const [lon1, lat1] = segmentStart;
  const [lon2, lat2] = segmentEnd;

  // Calculate the parameter t that represents the position on the line segment
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  const lengthSquared = dx * dx + dy * dy;

  let t = 0;
  if (lengthSquared !== 0) {
    t = ((pointLon - lon1) * dx + (pointLat - lat1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
  }

  // Calculate the closest point
  const closestLon = lon1 + t * dx;
  const closestLat = lat1 + t * dy;

  // Calculate distance
  const distance = calculateDistance(
    pointLat,
    pointLon,
    closestLat,
    closestLon
  );

  return {
    lat: closestLat,
    lon: closestLon,
    distance,
  };
};

// Find closest point on a linestring to a given point
const closestPointOnLineString = (
  pointLat: number,
  pointLon: number,
  coordinates: Array<[number, number] | [number, number, number]>
): { lat: number; lon: number; distance: number } => {
  let minDistance = Infinity;
  let closestPoint = { lat: 0, lon: 0, distance: Infinity };

  // Check each segment of the linestring
  for (let i = 0; i < coordinates.length - 1; i++) {
    // Extract first 2 elements (lon, lat) from each coordinate
    const coord1: [number, number] = [coordinates[i][0], coordinates[i][1]];
    const coord2: [number, number] = [
      coordinates[i + 1][0],
      coordinates[i + 1][1],
    ];

    const result = closestPointOnSegment(pointLat, pointLon, coord1, coord2);

    if (result.distance < minDistance) {
      minDistance = result.distance;
      closestPoint = result;
    }
  }

  return closestPoint;
};

// Process a sewage feature
const processSewageFeature = (
  feature: SewageFeature,
  propertyLat: number,
  propertyLon: number
): InferredSewagePipeline => {
  const { properties, geometry } = feature;

  // Find closest point on the pipeline to the property
  let closestPoint: { lat: number; lon: number; distance: number };

  if (geometry.type === "LineString") {
    closestPoint = closestPointOnLineString(
      propertyLat,
      propertyLon,
      geometry.coordinates
    );
  } else {
    // MultiLineString: find closest point across all line strings
    let minDistance = Infinity;
    closestPoint = { lat: 0, lon: 0, distance: Infinity };

    for (const lineString of geometry.coordinates) {
      const result = closestPointOnLineString(
        propertyLat,
        propertyLon,
        lineString as unknown as Array<
          [number, number] | [number, number, number]
        >
      );

      if (result.distance < minDistance) {
        minDistance = result.distance;
        closestPoint = result;
      }
    }
  }

  return {
    pipelineId: properties.MXUNITID,
    sewerName: properties.SEWER_NAME,
    unitType: properties.UNITTYPE,
    unitTypeDescription: properties.UNITTYPE_DESC,
    material: properties.MATERIAL,
    pipeWidth: properties.PIPE_WIDTH,
    pipeLength: {
      measurement: properties.PIPE_LENGTH,
      unit: "m",
    },
    serviceStatus: properties.SERVICE_STATUS,
    dateOfConstruction: properties.DATE_OF_CONSTRUCTION || undefined,
    distance: {
      measurement: closestPoint.distance,
      unit: "km",
    },
    closestPoint: {
      lat: closestPoint.lat,
      lon: closestPoint.lon,
    },
  };
};

/**
 * Determine connection type based on distance and pipeline status
 */
const determineConnectionType = (
  distanceMeters: number,
  pipelineStatus: string | null
): ConnectionType => {
  const isActive =
    pipelineStatus?.toLowerCase() === "in" ||
    pipelineStatus?.toLowerCase() === "active";

  // Direct connection: within 50m of active pipeline
  if (distanceMeters <= 50 && isActive) return "direct";

  // Likely septic: far from sewerage infrastructure
  if (distanceMeters > 200) return "septic";

  // Unknown: in between (50-200m) - could be either
  return "unknown";
};

/**
 * Calculate confidence score for sewage connection assessment
 * Returns a score from 0-100 based on multiple factors
 */
const calculateConfidence = (
  distanceMeters: number,
  pipelineStatus: string | null,
  pipeWidth: number | null,
  nearbyPipelineCount: number
): number => {
  let confidence = 50; // baseline

  // Distance factor (0-40 points)
  if (distanceMeters <= 25) confidence += 40;
  else if (distanceMeters <= 50) confidence += 30;
  else if (distanceMeters <= 100) confidence += 20;
  else if (distanceMeters <= 200) confidence += 10;
  else confidence -= 20;

  // Pipeline status (0-25 points)
  if (
    pipelineStatus?.toLowerCase() === "in" ||
    pipelineStatus?.toLowerCase() === "active"
  ) {
    confidence += 25;
  } else {
    confidence -= 15;
  }

  // Infrastructure density (0-15 points)
  if (nearbyPipelineCount >= 5) confidence += 15;
  else if (nearbyPipelineCount >= 3) confidence += 10;
  else if (nearbyPipelineCount >= 1) confidence += 5;

  // Pipeline capacity (0-10 points)
  if (pipeWidth && pipeWidth >= 300) confidence += 10;
  else if (pipeWidth && pipeWidth >= 150) confidence += 5;

  // Clamp to 0-100
  return Math.max(0, Math.min(100, confidence));
};

/**
 * Get sewage pipeline data for a property
 * Reads from local GeoJSON file and finds nearby sewerage infrastructure
 */
export const getSewageData = async ({
  address,
  radiusKm = 5,
}: Args): Promise<Return> => {
  // Geocode the address
  const { lat, lon } = await geocodeAddress({ address });

  // Load and parse the GeoJSON file (gzipped)
  const geoJsonPath = path.join(
    __dirname,
    "Sewerage_Network_Main_Pipelines.geojson.gz"
  );

  // Read the gzipped file and decompress it
  const compressedData = fs.readFileSync(geoJsonPath);
  const rawData = zlib.gunzipSync(compressedData).toString("utf-8");
  const parsedData = JSON.parse(rawData);

  // Validate with Zod schema
  const featureCollection = SewageFeatureCollectionSchema.parse(parsedData);

  // Process all features and calculate distances
  const allPipelines = featureCollection.features.map((feature) =>
    processSewageFeature(feature, lat, lon)
  );

  // Filter pipelines within radius
  const nearbySewagePipelines = allPipelines.filter(
    (pipeline) => (pipeline.distance?.measurement || Infinity) <= radiusKm
  );

  // Sort by distance (closest first)
  nearbySewagePipelines.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  // Get nearest pipeline
  const nearestPipeline = nearbySewagePipelines[0];

  // Convert distance from km to meters
  const distanceToNearestPipeline = nearestPipeline?.distance?.measurement
    ? nearestPipeline.distance.measurement * 1000
    : undefined;

  // Determine connection type
  const connectionType =
    nearestPipeline && distanceToNearestPipeline
      ? determineConnectionType(
          distanceToNearestPipeline,
          nearestPipeline.serviceStatus
        )
      : "unknown";

  // Determine if connected (direct connection)
  const isConnected = connectionType === "direct";

  // Calculate confidence score
  const confidence =
    nearestPipeline && distanceToNearestPipeline
      ? calculateConfidence(
          distanceToNearestPipeline,
          nearestPipeline.serviceStatus,
          nearestPipeline.pipeWidth,
          nearbySewagePipelines.length
        )
      : 0;

  return {
    isConnected,
    connectionType,
    nearestPipeline,
    distanceToNearestPipeline,
    confidence,
  };
};

if (import.meta.main) {
  const result = await getSewageData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
    radiusKm: 2, // 2km radius to capture nearby main pipelines
  });

  console.log("\n=== SEWAGE SUMMARY ===");
  console.log(`Connection Status: ${result.isConnected ? "Connected" : "Not Connected"}`);
  console.log(`Connection Type: ${result.connectionType}`);
  console.log(`Confidence Score: ${result.confidence}/100`);

  if (result.nearestPipeline && result.distanceToNearestPipeline !== undefined) {
    console.log("\nNearest Pipeline:");
    console.log(`  Name: ${result.nearestPipeline.sewerName}`);
    console.log(`  Type: ${result.nearestPipeline.unitTypeDescription}`);
    console.log(`  Material: ${result.nearestPipeline.material || "Unknown"}`);
    console.log(`  Pipe Width: ${result.nearestPipeline.pipeWidth || "Unknown"}mm`);
    console.log(`  Distance: ${result.distanceToNearestPipeline.toFixed(0)}m`);
    console.log(`  Status: ${result.nearestPipeline.serviceStatus || "Unknown"}`);
  } else {
    console.log("\nNo nearby sewage infrastructure found");
  }
}
