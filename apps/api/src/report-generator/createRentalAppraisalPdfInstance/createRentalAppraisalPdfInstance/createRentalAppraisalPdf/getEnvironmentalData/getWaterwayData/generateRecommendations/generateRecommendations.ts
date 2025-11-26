import { WaterwayFeature, WaterwaySignificanceLevel } from "../types";

type Args = {
  level: WaterwaySignificanceLevel;
  features: WaterwayFeature[];
};

type Return = string[];

/**
 * Generates planning and development recommendations based on waterway significance
 *
 * @param level - The determined significance level
 * @param features - Array of waterway features
 * @returns Array of recommendation strings
 *
 * @example
 * ```typescript
 * const recommendations = generateRecommendations({
 *   level: "VERY_HIGH",
 *   features: [{
 *     featureType: "Floodway",
 *     distanceMeters: 0,
 *     inBuffer: true
 *   }]
 * });
 * // Returns: ["Floodway Overlay applies - most development prohibited...", ...]
 * ```
 */
export const generateRecommendations = ({ level, features }: Args): Return => {
  const recommendations: string[] = [];
  const inBuffer = features.filter((f) => f.inBuffer);

  if (inBuffer.length > 0) {
    const hasFloodway = inBuffer.some((f) => f.featureType === "Floodway");
    const hasPAO = inBuffer.some((f) => f.featureType === "Waterway Reservation");

    if (hasFloodway) {
      recommendations.push(
        "Floodway Overlay applies - most development prohibited to protect waterway conveyance"
      );
      recommendations.push(
        "Consult with waterway management authority (e.g., Melbourne Water)"
      );
      recommendations.push(
        "Development must not increase flood risk or obstruct floodway"
      );
    }

    if (hasPAO) {
      recommendations.push(
        "Public Acquisition Overlay for waterway - land may be acquired for waterway purposes"
      );
      recommendations.push(
        "Consult with the acquiring authority before undertaking development"
      );
    }

    recommendations.push(
      "Maintain riparian vegetation and waterway buffers"
    );
    recommendations.push(
      "Implement water sensitive urban design (WSUD) principles"
    );
    recommendations.push(
      "Prevent stormwater pollution and erosion during construction"
    );
  } else if (level === "HIGH" || level === "MODERATE") {
    recommendations.push(
      "Property near waterway - implement setbacks and buffer zones"
    );
    recommendations.push(
      "Protect water quality through appropriate stormwater management"
    );
    recommendations.push(
      "Consider waterway health in landscape design"
    );
  } else {
    recommendations.push("No significant waterway constraints identified");
    recommendations.push("Standard stormwater management practices apply");
  }

  return recommendations;
};
