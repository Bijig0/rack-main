import { LandslideHazardZone, LandslideRiskLevel } from "../types";

type Args = {
  level: LandslideRiskLevel;
  zones: LandslideHazardZone[];
};

type Return = string;

/**
 * Generates a human-readable description of the landslide risk
 *
 * @param level - The determined risk level
 * @param zones - Array of landslide hazard zones
 * @returns Descriptive text explaining the risk
 *
 * @example
 * ```typescript
 * const description = generateDescription({
 *   level: "VERY_HIGH",
 *   zones: [{
 *     hazardType: "Landslip",
 *     overlayCode: "LSO1",
 *     description: "Landslip area",
 *     affectsProperty: true
 *   }]
 * });
 * // Returns: "Very high landslide risk - property is within 1 landslide hazard zone(s): LSO1. Significant geotechnical constraints apply."
 * ```
 */
export const generateDescription = ({ level, zones }: Args): Return => {
  const affecting = zones.filter((z) => z.affectsProperty);

  if (level === "VERY_HIGH" && affecting.length > 0) {
    const types = affecting.map((z) => z.hazardType).join(", ");
    const codes = affecting
      .map((z) => z.overlayCode)
      .filter(Boolean)
      .join(", ");
    return `Very high landslide risk - property is within ${affecting.length} landslide hazard zone(s): ${codes || types}. Significant geotechnical constraints apply.`;
  }

  if (level === "HIGH") {
    return "High landslide risk - property is in close proximity to landslide hazard areas. Geotechnical considerations apply.";
  }

  if (level === "MODERATE") {
    return "Moderate landslide risk - property is near landslide hazard areas. Consider slope stability in development.";
  }

  return "Minimal landslide risk - no identified landslide or steep land constraints.";
};
