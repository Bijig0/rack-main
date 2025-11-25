import * as turf from "@turf/turf";
import { filterValidCoords } from "../filterValidCoords/filterValidCoords";
import { simplifyCoords } from "../simplifyCoords/simplifyCoords";

type Args = {
  feature: any;
  point: any;
};

type Return = number;

/**
 * Calculates the distance in meters from a point to the nearest edge of a polygon/multipolygon feature
 *
 * Handles large polygons (>5000 points) by simplifying geometry to avoid Turf.js performance issues.
 * Returns 0 if the point is inside the polygon.
 *
 * @param feature - GeoJSON feature with Polygon or MultiPolygon geometry
 * @param point - Turf.js point to measure distance from
 * @returns Distance in meters (0 if inside polygon, Infinity if error/invalid geometry)
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
 * const distance = calculateDistance({ feature, point });
 * // Returns: 0 (point is inside)
 * ```
 */
export const calculateDistance = ({ feature, point }: Args): Return => {
  try {
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
      const outerRing = geometry.coordinates[0];
      const validCoords = filterValidCoords({ coords: outerRing });
      if (validCoords.length < 4) return Infinity;

      const line = turf.lineString(
        validCoords.length > 5000
          ? simplifyCoords({ coords: validCoords })
          : validCoords
      );
      const nearest = turf.nearestPointOnLine(line, point);
      return turf.distance(point, nearest, { units: "meters" });
    } else if (geometry.type === "MultiPolygon") {
      let minDistance = Infinity;
      for (const polygonCoords of geometry.coordinates) {
        const outerRing = polygonCoords[0];
        const validCoords = filterValidCoords({ coords: outerRing });
        if (validCoords.length < 4) continue;

        const line = turf.lineString(
          validCoords.length > 5000
            ? simplifyCoords({ coords: validCoords })
            : validCoords
        );
        const nearest = turf.nearestPointOnLine(line, point);
        const distance = turf.distance(point, nearest, { units: "meters" });
        minDistance = Math.min(minDistance, distance);
      }
      return minDistance;
    }
    return Infinity;
  } catch {
    return Infinity;
  }
};
