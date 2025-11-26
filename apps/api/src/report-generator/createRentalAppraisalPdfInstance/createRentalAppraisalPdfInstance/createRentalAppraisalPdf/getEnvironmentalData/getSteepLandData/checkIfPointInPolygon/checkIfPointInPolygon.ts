import * as turf from "@turf/turf";

type Args = {
  feature: any;
  point: any;
};

type Return = boolean;

/**
 * Checks if a point is within a polygon or multipolygon feature
 *
 * @param feature - GeoJSON feature with Polygon or MultiPolygon geometry
 * @param point - Turf.js point to check
 * @returns true if point is inside the polygon, false otherwise
 *
 * @example
 * ```typescript
 * const point = turf.point([144.9631, -37.8136]);
 * const feature = {
 *   geometry: {
 *     type: "Polygon",
 *     coordinates: [[[144.96, -37.81], [144.97, -37.81], [144.97, -37.82], [144.96, -37.82], [144.96, -37.81]]]
 *   }
 * };
 * const isInside = checkIfPointInPolygon({ feature, point });
 * // Returns: true
 * ```
 */
export const checkIfPointInPolygon = ({ feature, point }: Args): Return => {
  try {
    const geometry = feature.geometry;
    if (geometry.type === "Polygon") {
      const polygon = turf.polygon(geometry.coordinates);
      return turf.booleanPointInPolygon(point, polygon);
    } else if (geometry.type === "MultiPolygon") {
      for (const polygonCoords of geometry.coordinates) {
        const polygon = turf.polygon(polygonCoords);
        if (turf.booleanPointInPolygon(point, polygon)) return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};
