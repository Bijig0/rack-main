import { LandslideHazardZone, LandslideRiskLevel } from "../types";

type Args = {
  zones: LandslideHazardZone[];
};

type Return = LandslideRiskLevel;

/**
 * Determines the landslide risk level based on proximity to hazard zones
 *
 * Risk Classification:
 * - VERY_HIGH: Property is within a landslide hazard zone
 * - HIGH: Property is within 50m of a hazard zone
 * - MODERATE: Property is within 100m of a hazard zone
 * - LOW: Property has some topographic considerations
 * - MINIMAL: No landslide risk identified
 *
 * @param zones - Array of landslide hazard zones with distance information
 * @returns Risk level classification
 *
 * @example
 * ```typescript
 * const zones = [
 *   { hazardType: "Landslip", affectsProperty: true, distanceMeters: undefined, overlayCode: "LSO1", description: "Landslip area" },
 * ];
 * const riskLevel = determineRiskLevel({ zones });
 * // Returns: "VERY_HIGH"
 * ```
 */
export const determineRiskLevel = ({ zones }: Args): Return => {
  const affecting = zones.filter((z) => z.affectsProperty);
  if (affecting.length > 0) return "VERY_HIGH";

  const veryNear = zones.filter(
    (z) => z.distanceMeters !== undefined && z.distanceMeters < 50
  );
  if (veryNear.length > 0) return "HIGH";

  const near = zones.filter(
    (z) => z.distanceMeters !== undefined && z.distanceMeters < 100
  );
  if (near.length > 0) return "MODERATE";

  return "MINIMAL";
};
