import type { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { getPool } from "../../../../../../db/pool";
import {
  ConnectionType,
  InferredSewagePipeline,
  SewageData,
} from "./types";

type Args = {
  address: Address;
  radiusKm?: number; // Default to 5km for main sewage pipelines
};

type Return = SewageData;

interface PipelineRow {
  mxunitid: string;
  sewer_name: string;
  unittype: string;
  unittype_desc: string;
  material: string | null;
  pipe_width: number | null;
  pipe_length: number | null;
  service_status: string | null;
  date_of_construction: Date | null;
  distance_meters: number;
  closest_lat: number;
  closest_lon: number;
}

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
 * Queries PostGIS database to find nearby sewerage infrastructure
 */
export const getSewageData = async ({
  address,
  radiusKm = 5,
}: Args): Promise<Return> => {
  // Geocode the address
  const { lat, lon } = await geocodeAddress({ address });

  // Get database connection
  const pool = getPool();

  // Query PostGIS for nearby pipelines
  // Using ST_DWithin with geography type for accurate distance in meters
  // Converting radiusKm to meters for the query
  const radiusMeters = radiusKm * 1000;

  const query = `
    SELECT
      mxunitid,
      sewer_name,
      unittype,
      unittype_desc,
      material,
      pipe_width,
      pipe_length,
      service_status,
      date_of_construction,
      ST_Distance(
        geom::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) as distance_meters,
      ST_Y(
        ST_ClosestPoint(
          geom,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)
        )
      ) as closest_lat,
      ST_X(
        ST_ClosestPoint(
          geom,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)
        )
      ) as closest_lon
    FROM sewerage_pipelines
    WHERE ST_DWithin(
      geom::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )
    ORDER BY distance_meters ASC
  `;

  const result = await pool.query<PipelineRow>(query, [lon, lat, radiusMeters]);

  // Convert database rows to InferredSewagePipeline format
  const nearbySewagePipelines: InferredSewagePipeline[] = result.rows.map((row) => ({
    pipelineId: row.mxunitid,
    sewerName: row.sewer_name,
    unitType: row.unittype,
    unitTypeDescription: row.unittype_desc,
    material: row.material,
    pipeWidth: row.pipe_width,
    pipeLength: {
      measurement: row.pipe_length,
      unit: "m",
    },
    serviceStatus: row.service_status,
    dateOfConstruction: row.date_of_construction?.toISOString(),
    distance: {
      measurement: row.distance_meters / 1000, // Convert to km
      unit: "km",
    },
    closestPoint: {
      lat: row.closest_lat,
      lon: row.closest_lon,
    },
  }));

  // Get nearest pipeline
  const nearestPipeline = nearbySewagePipelines[0];

  // Distance is already in meters from the query
  const distanceToNearestPipeline = nearestPipeline
    ? result.rows[0].distance_meters
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
