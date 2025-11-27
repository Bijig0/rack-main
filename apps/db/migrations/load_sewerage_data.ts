#!/usr/bin/env bun

/**
 * Migration script to load sewerage pipeline GeoJSON data into PostGIS
 *
 * This script:
 * 1. Reads the gzipped GeoJSON file
 * 2. Parses and validates the data
 * 3. Converts geometries to PostGIS format
 * 4. Bulk inserts into sewerage_pipelines table
 *
 * Usage: bun run load_sewerage_data.ts [--dry-run]
 */

import fs from "fs";
import zlib from "zlib";
import path from "path";
import pg from "pg";

const { Pool } = pg;

// Database configuration
const dbConfig = {
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "barry_db",
  user: process.env.POSTGRES_USER || "barry_user",
  password: process.env.POSTGRES_PASSWORD || "barry_password",
};

// Path to the gzipped GeoJSON file
const GEOJSON_PATH = path.resolve(
  __dirname,
  "../../api/src/report-generator/createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/getInfrastructureData/getSewageData/Sewerage_Network_Main_Pipelines.geojson.gz"
);

interface Feature {
  type: string;
  properties: {
    OBJECTID: number;
    MXUNITID: string;
    MXSITEID: string;
    COMPKEY: number | null;
    COMPTYPE: number | null;
    UNITID: string;
    UNITID2: string;
    PARALLEL_LINE_NBR: string | null;
    UNITTYPE: string;
    UNITTYPE_DESC: string;
    SEWER_NAME: string;
    ASSET_ID: string;
    ALTERNATE_ASSET_ID: string | null;
    SUBAREA: string | null;
    MATERIAL: string | null;
    UPSTREAM_IL: number | null;
    DOWNSTREAM_IL: number | null;
    PIPE_LENGTH: number | null;
    PIPE_WIDTH: number | null;
    PIPE_HEIGHT: number | null;
    GRADE: number | null;
    DATE_RELINED: string | null;
    DATE_OF_CONSTRUCTION: string | null;
    EPMS_SEC_NO: string | null;
    ASCONST_PLAN_NO: string | null;
    SOURCE: string | null;
    METHOD_OF_CAPTURE: string | null;
    DATE_CAPTURED: string | null;
    DATE_LAST_UPDATED: string | null;
    SERVICE_STATUS: string | null;
    SERVICE_STATUS_CHG_DATE: string | null;
    SERVICE_STATUS_PLAN_NO: string | null;
    COMMENTS: string | null;
    MI_PRINX: number;
  };
  geometry: {
    type: "LineString" | "MultiLineString";
    coordinates: any;
  };
}

/**
 * Convert ISO date string to PostgreSQL timestamp or null
 */
const parseDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
};

/**
 * Convert GeoJSON geometry to WKT (Well-Known Text) format for PostGIS
 */
const geometryToWKT = (geometry: any): string => {
  if (geometry.type === "LineString") {
    const coords = geometry.coordinates
      .map((coord: number[]) => `${coord[0]} ${coord[1]}`)
      .join(", ");
    return `LINESTRING(${coords})`;
  } else if (geometry.type === "MultiLineString") {
    const lines = geometry.coordinates
      .map((line: number[][]) => {
        const coords = line
          .map((coord: number[]) => `${coord[0]} ${coord[1]}`)
          .join(", ");
        return `(${coords})`;
      })
      .join(", ");
    return `MULTILINESTRING(${lines})`;
  }
  throw new Error(`Unsupported geometry type: ${geometry.type}`);
};

/**
 * Insert sewerage pipeline records in batches
 */
async function insertPipelines(
  pool: pg.Pool,
  features: Feature[],
  batchSize = 100
): Promise<void> {
  const totalFeatures = features.length;
  let inserted = 0;
  let skipped = 0;

  console.log(`\nInserting ${totalFeatures} pipelines in batches of ${batchSize}...`);

  for (let i = 0; i < totalFeatures; i += batchSize) {
    const batch = features.slice(i, i + batchSize);

    // Build the INSERT query
    const valueStrings: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const feature of batch) {
      const props = feature.properties;

      try {
        // Convert geometry to WKT
        const wkt = geometryToWKT(feature.geometry);

        const recordValues = [
          props.OBJECTID,
          props.MXUNITID,
          props.MXSITEID,
          props.COMPKEY,
          props.COMPTYPE,
          props.UNITID,
          props.UNITID2,
          props.PARALLEL_LINE_NBR,
          props.UNITTYPE,
          props.UNITTYPE_DESC,
          props.SEWER_NAME,
          props.ASSET_ID,
          props.ALTERNATE_ASSET_ID,
          props.SUBAREA,
          props.MATERIAL,
          props.UPSTREAM_IL,
          props.DOWNSTREAM_IL,
          props.PIPE_LENGTH,
          props.PIPE_WIDTH,
          props.PIPE_HEIGHT,
          props.GRADE,
          parseDate(props.DATE_RELINED),
          parseDate(props.DATE_OF_CONSTRUCTION),
          props.EPMS_SEC_NO,
          props.ASCONST_PLAN_NO,
          props.SOURCE,
          props.METHOD_OF_CAPTURE,
          parseDate(props.DATE_CAPTURED),
          parseDate(props.DATE_LAST_UPDATED),
          props.SERVICE_STATUS,
          parseDate(props.SERVICE_STATUS_CHG_DATE),
          props.SERVICE_STATUS_PLAN_NO,
          props.COMMENTS,
          props.MI_PRINX,
          wkt, // Geometry as WKT
        ];

        const placeholders = recordValues
          .map((_, idx) => {
            // Special handling for geometry - use ST_GeomFromText with SRID
            if (idx === recordValues.length - 1) {
              return `ST_GeomFromText($${paramIndex + idx}, 4326)`;
            }
            return `$${paramIndex + idx}`;
          })
          .join(", ");

        valueStrings.push(`(${placeholders})`);
        values.push(...recordValues);
        paramIndex += recordValues.length;
      } catch (error) {
        console.error(`Error processing feature ${props.OBJECTID}:`, error);
        skipped++;
        continue;
      }
    }

    if (valueStrings.length === 0) {
      continue;
    }

    const query = `
      INSERT INTO sewerage_pipelines (
        objectid, mxunitid, mxsiteid, compkey, comptype, unitid, unitid2, parallel_line_nbr,
        unittype, unittype_desc, sewer_name, asset_id, alternate_asset_id, subarea, material,
        upstream_il, downstream_il, pipe_length, pipe_width, pipe_height, grade,
        date_relined, date_of_construction, epms_sec_no, asconst_plan_no, source, method_of_capture,
        date_captured, date_last_updated, service_status, service_status_chg_date,
        service_status_plan_no, comments, mi_prinx, geom
      )
      VALUES ${valueStrings.join(", ")}
      ON CONFLICT (objectid) DO NOTHING
      RETURNING id
    `;

    try {
      const result = await pool.query(query, values);
      const batchInserted = result.rowCount || 0;
      const batchSkipped = batch.length - batchInserted;

      inserted += batchInserted;
      skipped += batchSkipped;

      const progress = Math.min(i + batchSize, totalFeatures);
      console.log(
        `Progress: ${progress}/${totalFeatures} (${((progress / totalFeatures) * 100).toFixed(1)}%) - ` +
        `Inserted: ${inserted}, Skipped: ${skipped}`
      );
    } catch (error) {
      console.error(`Error inserting batch starting at index ${i}:`, error);
      throw error;
    }
  }

  console.log(`\nCompleted! Total inserted: ${inserted}, Total skipped (duplicates): ${skipped}`);
}

/**
 * Main migration function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  console.log("=== Sewerage Pipeline Data Migration ===\n");
  console.log(`Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  console.log(`Dry run: ${dryRun ? "YES" : "NO"}\n`);

  // Check if file exists
  if (!fs.existsSync(GEOJSON_PATH)) {
    console.error(`❌ GeoJSON file not found: ${GEOJSON_PATH}`);
    process.exit(1);
  }

  console.log(`📁 Loading data from: ${path.basename(GEOJSON_PATH)}`);

  // Read and decompress the GeoJSON file
  const compressedData = fs.readFileSync(GEOJSON_PATH);
  const rawData = zlib.gunzipSync(compressedData).toString("utf-8");
  const geoJson = JSON.parse(rawData);

  console.log(`✅ Parsed GeoJSON: ${geoJson.features.length} features`);

  if (dryRun) {
    console.log("\nDry run complete - no data was inserted.");
    console.log("\nSample feature:");
    console.log(JSON.stringify(geoJson.features[0], null, 2).slice(0, 500) + "...");
    return;
  }

  // Connect to database
  const pool = new Pool(dbConfig);

  try {
    // Test connection and verify PostGIS
    const versionResult = await pool.query("SELECT PostGIS_Version()");
    console.log(`\n✅ PostGIS version: ${versionResult.rows[0].postgis_version}`);

    // Insert pipelines
    await insertPipelines(pool, geoJson.features);

    // Show summary statistics
    const statsQuery = `
      SELECT
        COUNT(*) as total_pipelines,
        COUNT(DISTINCT sewer_name) as unique_sewers,
        COUNT(DISTINCT unittype) as unique_types,
        COUNT(CASE WHEN service_status = 'IN' THEN 1 END) as active_pipelines,
        ROUND(AVG(pipe_length)::numeric, 2) as avg_pipe_length,
        ROUND(SUM(pipe_length)::numeric, 2) as total_pipe_length
      FROM sewerage_pipelines
    `;

    const stats = await pool.query(statsQuery);
    console.log("\n=== Database Statistics ===");
    console.log(`Total pipelines: ${stats.rows[0].total_pipelines}`);
    console.log(`Unique sewer names: ${stats.rows[0].unique_sewers}`);
    console.log(`Unique pipeline types: ${stats.rows[0].unique_types}`);
    console.log(`Active pipelines: ${stats.rows[0].active_pipelines}`);
    console.log(`Average pipe length: ${stats.rows[0].avg_pipe_length}m`);
    console.log(`Total pipe length: ${stats.rows[0].total_pipe_length}m`);
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
    console.log("\nDatabase connection closed.");
  }
}

// Run the migration
if (import.meta.main) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
