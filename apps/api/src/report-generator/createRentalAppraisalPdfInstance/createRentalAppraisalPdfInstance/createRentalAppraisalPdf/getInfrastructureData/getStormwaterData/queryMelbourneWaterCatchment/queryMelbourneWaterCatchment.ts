import makeFetchHappen from "make-fetch-happen";
import { DrainageCatchment } from "../types";

type Args = {
  lat: number;
  lon: number;
};

type Return = DrainageCatchment | undefined;

// Melbourne Water Catchments ArcGIS REST API
const CATCHMENTS_QUERY_URL =
  "https://services5.arcgis.com/ZSYwjtv8RKVhkXIL/arcgis/rest/services/Catchments_of_all_Waterways_and_Drains/FeatureServer/1/query";

// Create fetch instance with caching
const fetch = makeFetchHappen.defaults({
  cachePath: "./node_modules/.cache/stormwater-cache",
  timeout: 30000,
});

/**
 * Queries Melbourne Water catchment data using ArcGIS REST API
 *
 * This method uses the query endpoint which handles coordinate transformations
 * automatically, unlike the GeoJSON download which requires manual transformation
 * from MGA Zone 55 (EPSG:28355) to WGS84 (EPSG:4326).
 *
 * @param lat - Property latitude (WGS84)
 * @param lon - Property longitude (WGS84)
 * @returns Drainage catchment information if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const catchment = await queryMelbourneWaterCatchment({
 *   lat: -37.8136,
 *   lon: 144.9631
 * });
 * // Returns: { name: "Yarra River", area: 4000, waterway: "Yarra River" }
 * ```
 */
export const queryMelbourneWaterCatchment = async ({
  lat,
  lon,
}: Args): Promise<Return> => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      geometry: JSON.stringify({
        x: lon,
        y: lat,
        spatialReference: { wkid: 4326 }, // WGS84
      }),
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      returnGeometry: "false", // We don't need the geometry, just the attributes
      f: "json",
    });

    const url = `${CATCHMENTS_QUERY_URL}?${params.toString()}`;

    console.log("Querying Melbourne Water catchments API...");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RentalAppraisalApp/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        `Melbourne Water catchments query failed: ${response.status} ${response.statusText}`
      );
      return undefined;
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.log("No catchment found at this location");
      return undefined;
    }

    // Get the first matching catchment
    const feature = data.features[0];
    const props = feature.attributes;

    // Extract catchment information
    // Actual property names from Melbourne Water ArcGIS service Layer 1:
    // SUB_CATCHMENT_NAME, MAJOR_CATCHMENT_NAME, PRIMARY_CATCHMENT_NAME, RIVER_BASIN_CATCHMENT_NAME
    const name =
      props.SUB_CATCHMENT_NAME ||
      props.MAJOR_CATCHMENT_NAME ||
      props.PRIMARY_CATCHMENT_NAME ||
      props.RIVER_BASIN_CATCHMENT_NAME ||
      "Unknown Catchment";

    // Use primary catchment or river basin as waterway
    const waterway =
      props.PRIMARY_CATCHMENT_NAME ||
      props.RIVER_BASIN_CATCHMENT_NAME ||
      props.MAJOR_CATCHMENT_NAME ||
      name;

    // Area in hectares - convert from square kilometers
    const areaSqKm = props.AREA_SQ_KM || 0;
    const areaHa = areaSqKm * 100; // 1 km² = 100 hectares

    console.log(`Found catchment: ${name} (${Math.round(areaHa)} ha)`);

    return {
      name,
      area: Math.round(areaHa),
      waterway,
    };
  } catch (error) {
    console.error("Error querying Melbourne Water catchments API:", error);
    return undefined;
  }
};
