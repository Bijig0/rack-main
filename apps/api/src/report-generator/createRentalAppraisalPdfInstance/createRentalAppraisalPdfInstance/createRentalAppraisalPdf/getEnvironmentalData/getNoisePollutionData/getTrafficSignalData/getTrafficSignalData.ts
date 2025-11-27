import { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { getPool } from "../../../../../../../db/pool";
import {
  TrafficSignalData,
  TrafficSignalDataSchema,
  TrafficSignalSite,
} from "./trafficSignalTypes";

type Args = {
  address: Address;
  radiusKm?: number; // Search radius in kilometers (traffic data is aggregated by site)
};

type Return = {
  trafficData: TrafficSignalData | null;
};

/**
 * Loads and analyzes traffic signal volume data from the PostgreSQL database
 * Data is sourced from SCATS (Sydney Coordinated Adaptive Traffic System) detectors
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

    // Get database connection
    const pool = getPool();

    // Query traffic signal data from database
    // Get the most recent date available and aggregate by site
    console.log(`📊 Querying traffic data from database...`);

    const query = `
      SELECT
        scats_site,
        detector_number,
        interval_date,
        region,
        volume_24hour,
        v00, v01, v02, v03, v04, v05, v06, v07, v08, v09,
        v10, v11, v12, v13, v14, v15, v16, v17, v18, v19,
        v20, v21, v22, v23, v24, v25, v26, v27, v28, v29,
        v30, v31, v32, v33, v34, v35, v36, v37, v38, v39,
        v40, v41, v42, v43, v44, v45, v46, v47, v48, v49,
        v50, v51, v52, v53, v54, v55, v56, v57, v58, v59,
        v60, v61, v62, v63, v64, v65, v66, v67, v68, v69,
        v70, v71, v72, v73, v74, v75, v76, v77, v78, v79,
        v80, v81, v82, v83, v84, v85, v86, v87, v88, v89,
        v90, v91, v92, v93, v94, v95
      FROM traffic_signal_volumes
      WHERE interval_date = (
        SELECT MAX(interval_date) FROM traffic_signal_volumes
      )
      AND volume_24hour > 0
      ORDER BY volume_24hour DESC
      LIMIT 1000
    `;

    const result = await pool.query(query);
    const records = result.rows;

    if (records.length === 0) {
      console.log("⚠️  No traffic signal data found in database");
      return { trafficData: null };
    }

    const date = records[0].interval_date.toISOString().split('T')[0];
    console.log(`📁 Loading traffic data from: ${date}`);

    // Parse and process records
    const sites: TrafficSignalSite[] = [];

    for (const record of records) {
      try {
        // Extract volume data (v00-v95 columns represent 15-min intervals)
        const volumes: number[] = [];
        for (let i = 0; i < 96; i++) {
          const volKey = `v${i.toString().padStart(2, "0")}`;
          const vol = record[volKey] || 0;
          volumes.push(vol);
        }

        const dailyVolume = record.volume_24hour;
        if (!dailyVolume || dailyVolume === 0) continue;

        // Calculate peak hour (4 consecutive 15-min intervals)
        let maxHourlyVolume = 0;
        for (let i = 0; i <= volumes.length - 4; i++) {
          const hourlyVol =
            volumes[i] + volumes[i + 1] + volumes[i + 2] + volumes[i + 3];
          maxHourlyVolume = Math.max(maxHourlyVolume, hourlyVol);
        }

        sites.push({
          scatsSiteId: record.scats_site.toString(),
          detectorId: record.detector_number.toString(),
          averageDailyVolume: dailyVolume,
          peakHourVolume: maxHourlyVolume,
          region: record.region || "unknown",
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
