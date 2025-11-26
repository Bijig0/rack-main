import { CoastalHazardRiskLevel, CoastalHazardZone } from "../types";

type Args = {
  level: CoastalHazardRiskLevel;
  zones: CoastalHazardZone[];
};

type Return = string;

/**
 * Generates a human-readable description of coastal hazard risk
 *
 * @param level - The risk level classification
 * @param zones - Array of coastal hazard zones
 * @returns A description explaining the coastal hazard situation
 *
 * @example
 * ```typescript
 * const zones = [
 *   { hazardType: "Land Subject to Inundation", affectsProperty: true, distanceMeters: undefined },
 * ];
 * const description = generateDescription({ level: "VERY_HIGH", zones });
 * // Returns: "Very high coastal hazard risk - property is within 1 coastal hazard zone(s): Land Subject to Inundation. Development subject to coastal hazard controls."
 * ```
 */
export const generateDescription = ({ level, zones }: Args): Return => {
  const affecting = zones.filter((z) => z.affectsProperty);

  if (level === "VERY_HIGH" && affecting.length > 0) {
    const types = affecting.map((z) => z.hazardType).join(", ");
    return `Very high coastal hazard risk - property is within ${affecting.length} coastal hazard zone(s): ${types}. Development subject to coastal hazard controls.`;
  }

  if (level === "HIGH") {
    return "High coastal hazard risk - property is in close proximity to coastal hazard zones. Consider coastal processes in development.";
  }

  if (level === "MODERATE") {
    return "Moderate coastal hazard risk - property is near coastal hazard areas. Coastal considerations apply.";
  }

  if (level === "LOW") {
    return "Low coastal hazard risk - property is in coastal area but outside identified hazard zones.";
  }

  return "Minimal coastal hazard risk - property not in coastal area.";
};
