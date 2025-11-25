import * as turf from "@turf/turf";
import makeFetchHappen from "make-fetch-happen";
import { RetardingBasin } from "../types";

type Args = {
  lat: number;
  lon: number;
  bufferMeters?: number;
};

type Return = RetardingBasin[];

const VICMAP_WFS_URL = "https://opendata.maps.vic.gov.au/geoserver/wfs";

// Create fetch instance with caching
const fetch = makeFetchHappen.defaults({
  cachePath: "./node_modules/.cache/stormwater-cache",
  timeout: 30000,
});

/**
 * Finds nearby flood retarding basins and stormwater infrastructure
 *
 * Queries the Vicmap Open Data Platform WFS service for retarding basins
 * within the specified buffer radius of the property.
 *
 * Data sources:
 * - public_dam_retarding_basin_points_unrestricted (1,538 features)
 * - basin100 (Drainage basins)
 *
 * Retarding basins are critical flood mitigation infrastructure that
 * temporarily store stormwater during heavy rainfall to reduce downstream
 * flooding and protect properties.
 *
 * @param lat - Property latitude
 * @param lon - Property longitude
 * @param bufferMeters - Search radius in meters (default: 2000m)
 * @returns Array of nearby retarding basins sorted by distance
 *
 * @example
 * ```typescript
 * const basins = await getRetardingBasins({
 *   lat: -37.8136,
 *   lon: 144.9631,
 *   bufferMeters: 3000
 * });
 * // Returns: [{ name: "Gardiners Creek RB", distance: 850, capacity: 125, ... }]
 * ```
 */
export const getRetardingBasins = async ({
  lat,
  lon,
  bufferMeters = 2000,
}: Args): Promise<Return> => {
  try {
    const point = turf.point([lon, lat]);
    const buffered = turf.buffer(point, bufferMeters / 1000, {
      units: "kilometers",
    });
    const bbox = turf.bbox(buffered);

    // Query Vicmap WFS for retarding basins
    const url = new URL(VICMAP_WFS_URL);
    url.searchParams.set("service", "WFS");
    url.searchParams.set("version", "2.0.0");
    url.searchParams.set("request", "GetFeature");
    url.searchParams.set(
      "typeNames",
      "open-data-platform:public_dam_retarding_basin_points_unrestricted"
    );
    url.searchParams.set("outputFormat", "application/json");
    url.searchParams.set("bbox", bbox.join(","));
    url.searchParams.set("srsName", "EPSG:4326");

    console.log(`Fetching retarding basins within ${bufferMeters}m...`);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "RentalAppraisalApp/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        `WFS request failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.log("No retarding basins found in area");
      return [];
    }

    console.log(`Found ${data.features.length} retarding basin(s)`);

    // Process and filter basins
    const basins: RetardingBasin[] = [];

    for (const feature of data.features) {
      try {
        const coords = feature.geometry.coordinates;
        const basinPoint = turf.point(coords);
        const distance = turf.distance(point, basinPoint, { units: "meters" });

        // Only include basins within buffer
        if (distance <= bufferMeters) {
          const props = feature.properties;

          // Extract basin information from properties
          // Based on actual WFS response: storagenam, storagetyp, damowner, capacity
          const name =
            props.storagenam ||
            props.damname ||
            props.NAME ||
            props.name ||
            "Unnamed Basin";
          const type =
            props.storagetyp ||
            props.TYPE ||
            props.type ||
            "Retarding Basin";
          const owner =
            props.damowner ||
            props.OWNER ||
            props.owner ||
            undefined;

          // Capacity in megalitres (may not be available for all basins)
          const capacity =
            props.capacity ||
            props.CAPACITY ||
            props.CAPACITY_ML ||
            undefined;

          basins.push({
            name,
            distance: Math.round(distance),
            capacity: capacity ? parseFloat(capacity) : undefined,
            type,
            owner,
          });
        }
      } catch (error) {
        console.warn("Error processing basin feature:", error);
        continue;
      }
    }

    // Sort by distance (closest first)
    basins.sort((a, b) => a.distance - b.distance);

    return basins;
  } catch (error) {
    console.error("Error fetching retarding basins:", error);
    return [];
  }
};
