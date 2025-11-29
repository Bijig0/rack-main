import { WaterwayFeature, WaterwaySignificanceLevel } from "../types";

type Args = {
  features: WaterwayFeature[];
  inBuffer: boolean;
};

type Return = WaterwaySignificanceLevel;

/**
 * Determines the waterway significance level based on proximity to waterways
 *
 * Significance Classification:
 * - VERY_HIGH: Property is within waterway buffer
 * - HIGH: Property is within 50m of a waterway
 * - MODERATE: Property is within 100m of a waterway
 * - LOW: Property is within 200m of a waterway
 * - MINIMAL: No waterway constraints identified
 *
 * @param features - Array of waterway features with distance information
 * @param inBuffer - Whether the property is within a waterway buffer
 * @returns Significance level classification
 *
 * @example
 * ```typescript
 * const features = [
 *   { featureType: "Floodway", distanceMeters: 0, inBuffer: true },
 * ];
 * const level = determineSignificanceLevel({ features, inBuffer: true });
 * // Returns: "VERY_HIGH"
 * ```
 */
export const determineSignificanceLevel = ({
  features,
  inBuffer,
}: Args): Return => {
  if (inBuffer) return "VERY_HIGH";

  if (features.length > 0) {
    const minDistance = features[0].distanceMeters;
    if (minDistance < 50) return "HIGH";
    if (minDistance < 100) return "MODERATE";
    if (minDistance < 200) return "LOW";
  }

  return "MINIMAL";
};
