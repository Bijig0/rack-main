type Args = {
  coords: any[];
};

type Return = [number, number][];

/**
 * Filters out invalid coordinates from a coordinate array
 *
 * Validates that each coordinate:
 * - Is an array with at least 2 elements
 * - Contains numeric values
 * - Values are not NaN
 * - Values are finite (not Infinity or -Infinity)
 *
 * @param coords - Array of coordinate pairs (potentially invalid)
 * @returns Array of valid [lon, lat] coordinate pairs
 *
 * @example
 * ```typescript
 * const coords = [
 *   [144.9631, -37.8136],
 *   [NaN, -37.8136],
 *   ["invalid", -37.8136],
 *   [144.9632, -37.8137],
 *   [Infinity, -37.8138]
 * ];
 * const valid = filterValidCoords({ coords });
 * // Returns: [[144.9631, -37.8136], [144.9632, -37.8137]]
 * ```
 */
export const filterValidCoords = ({ coords }: Args): Return => {
  return coords.filter((c: any) =>
    Array.isArray(c) &&
    c.length >= 2 &&
    typeof c[0] === "number" &&
    typeof c[1] === "number" &&
    !isNaN(c[0]) &&
    !isNaN(c[1]) &&
    isFinite(c[0]) &&
    isFinite(c[1])
  ) as [number, number][];
};
