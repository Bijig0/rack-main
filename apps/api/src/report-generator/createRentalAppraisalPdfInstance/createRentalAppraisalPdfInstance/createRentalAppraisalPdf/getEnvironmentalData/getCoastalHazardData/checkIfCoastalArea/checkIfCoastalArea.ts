type Args = {
  lat: number;
  lon: number;
};

type Return = boolean;

/**
 * Checks if a location is in a coastal area of Victoria
 *
 * Uses simplified heuristics based on known coastal regions in Victoria:
 * - Port Phillip Bay: lat -38.5 to -37.5, lon 144.5 to 145.5
 * - Western Coast: lat -38.7 to -38.0, lon 141.5 to 143.5
 * - Eastern Coast (Gippsland): lat -39.0 to -37.5, lon 145.5 to 148.5
 *
 * Note: This is a simplified check. A proper implementation would use
 * detailed coastline data from Marine and Coastal Act datasets.
 *
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @returns true if location is in a coastal area, false otherwise
 *
 * @example
 * ```typescript
 * const isCoastal = checkIfCoastalArea({ lat: -37.8406, lon: 144.9631 }); // Melbourne CBD
 * // Returns: true (Port Phillip Bay area)
 * ```
 */
export const checkIfCoastalArea = ({ lat, lon }: Args): Return => {
  // Port Phillip Bay
  const isPortPhillip = lat >= -38.5 && lat <= -37.5 && lon >= 144.5 && lon <= 145.5;

  // Western Coast
  const isWesternCoast = lat >= -38.7 && lat <= -38.0 && lon >= 141.5 && lon <= 143.5;

  // Eastern Coast (Gippsland)
  const isEasternCoast = lat >= -39.0 && lat <= -37.5 && lon >= 145.5 && lon <= 148.5;

  return isPortPhillip || isWesternCoast || isEasternCoast;
};
