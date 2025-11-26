import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";
import { TransmissionLineRiskLevel } from "../types";

type Args = {
  electricityTransmissionLines: InferredTransmissionLineData[];
};

type Return = TransmissionLineRiskLevel;

/**
 * Assesses the risk associated with proximity to electricity transmission lines
 *
 * Risk is based on distance to nearest line and voltage level:
 * - VERY_HIGH: High voltage line (>220kV) within 30m
 * - HIGH: High voltage line (>220kV) within 100m OR any line within 30m
 * - MODERATE: Any line within 100m
 * - LOW: Lines between 100m-500m away
 * - MINIMAL: Lines beyond 500m away or no lines found
 *
 * High voltage lines pose greater risks due to:
 * - Stronger electromagnetic fields (EMF)
 * - Larger safety clearance requirements
 * - Greater visual impact
 * - Potential property value impact
 *
 * @param electricityTransmissionLines - Array of nearby transmission lines with distances
 * @returns TransmissionLineRiskLevel classification
 *
 * @example
 * ```typescript
 * const risk = assessTransmissionLineRisk({
 *   electricityTransmissionLines: [
 *     { distance: { measurement: 25, unit: "m" }, capacityKv: 275 }
 *   ]
 * });
 * // Returns: "VERY_HIGH"
 * ```
 */
export const assessTransmissionLineRisk = ({
  electricityTransmissionLines,
}: Args): Return => {
  if (electricityTransmissionLines.length === 0) {
    return "MINIMAL";
  }

  // Find the nearest line and its properties
  let nearestDistance = Infinity;
  let nearestLineVoltage: number | undefined;

  for (const line of electricityTransmissionLines) {
    const distanceInMeters = line.distance?.measurement;
    if (distanceInMeters !== undefined && distanceInMeters < nearestDistance) {
      nearestDistance = distanceInMeters;
      nearestLineVoltage = line.capacityKv;
    }
  }

  // If no valid distance data found
  if (nearestDistance === Infinity) {
    return "MINIMAL";
  }

  const isHighVoltage =
    nearestLineVoltage !== undefined && nearestLineVoltage > 220;

  // VERY_HIGH: High voltage line (<30m)
  if (isHighVoltage && nearestDistance < 30) {
    return "VERY_HIGH";
  }

  // HIGH: High voltage line (<100m) OR any line (<30m)
  if ((isHighVoltage && nearestDistance < 100) || nearestDistance < 30) {
    return "HIGH";
  }

  // MODERATE: Any line (<100m)
  if (nearestDistance < 100) {
    return "MODERATE";
  }

  // LOW: Lines 100m-500m away
  if (nearestDistance <= 500) {
    return "LOW";
  }

  // MINIMAL: Lines >500m away
  return "MINIMAL";
};
