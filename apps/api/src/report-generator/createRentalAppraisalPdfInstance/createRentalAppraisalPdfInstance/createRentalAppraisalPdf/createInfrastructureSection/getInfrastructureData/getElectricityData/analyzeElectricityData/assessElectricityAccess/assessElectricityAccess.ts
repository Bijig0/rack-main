import { InferredElectricityData } from "../../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { ElectricityAccessLevel } from "../types";

type Args = {
  nearbyEnergyFacilities: InferredElectricityData[];
};

type Return = ElectricityAccessLevel;

/**
 * Assesses the quality of electricity access based on nearby energy facilities
 *
 * Classification criteria:
 * - EXCELLENT: Substation within 500m OR multiple facilities within 1km
 * - GOOD: Substation within 1km OR facilities within 2km
 * - ADEQUATE: Facilities within 5km
 * - LIMITED: Facilities beyond 5km or none found
 *
 * @param nearbyEnergyFacilities - Array of nearby energy facilities with distances
 * @returns ElectricityAccessLevel classification
 *
 * @example
 * ```typescript
 * const level = assessElectricityAccess({
 *   nearbyEnergyFacilities: [
 *     { distance: 0.4, featureType: "substation" },
 *     { distance: 0.8, featureType: "power station" }
 *   ]
 * });
 * // Returns: "EXCELLENT"
 * ```
 */
export const assessElectricityAccess = ({
  nearbyEnergyFacilities,
}: Args): Return => {
  if (nearbyEnergyFacilities.length === 0) {
    return "LIMITED";
  }

  // Find substations
  const substations = nearbyEnergyFacilities.filter(
    (f) =>
      f.featureType?.toLowerCase().includes("substation") ||
      f.featureSubType?.toLowerCase().includes("substation")
  );

  // Check for nearby substations
  const nearestSubstation = substations.find((s) => s.distance !== undefined);
  const nearestSubstationDistance = nearestSubstation?.distance;

  // Check for facilities at various distances (convert km to m for comparison)
  const facilitiesWithin500m = nearbyEnergyFacilities.filter(
    (f) => f.distance !== undefined && f.distance <= 0.5
  );
  const facilitiesWithin1km = nearbyEnergyFacilities.filter(
    (f) => f.distance !== undefined && f.distance <= 1
  );
  const facilitiesWithin2km = nearbyEnergyFacilities.filter(
    (f) => f.distance !== undefined && f.distance <= 2
  );
  const facilitiesWithin5km = nearbyEnergyFacilities.filter(
    (f) => f.distance !== undefined && f.distance <= 5
  );

  // EXCELLENT: Substation <500m OR multiple facilities <1km
  if (
    (nearestSubstationDistance !== undefined &&
      nearestSubstationDistance <= 0.5) ||
    facilitiesWithin1km.length >= 2
  ) {
    return "EXCELLENT";
  }

  // GOOD: Substation <1km OR facilities <2km
  if (
    (nearestSubstationDistance !== undefined &&
      nearestSubstationDistance <= 1) ||
    facilitiesWithin2km.length >= 1
  ) {
    return "GOOD";
  }

  // ADEQUATE: Facilities <5km
  if (facilitiesWithin5km.length >= 1) {
    return "ADEQUATE";
  }

  // LIMITED: Facilities >5km
  return "LIMITED";
};
