import * as turf from "@turf/turf";

type Args = {
  coords: [number, number][];
  tolerance?: number;
  highQuality?: boolean;
};

type Return = [number, number][];

/**
 * Simplifies a coordinate array using Turf.js simplify algorithm
 *
 * Used to reduce the number of points in large polygons (>5000 points)
 * to avoid performance issues with Turf.js operations like nearestPointOnLine.
 *
 * @param coords - Array of valid [lon, lat] coordinate pairs
 * @param tolerance - Simplification tolerance in degrees (default: 0.0001 ≈ 11 meters)
 * @param highQuality - Use Douglas-Peucker for higher quality (default: false for speed)
 * @returns Simplified array of coordinate pairs
 *
 * @example
 * ```typescript
 * // Large polygon with 10,000 points
 * const largePolygon = [...]; // 10,000 coordinates
 * const simplified = simplifyCoords({
 *   coords: largePolygon,
 *   tolerance: 0.0001
 * });
 * // Returns: ~500 coordinates (depends on shape complexity)
 * ```
 */
export const simplifyCoords = ({
  coords,
  tolerance = 0.0001,
  highQuality = false,
}: Args): Return => {
  const simplified = turf.simplify(turf.lineString(coords), {
    tolerance,
    highQuality,
  });
  return simplified.geometry.coordinates as [number, number][];
};
