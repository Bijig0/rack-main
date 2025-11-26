import { CoastalHazardRiskLevel, CoastalHazardZone } from "../types";

type Args = {
  zones: CoastalHazardZone[];
  isCoastal: boolean;
};

type Return = CoastalHazardRiskLevel;

/**
 * Determines the coastal hazard risk level based on proximity to hazard zones
 *
 * Risk Classification:
 * - VERY_HIGH: Property is within a coastal hazard zone
 * - HIGH: Property is within 100m of a hazard zone
 * - MODERATE: Property is within 250m of a hazard zone
 * - LOW: Property is in coastal area but outside hazard zones
 * - MINIMAL: No coastal hazard risk identified
 *
 * @param zones - Array of coastal hazard zones with distance information
 * @param isCoastal - Whether the property is in a coastal area
 * @returns Risk level classification
 *
 * @example
 * ```typescript
 * const zones = [
 *   { hazardType: "Land Subject to Inundation", affectsProperty: true, distanceMeters: undefined },
 * ];
 * const riskLevel = determineRiskLevel({ zones, isCoastal: true });
 * // Returns: "VERY_HIGH"
 * ```
 */
export const determineRiskLevel = ({ zones, isCoastal }: Args): Return => {
  const affecting = zones.filter((z) => z.affectsProperty);
  if (affecting.length > 0) return "VERY_HIGH";

  const veryNear = zones.filter(
    (z) => z.distanceMeters !== undefined && z.distanceMeters < 100
  );
  if (veryNear.length > 0) return "HIGH";

  const near = zones.filter(
    (z) => z.distanceMeters !== undefined && z.distanceMeters < 250
  );
  if (near.length > 0) return "MODERATE";

  if (isCoastal) return "LOW";

  return "MINIMAL";
};
