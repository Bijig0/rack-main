import { WaterwayFeature, WaterwaySignificanceLevel } from "../types";

type Args = {
  level: WaterwaySignificanceLevel;
  features: WaterwayFeature[];
};

type Return = string;

/**
 * Generates a human-readable description of the waterway significance
 *
 * @param level - The determined significance level
 * @param features - Array of waterway features
 * @returns Descriptive text explaining the waterway significance
 *
 * @example
 * ```typescript
 * const description = generateDescription({
 *   level: "VERY_HIGH",
 *   features: [{
 *     featureType: "Floodway",
 *     distanceMeters: 0,
 *     inBuffer: true
 *   }]
 * });
 * // Returns: "Very high waterway significance - property is within waterway buffer or Floodway zone..."
 * ```
 */
export const generateDescription = ({ level, features }: Args): Return => {
  const inBuffer = features.filter((f) => f.inBuffer);

  if (level === "VERY_HIGH" && inBuffer.length > 0) {
    const types = inBuffer.map((f) => f.featureType).join(", ");
    return `Very high waterway significance - property is within waterway buffer or ${types} zone. Significant waterway constraints apply.`;
  }

  if (level === "HIGH") {
    const nearest = features[0];
    return `High waterway significance - property is within ${Math.round(nearest.distanceMeters)}m of ${nearest.featureType}. Waterway setbacks and protections apply.`;
  }

  if (level === "MODERATE") {
    const nearest = features[0];
    return `Moderate waterway significance - property is ${Math.round(nearest.distanceMeters)}m from ${nearest.featureType}. Consider waterway impacts.`;
  }

  if (level === "LOW") {
    return "Low waterway significance - property has some proximity to waterways.";
  }

  return "Minimal waterway significance - no identified waterway constraints.";
};
