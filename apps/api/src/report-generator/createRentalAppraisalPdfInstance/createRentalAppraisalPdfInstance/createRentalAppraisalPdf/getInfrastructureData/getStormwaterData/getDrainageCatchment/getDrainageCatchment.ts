import * as turf from "@turf/turf";
import { checkIfPointInPolygon } from "../../../../createEnvironmentalSection/getEnvironmentalData/shared/checkIfPointInPolygon/checkIfPointInPolygon";
import { DrainageCatchment } from "../types";

type Args = {
  lat: number;
  lon: number;
  catchmentsGeoJSON: any; // GeoJSON FeatureCollection from Melbourne Water
};

type Return = DrainageCatchment | undefined;

/**
 * Identifies which drainage catchment the property belongs to
 *
 * Uses Melbourne Water catchment boundaries GeoJSON to determine the
 * drainage catchment area that includes the property location.
 *
 * Data source: Melbourne Water ArcGIS
 * - Catchments GeoJSON: https://data-melbournewater.opendata.arcgis.com/api/download/v1/items/15c3c23d7ef140b4a746e7779eae92d7/geojson?layers=1
 *
 * @param lat - Property latitude
 * @param lon - Property longitude
 * @param catchmentsGeoJSON - Melbourne Water catchments GeoJSON FeatureCollection
 * @returns Drainage catchment information if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const catchment = getDrainageCatchment({
 *   lat: -37.8136,
 *   lon: 144.9631,
 *   catchmentsGeoJSON: melbourneWaterCatchments
 * });
 * // Returns: { name: "Yarra River", area: 4000, waterway: "Yarra River" }
 * ```
 */
export const getDrainageCatchment = ({
  lat,
  lon,
  catchmentsGeoJSON,
}: Args): Return => {
  try {
    if (!catchmentsGeoJSON || !catchmentsGeoJSON.features) {
      console.warn("Invalid catchments GeoJSON provided");
      return undefined;
    }

    // Check if data is in a projected coordinate system (e.g., MGA Zone 55 - EPSG:28355)
    const crs = catchmentsGeoJSON.crs?.properties?.name;
    const isProjected = crs && (crs.includes("28355") || crs.includes("MGA"));

    if (isProjected) {
      console.warn(
        `Catchment data is in projected CRS (${crs}). Cannot perform WGS84 point-in-polygon check without coordinate transformation. Use ArcGIS REST API query instead.`
      );
      return undefined;
    }

    const point = turf.point([lon, lat]);

    // Find the catchment that contains this point
    for (const feature of catchmentsGeoJSON.features) {
      const isInside = checkIfPointInPolygon({ feature, point });

      if (isInside) {
        const props = feature.properties;

        // Extract catchment information from properties
        // Property names may vary in the actual GeoJSON
        const name =
          props.CATCH_NAME ||
          props.catchment_name ||
          props.name ||
          "Unknown Catchment";
        const waterway =
          props.WATERWAY ||
          props.waterway ||
          props.stream_name ||
          props.CATCH_NAME ||
          name;

        // Get area in hectares - prefer property value, fallback to calculation
        let area = props.AREA_HA || props.area_ha || props.area;

        if (!area) {
          // Calculate from geometry if not in properties
          try {
            const areaM2 = turf.area(feature);
            area = areaM2 / 10000; // Convert m² to hectares
          } catch {
            area = 0;
          }
        }

        return {
          name,
          area: Math.round(area),
          waterway,
        };
      }
    }

    // Property not found in any catchment
    return undefined;
  } catch (error) {
    console.error("Error determining drainage catchment:", error);
    return undefined;
  }
};
