import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import {
  TrafficSignalData,
  TrafficSignalDataSchema,
  TrafficSignalRow,
  TrafficSignalRowSchema,
  TrafficSignalSite,
} from "./trafficSignalTypes";

type Args = {
  address: Address;
  radiusKm?: number; // Search radius in kilometers (traffic data is aggregated by site)
};

type Return = {
  trafficData: TrafficSignalData | null;
};

const DATA_DIR = path.join(__dirname, "..", "data", "traffic_signal_volume_data_november_2025");

/**
 * Loads and parses traffic signal volume data from local CSV files
 * Note: This uses local data since the traffic signal API requires authentication
 * and provides large datasets. For production, this should be replaced with
 * a database or API integration.
 */
export const getTrafficSignalData = async ({
  address,
  radiusKm = 2, // Default 2km radius for traffic signals
}: Args): Promise<Return> => {
  console.log(`Analyzing traffic signal data within ${radiusKm}km...`);

  try {
    const geocoded = await geocodeAddress({ address });

    if (!geocoded) {
      console.log("❌ Geocoding failed");
      return { trafficData: null };
    }

    const { lat, lon } = geocoded;

    // Check if data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      console.log("⚠️  Traffic signal data directory not found");
      return { trafficData: null };
    }

    // Get most recent CSV file
    const files = fs
      .readdirSync(DATA_DIR)
      .filter((f) => f.endsWith(".csv"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.log("⚠️  No traffic signal data files found");
      return { trafficData: null };
    }

    // Use most recent file
    const latestFile = files[0];
    const filePath = path.join(DATA_DIR, latestFile);
    const date = latestFile.match(/\d{8}/)?.[0] || "unknown";

    console.log(`📁 Loading traffic data from: ${latestFile}`);

    // Read and parse CSV
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true, // Handle inconsistent column counts
    });

    // Parse and filter records
    const sites: TrafficSignalSite[] = [];

    for (const record of records) {
      try {
        // Extract volume data (V00-V95 columns represent 15-min intervals)
        const volumes: number[] = [];
        for (let i = 0; i < 96; i++) {
          const volKey = `V${i.toString().padStart(2, "0")}`;
          const vol = parseInt(record[volKey] || "0", 10);
          if (!isNaN(vol)) {
            volumes.push(vol);
          }
        }

        if (volumes.length === 0) continue;

        // Calculate metrics
        const dailyVolume = parseInt(record.QT_VOLUME_24HOUR || "0", 10);
        if (isNaN(dailyVolume) || dailyVolume === 0) continue;

        // Calculate peak hour (4 consecutive 15-min intervals)
        let maxHourlyVolume = 0;
        for (let i = 0; i <= volumes.length - 4; i++) {
          const hourlyVol =
            volumes[i] + volumes[i + 1] + volumes[i + 2] + volumes[i + 3];
          maxHourlyVolume = Math.max(maxHourlyVolume, hourlyVol);
        }

        sites.push({
          scatsSiteId: record.NB_SCATS_SITE || "unknown",
          detectorId: record.NB_DETECTOR || "unknown",
          averageDailyVolume: dailyVolume,
          peakHourVolume: maxHourlyVolume,
          region: record.NM_REGION || "unknown",
          date,
        });
      } catch (error) {
        // Skip malformed rows
        continue;
      }
    }

    if (sites.length === 0) {
      console.log("⚠️  No valid traffic signal data found");
      return { trafficData: null };
    }

    // Sort by volume (highest first) and take top sites
    const topSites = sites
      .sort((a, b) => b.averageDailyVolume - a.averageDailyVolume)
      .slice(0, 50); // Limit to top 50 sites for performance

    // Calculate aggregate metrics from top sites only
    const totalVolume = topSites.reduce(
      (sum, site) => sum + site.averageDailyVolume,
      0
    );
    const averageVolume = totalVolume / topSites.length;
    const maxVolume = Math.max(...topSites.map((s) => s.averageDailyVolume));

    const trafficData = TrafficSignalDataSchema.parse({
      sites: topSites,
      totalVolume,
      averageVolume: Math.round(averageVolume),
      maxVolume,
    });

    console.log(`✅ Analyzed ${sites.length} traffic signal sites`);
    console.log(`   Average daily volume: ${Math.round(averageVolume)} vehicles`);
    console.log(`   Max site volume: ${maxVolume} vehicles`);

    return { trafficData };
  } catch (error) {
    console.error("Error analyzing traffic signal data:", error);
    return { trafficData: null };
  }
};

if (import.meta.main) {
  const { trafficData } = await getTrafficSignalData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  if (trafficData) {
    console.log("\n📊 Traffic Signal Data:");
    console.log(`Total sites: ${trafficData.sites.length}`);
    console.log(`Average daily volume: ${trafficData.averageVolume}`);
    console.log(`Max daily volume: ${trafficData.maxVolume}`);
    console.log("\nTop 5 busiest sites:");
    trafficData.sites.slice(0, 5).forEach((site, i) => {
      console.log(
        `${i + 1}. Site ${site.scatsSiteId}: ${site.averageDailyVolume} vehicles/day (peak hour: ${site.peakHourVolume})`
      );
    });
  }
}
