#!/usr/bin/env bun

/**
 * Smart migration script to load only missing traffic signal data
 *
 * This script:
 * 1. Queries the database to get current record counts per date
 * 2. Scans CSV files to get expected record counts
 * 3. Identifies which files have missing data
 * 4. Only processes CSV files with missing records
 */

import pg from "pg";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const { Pool } = pg;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;

const dbConfig = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      database: process.env.POSTGRES_DB || "barry_db",
      user: process.env.POSTGRES_USER || "barry_user",
      password: process.env.POSTGRES_PASSWORD || "barry_password",
    };

const DATA_DIR = path.resolve(
  __dirname,
  "../traffic_signal_volume_data_november_2025"
);

interface TrafficRecord {
  scats_site: number;
  interval_date: string;
  detector_number: number;
  v00: number; v01: number; v02: number; v03: number; v04: number;
  v05: number; v06: number; v07: number; v08: number; v09: number;
  v10: number; v11: number; v12: number; v13: number; v14: number;
  v15: number; v16: number; v17: number; v18: number; v19: number;
  v20: number; v21: number; v22: number; v23: number; v24: number;
  v25: number; v26: number; v27: number; v28: number; v29: number;
  v30: number; v31: number; v32: number; v33: number; v34: number;
  v35: number; v36: number; v37: number; v38: number; v39: number;
  v40: number; v41: number; v42: number; v43: number; v44: number;
  v45: number; v46: number; v47: number; v48: number; v49: number;
  v50: number; v51: number; v52: number; v53: number; v54: number;
  v55: number; v56: number; v57: number; v58: number; v59: number;
  v60: number; v61: number; v62: number; v63: number; v64: number;
  v65: number; v66: number; v67: number; v68: number; v69: number;
  v70: number; v71: number; v72: number; v73: number; v74: number;
  v75: number; v76: number; v77: number; v78: number; v79: number;
  v80: number; v81: number; v82: number; v83: number; v84: number;
  v85: number; v86: number; v87: number; v88: number; v89: number;
  v90: number; v91: number; v92: number; v93: number; v94: number;
  v95: number;
  region: string;
  record_count: number;
  volume_24hour: number;
  alarm_24hour: number;
}

/**
 * Get current record counts from database by date
 */
async function getDatabaseCounts(pool: pg.Pool): Promise<Map<string, number>> {
  const query = `
    SELECT
      TO_CHAR(interval_date, 'YYYY-MM-DD') as date_string,
      COUNT(*) as count
    FROM traffic_signal_volumes
    GROUP BY TO_CHAR(interval_date, 'YYYY-MM-DD')
  `;

  const result = await pool.query(query);
  const counts = new Map<string, number>();

  for (const row of result.rows) {
    counts.set(row.date_string, parseInt(row.count));
  }

  return counts;
}

/**
 * Count records in a CSV file without parsing all data
 */
function countCSVRecords(filePath: string): number {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.trim().split("\n");
  // Subtract 1 for header row
  return lines.length - 1;
}

/**
 * Extract date from CSV filename (e.g., VSDATA_20251101.csv -> 2025-11-01)
 */
function extractDateFromFilename(filename: string): string {
  const match = filename.match(/VSDATA_(\d{4})(\d{2})(\d{2})\.csv/);
  if (!match) {
    throw new Error(`Invalid filename format: ${filename}`);
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
}

/**
 * Parse CSV file and return traffic records
 */
function parseCSVFile(filePath: string): TrafficRecord[] {
  console.log(`Reading file: ${filePath}`);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Parsed ${records.length} records from ${path.basename(filePath)}`);

  return records.map((record: any) => ({
    scats_site: parseInt(record.NB_SCATS_SITE),
    interval_date: record.QT_INTERVAL_COUNT,
    detector_number: parseInt(record.NB_DETECTOR),
    v00: parseInt(record.V00) || 0, v01: parseInt(record.V01) || 0,
    v02: parseInt(record.V02) || 0, v03: parseInt(record.V03) || 0,
    v04: parseInt(record.V04) || 0, v05: parseInt(record.V05) || 0,
    v06: parseInt(record.V06) || 0, v07: parseInt(record.V07) || 0,
    v08: parseInt(record.V08) || 0, v09: parseInt(record.V09) || 0,
    v10: parseInt(record.V10) || 0, v11: parseInt(record.V11) || 0,
    v12: parseInt(record.V12) || 0, v13: parseInt(record.V13) || 0,
    v14: parseInt(record.V14) || 0, v15: parseInt(record.V15) || 0,
    v16: parseInt(record.V16) || 0, v17: parseInt(record.V17) || 0,
    v18: parseInt(record.V18) || 0, v19: parseInt(record.V19) || 0,
    v20: parseInt(record.V20) || 0, v21: parseInt(record.V21) || 0,
    v22: parseInt(record.V22) || 0, v23: parseInt(record.V23) || 0,
    v24: parseInt(record.V24) || 0, v25: parseInt(record.V25) || 0,
    v26: parseInt(record.V26) || 0, v27: parseInt(record.V27) || 0,
    v28: parseInt(record.V28) || 0, v29: parseInt(record.V29) || 0,
    v30: parseInt(record.V30) || 0, v31: parseInt(record.V31) || 0,
    v32: parseInt(record.V32) || 0, v33: parseInt(record.V33) || 0,
    v34: parseInt(record.V34) || 0, v35: parseInt(record.V35) || 0,
    v36: parseInt(record.V36) || 0, v37: parseInt(record.V37) || 0,
    v38: parseInt(record.V38) || 0, v39: parseInt(record.V39) || 0,
    v40: parseInt(record.V40) || 0, v41: parseInt(record.V41) || 0,
    v42: parseInt(record.V42) || 0, v43: parseInt(record.V43) || 0,
    v44: parseInt(record.V44) || 0, v45: parseInt(record.V45) || 0,
    v46: parseInt(record.V46) || 0, v47: parseInt(record.V47) || 0,
    v48: parseInt(record.V48) || 0, v49: parseInt(record.V49) || 0,
    v50: parseInt(record.V50) || 0, v51: parseInt(record.V51) || 0,
    v52: parseInt(record.V52) || 0, v53: parseInt(record.V53) || 0,
    v54: parseInt(record.V54) || 0, v55: parseInt(record.V55) || 0,
    v56: parseInt(record.V56) || 0, v57: parseInt(record.V57) || 0,
    v58: parseInt(record.V58) || 0, v59: parseInt(record.V59) || 0,
    v60: parseInt(record.V60) || 0, v61: parseInt(record.V61) || 0,
    v62: parseInt(record.V62) || 0, v63: parseInt(record.V63) || 0,
    v64: parseInt(record.V64) || 0, v65: parseInt(record.V65) || 0,
    v66: parseInt(record.V66) || 0, v67: parseInt(record.V67) || 0,
    v68: parseInt(record.V68) || 0, v69: parseInt(record.V69) || 0,
    v70: parseInt(record.V70) || 0, v71: parseInt(record.V71) || 0,
    v72: parseInt(record.V72) || 0, v73: parseInt(record.V73) || 0,
    v74: parseInt(record.V74) || 0, v75: parseInt(record.V75) || 0,
    v76: parseInt(record.V76) || 0, v77: parseInt(record.V77) || 0,
    v78: parseInt(record.V78) || 0, v79: parseInt(record.V79) || 0,
    v80: parseInt(record.V80) || 0, v81: parseInt(record.V81) || 0,
    v82: parseInt(record.V82) || 0, v83: parseInt(record.V83) || 0,
    v84: parseInt(record.V84) || 0, v85: parseInt(record.V85) || 0,
    v86: parseInt(record.V86) || 0, v87: parseInt(record.V87) || 0,
    v88: parseInt(record.V88) || 0, v89: parseInt(record.V89) || 0,
    v90: parseInt(record.V90) || 0, v91: parseInt(record.V91) || 0,
    v92: parseInt(record.V92) || 0, v93: parseInt(record.V93) || 0,
    v94: parseInt(record.V94) || 0, v95: parseInt(record.V95) || 0,
    region: record.NM_REGION,
    record_count: parseInt(record.CT_RECORDS) || 0,
    volume_24hour: parseInt(record.QT_VOLUME_24HOUR) || 0,
    alarm_24hour: parseInt(record.CT_ALARM_24HOUR) || 0,
  }));
}

/**
 * Insert records into database in batches
 */
async function insertRecords(
  pool: pg.Pool,
  records: TrafficRecord[],
  batchSize = 500
): Promise<void> {
  const totalRecords = records.length;
  let inserted = 0;
  let skipped = 0;

  console.log(`\nInserting ${totalRecords} records in batches of ${batchSize}...`);

  for (let i = 0; i < totalRecords; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    const valueStrings: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const record of batch) {
      const recordValues = [
        record.scats_site, record.interval_date, record.detector_number,
        record.v00, record.v01, record.v02, record.v03, record.v04,
        record.v05, record.v06, record.v07, record.v08, record.v09,
        record.v10, record.v11, record.v12, record.v13, record.v14,
        record.v15, record.v16, record.v17, record.v18, record.v19,
        record.v20, record.v21, record.v22, record.v23, record.v24,
        record.v25, record.v26, record.v27, record.v28, record.v29,
        record.v30, record.v31, record.v32, record.v33, record.v34,
        record.v35, record.v36, record.v37, record.v38, record.v39,
        record.v40, record.v41, record.v42, record.v43, record.v44,
        record.v45, record.v46, record.v47, record.v48, record.v49,
        record.v50, record.v51, record.v52, record.v53, record.v54,
        record.v55, record.v56, record.v57, record.v58, record.v59,
        record.v60, record.v61, record.v62, record.v63, record.v64,
        record.v65, record.v66, record.v67, record.v68, record.v69,
        record.v70, record.v71, record.v72, record.v73, record.v74,
        record.v75, record.v76, record.v77, record.v78, record.v79,
        record.v80, record.v81, record.v82, record.v83, record.v84,
        record.v85, record.v86, record.v87, record.v88, record.v89,
        record.v90, record.v91, record.v92, record.v93, record.v94,
        record.v95,
        record.region, record.record_count, record.volume_24hour, record.alarm_24hour,
      ];

      const placeholders = recordValues
        .map((_, idx) => `$${paramIndex + idx}`)
        .join(", ");

      valueStrings.push(`(${placeholders})`);
      values.push(...recordValues);
      paramIndex += recordValues.length;
    }

    const query = `
      INSERT INTO traffic_signal_volumes (
        scats_site, interval_date, detector_number,
        v00, v01, v02, v03, v04, v05, v06, v07, v08, v09,
        v10, v11, v12, v13, v14, v15, v16, v17, v18, v19,
        v20, v21, v22, v23, v24, v25, v26, v27, v28, v29,
        v30, v31, v32, v33, v34, v35, v36, v37, v38, v39,
        v40, v41, v42, v43, v44, v45, v46, v47, v48, v49,
        v50, v51, v52, v53, v54, v55, v56, v57, v58, v59,
        v60, v61, v62, v63, v64, v65, v66, v67, v68, v69,
        v70, v71, v72, v73, v74, v75, v76, v77, v78, v79,
        v80, v81, v82, v83, v84, v85, v86, v87, v88, v89,
        v90, v91, v92, v93, v94, v95,
        region, record_count, volume_24hour, alarm_24hour
      )
      VALUES ${valueStrings.join(", ")}
      ON CONFLICT (scats_site, interval_date, detector_number) DO NOTHING
      RETURNING id
    `;

    try {
      const result = await pool.query(query, values);
      const batchInserted = result.rowCount || 0;
      const batchSkipped = batch.length - batchInserted;

      inserted += batchInserted;
      skipped += batchSkipped;

      const progress = Math.min(i + batchSize, totalRecords);
      console.log(
        `Progress: ${progress}/${totalRecords} (${((progress / totalRecords) * 100).toFixed(1)}%) - ` +
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
 * Main function
 */
async function main() {
  console.log("=== Smart Traffic Signal Data Migration ===\n");

  if (DATABASE_URL) {
    const maskedUrl = DATABASE_URL.replace(/:([^@]+)@/, ":***@");
    console.log(`Database: ${maskedUrl}\n`);
  }

  const pool = new Pool(dbConfig);

  try {
    // Step 1: Get current database counts
    console.log("Step 1: Checking current database state...");
    await pool.query("SELECT NOW()");
    const dbCounts = await getDatabaseCounts(pool);

    console.log("\nCurrent database counts:");
    for (const [date, count] of dbCounts) {
      console.log(`  ${date}: ${count} records`);
    }

    // Step 2: Scan CSV files and compare
    console.log("\nStep 2: Scanning CSV files...");
    const files = fs.readdirSync(DATA_DIR);
    const csvFiles = files.filter((f) => f.endsWith(".csv")).sort();

    const filesToProcess: { file: string; date: string; csvCount: number; dbCount: number; missing: number }[] = [];

    for (const file of csvFiles) {
      const filePath = path.join(DATA_DIR, file);
      const date = extractDateFromFilename(file);
      const csvCount = countCSVRecords(filePath);
      const dbCount = dbCounts.get(date) || 0;
      const missing = csvCount - dbCount;

      console.log(`  ${file} (${date}): ${csvCount} records in CSV, ${dbCount} in DB`);

      if (missing > 0) {
        filesToProcess.push({ file, date, csvCount, dbCount, missing });
      }
    }

    // Step 3: Determine what needs to be migrated
    console.log("\nStep 3: Analysis complete.");

    if (filesToProcess.length === 0) {
      console.log("✓ All data is already migrated. No action needed.");
      return;
    }

    console.log(`\n⚠ Found ${filesToProcess.length} file(s) with missing data:`);
    let totalMissing = 0;
    for (const item of filesToProcess) {
      console.log(`  - ${item.file}: ${item.missing} missing records`);
      totalMissing += item.missing;
    }
    console.log(`\nTotal missing records: ${totalMissing}`);

    // Step 4: Process missing files
    console.log("\nStep 4: Processing files with missing data...");

    for (const item of filesToProcess) {
      console.log(`\n--- Processing ${item.file} ---`);
      const filePath = path.join(DATA_DIR, item.file);
      const records = parseCSVFile(filePath);
      await insertRecords(pool, records);
    }

    // Step 5: Verify final state
    console.log("\n=== Final Database Statistics ===");
    const statsQuery = `
      SELECT
        COUNT(*) as total_records,
        COUNT(DISTINCT scats_site) as unique_sites,
        COUNT(DISTINCT interval_date) as unique_dates,
        MIN(interval_date) as earliest_date,
        MAX(interval_date) as latest_date
      FROM traffic_signal_volumes
    `;

    const stats = await pool.query(statsQuery);
    console.log(`Total records: ${stats.rows[0].total_records}`);
    console.log(`Unique SCATS sites: ${stats.rows[0].unique_sites}`);
    console.log(`Unique dates: ${stats.rows[0].unique_dates}`);
    console.log(`Date range: ${stats.rows[0].earliest_date} to ${stats.rows[0].latest_date}`);

    // Show final per-date breakdown
    const finalCounts = await getDatabaseCounts(pool);
    console.log("\nFinal record counts by date:");
    for (const [date, count] of Array.from(finalCounts.entries()).sort()) {
      console.log(`  ${date}: ${count} records`);
    }

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
