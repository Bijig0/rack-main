import { LandslideHazardZone, LandslideRiskLevel } from "../types";

type Args = {
  level: LandslideRiskLevel;
  zones: LandslideHazardZone[];
};

type Return = string[];

/**
 * Generates planning and development recommendations based on landslide risk
 *
 * @param level - The determined risk level
 * @param zones - Array of landslide hazard zones
 * @returns Array of recommendation strings
 *
 * @example
 * ```typescript
 * const recommendations = generateRecommendations({
 *   level: "VERY_HIGH",
 *   zones: [{
 *     hazardType: "Landslip",
 *     overlayCode: "LSO1",
 *     description: "Landslip area",
 *     affectsProperty: true
 *   }]
 * });
 * // Returns: ["Landslip Overlay applies - planning permit required for most development", ...]
 * ```
 */
export const generateRecommendations = ({ level, zones }: Args): Return => {
  const recommendations: string[] = [];
  const affecting = zones.filter((z) => z.affectsProperty);

  if (affecting.length > 0) {
    const hasLSO = affecting.some((z) => z.hazardType === "Landslip");
    const hasEMO = affecting.some(
      (z) => z.hazardType === "Erosion Management"
    );

    if (hasLSO) {
      recommendations.push(
        "Landslip Overlay applies - planning permit required for most development"
      );
      recommendations.push(
        "Geotechnical report required demonstrating slope stability and landslip risk mitigation"
      );
      recommendations.push(
        "Development must not increase landslip risk on or off site"
      );
    }

    if (hasEMO) {
      recommendations.push(
        "Erosion Management Overlay applies - erosion control measures required"
      );
      recommendations.push(
        "Prepare erosion and sediment control plan for construction"
      );
    }

    recommendations.push(
      "Engage qualified geotechnical engineer for site assessment"
    );
    recommendations.push(
      "Consider slope stability in foundation design and drainage"
    );
    recommendations.push(
      "Implement measures to prevent soil erosion and manage stormwater"
    );
    recommendations.push("Maintain vegetation on slopes to prevent erosion");
    recommendations.push(
      "Avoid cut and fill operations that could destabilize slopes"
    );
  } else if (level === "HIGH" || level === "MODERATE") {
    recommendations.push(
      "Property near landslide hazard areas - obtain geotechnical advice"
    );
    recommendations.push("Assess slope stability and erosion potential");
    recommendations.push("Design drainage to prevent slope saturation");
  } else {
    recommendations.push(
      "No significant landslide or steep land constraints identified"
    );
    recommendations.push("Standard foundation and drainage practices apply");
  }

  return recommendations;
};
