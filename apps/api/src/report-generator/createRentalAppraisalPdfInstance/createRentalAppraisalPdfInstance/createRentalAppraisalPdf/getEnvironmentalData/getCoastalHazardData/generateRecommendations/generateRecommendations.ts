import { CoastalHazardRiskLevel, CoastalHazardZone } from "../types";

type Args = {
  level: CoastalHazardRiskLevel;
  zones: CoastalHazardZone[];
};

type Return = string[];

/**
 * Generates recommendations based on coastal hazard risk level
 *
 * @param level - The risk level classification
 * @param zones - Array of coastal hazard zones
 * @returns Array of actionable recommendations
 *
 * @example
 * ```typescript
 * const zones = [
 *   { hazardType: "Land Subject to Inundation", affectsProperty: true, distanceMeters: undefined },
 * ];
 * const recommendations = generateRecommendations({ level: "VERY_HIGH", zones });
 * // Returns array of recommendations including permit requirements and assessments
 * ```
 */
export const generateRecommendations = ({ level, zones }: Args): Return => {
  const recommendations: string[] = [];
  const affecting = zones.filter((z) => z.affectsProperty);

  if (affecting.length > 0) {
    const hasLSIO = affecting.some((z) => z.hazardType.includes("Inundation"));
    const hasSBO = affecting.some((z) => z.hazardType.includes("Special Building"));

    if (hasLSIO) {
      recommendations.push(
        "Property subject to Land Subject to Inundation Overlay - planning permit required for most development"
      );
      recommendations.push(
        "Finished floor levels must be set above flood levels specified in the overlay schedule"
      );
      recommendations.push(
        "Obtain detailed flood and inundation assessment from qualified engineer"
      );
    }

    if (hasSBO) {
      recommendations.push(
        "Special Building Overlay applies - consult with relevant authority (e.g., Melbourne Water)"
      );
      recommendations.push(
        "Development must not increase flood risk or be subject to flood damage"
      );
    }

    recommendations.push(
      "Consider sea level rise and climate change impacts on coastal hazards"
    );
    recommendations.push(
      "Investigate coastal erosion trends and storm surge history"
    );
    recommendations.push(
      "Ensure adequate insurance coverage for coastal hazards"
    );
  } else if (level === "HIGH" || level === "MODERATE") {
    recommendations.push(
      "Property near coastal hazard zones - consider coastal processes in design"
    );
    recommendations.push(
      "Check with local council regarding coastal management plans"
    );
  } else if (level === "LOW") {
    recommendations.push(
      "Coastal property - standard coastal design considerations apply"
    );
    recommendations.push(
      "Consider salt spray, wind exposure, and coastal erosion in materials selection"
    );
  } else {
    recommendations.push("No coastal hazard constraints identified");
    recommendations.push("Property not in coastal area");
  }

  return recommendations;
};
