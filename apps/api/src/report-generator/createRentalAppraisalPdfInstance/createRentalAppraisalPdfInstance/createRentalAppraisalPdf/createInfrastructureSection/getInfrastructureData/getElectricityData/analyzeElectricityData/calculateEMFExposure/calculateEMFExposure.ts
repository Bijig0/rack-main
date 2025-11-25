import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";
import { EMFExposureLevel } from "../types";

type Args = {
  electricityTransmissionLines: InferredTransmissionLineData[];
};

type Return = EMFExposureLevel;

/**
 * Calculates the electromagnetic field (EMF) exposure level based on
 * transmission line voltage and distance from property
 *
 * EMF intensity decreases rapidly with distance and increases with voltage.
 * Classification based on international EMF exposure guidelines:
 *
 * - HIGH: >220kV within 50m - significant EMF exposure
 * - MODERATE: >220kV within 100m OR >66kV within 50m - moderate EMF exposure
 * - LOW: Lines 100-300m away - minimal EMF exposure
 * - NEGLIGIBLE: Lines >300m away - negligible EMF exposure
 *
 * EMF considerations:
 * - Fields decrease with the square of distance
 * - High voltage lines produce stronger fields
 * - Australian guidelines recommend caution near high voltage infrastructure
 * - May affect property suitability for sensitive uses
 *
 * @param electricityTransmissionLines - Array of nearby transmission lines
 * @returns EMFExposureLevel classification
 *
 * @example
 * ```typescript
 * const exposure = calculateEMFExposure({
 *   electricityTransmissionLines: [
 *     { distance: { measurement: 45, unit: "m" }, capacityKv: 275 }
 *   ]
 * });
 * // Returns: "HIGH"
 * ```
 */
export const calculateEMFExposure = ({
  electricityTransmissionLines,
}: Args): Return => {
  if (electricityTransmissionLines.length === 0) {
    return "NEGLIGIBLE";
  }

  // Find the line with highest EMF impact (combination of voltage and proximity)
  let maxEMFImpact = 0;
  let maxImpactDistance = Infinity;
  let maxImpactVoltage = 0;

  for (const line of electricityTransmissionLines) {
    const distance = line.distance?.measurement;
    const voltage = line.capacityKv || 0;

    if (distance !== undefined && distance > 0) {
      // EMF impact score: voltage / distance
      // Higher voltage and closer distance = higher impact
      const emfImpact = voltage / distance;

      if (emfImpact > maxEMFImpact) {
        maxEMFImpact = emfImpact;
        maxImpactDistance = distance;
        maxImpactVoltage = voltage;
      }
    }
  }

  // If no valid data found
  if (maxEMFImpact === 0 || maxImpactDistance === Infinity) {
    return "NEGLIGIBLE";
  }

  // HIGH: >220kV within 50m
  if (maxImpactVoltage > 220 && maxImpactDistance <= 50) {
    return "HIGH";
  }

  // MODERATE: >220kV within 100m OR >66kV within 50m
  if (
    (maxImpactVoltage > 220 && maxImpactDistance <= 100) ||
    (maxImpactVoltage > 66 && maxImpactDistance <= 50)
  ) {
    return "MODERATE";
  }

  // LOW: Lines 100-300m away (any voltage)
  if (maxImpactDistance <= 300) {
    return "LOW";
  }

  // NEGLIGIBLE: Lines >300m away
  return "NEGLIGIBLE";
};
