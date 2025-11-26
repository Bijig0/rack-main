import { InferredElectricityData } from "../getElectricityTransmissionLines/createElectricityResponseSchema/types";
import { InferredTransmissionLineData } from "../getNearbyEnergyFacilitiesData/createTransmissionLinesResponseSchema/types";
import { assessElectricityAccess } from "./assessElectricityAccess/assessElectricityAccess";
import { assessTransmissionLineRisk } from "./assessTransmissionLineRisk/assessTransmissionLineRisk";
import { calculateEMFExposure } from "./calculateEMFExposure/calculateEMFExposure";
import { calculateNetworkRedundancy } from "./calculateNetworkRedundancy/calculateNetworkRedundancy";
import { ElectricityAnalysis } from "./types";

type Args = {
  nearbyEnergyFacilities: InferredElectricityData[];
  electricityTransmissionLines: InferredTransmissionLineData[];
  propertyLat: number;
  propertyLon: number;
};

type Return = ElectricityAnalysis;

/**
 * Analyzes electricity infrastructure data to provide comprehensive insights
 * about electricity access, reliability, and transmission line impacts
 *
 * This function orchestrates multiple analysis components:
 * 1. Electricity access quality (based on nearby facilities)
 * 2. Transmission line risk (based on proximity and voltage)
 * 3. EMF exposure level (electromagnetic field considerations)
 * 4. Network redundancy score (infrastructure resilience)
 * 5. Human-readable description and recommendations
 *
 * The analysis considers:
 * - Distance to substations and energy facilities
 * - Number and diversity of nearby facilities
 * - Transmission line proximity and voltage levels
 * - EMF exposure from high voltage infrastructure
 * - Network reliability and redundancy
 *
 * @param nearbyEnergyFacilities - Array of nearby energy facilities with distances
 * @param electricityTransmissionLines - Array of nearby transmission lines
 * @param propertyLat - Property latitude (for future use)
 * @param propertyLon - Property longitude (for future use)
 * @returns Comprehensive electricity infrastructure analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeElectricityData({
 *   nearbyEnergyFacilities: [
 *     { distance: 0.4, featureType: "substation", voltage: "66kV" },
 *     { distance: 0.8, featureType: "power station", voltage: "220kV" }
 *   ],
 *   electricityTransmissionLines: [
 *     { distance: { measurement: 150, unit: "m" }, capacityKv: 275 }
 *   ],
 *   propertyLat: -37.8136,
 *   propertyLon: 144.9631
 * });
 * // Returns: {
 * //   accessLevel: "EXCELLENT",
 * //   hasReliableAccess: true,
 * //   transmissionLineRisk: "LOW",
 * //   emfExposure: "LOW",
 * //   networkRedundancy: 87,
 * //   ...
 * // }
 * ```
 */
export const analyzeElectricityData = ({
  nearbyEnergyFacilities,
  electricityTransmissionLines,
  propertyLat,
  propertyLon,
}: Args): Return => {
  // Assess electricity access level
  const accessLevel = assessElectricityAccess({ nearbyEnergyFacilities });

  // Assess transmission line risk
  const transmissionLineRisk = assessTransmissionLineRisk({
    electricityTransmissionLines,
  });

  // Calculate EMF exposure
  const emfExposure = calculateEMFExposure({ electricityTransmissionLines });

  // Calculate network redundancy score
  const networkRedundancy = calculateNetworkRedundancy({
    nearbyEnergyFacilities,
    electricityTransmissionLines,
  });

  // Determine if property has reliable access
  const hasReliableAccess =
    accessLevel === "EXCELLENT" || accessLevel === "GOOD";

  // Find nearest substation
  const substations = nearbyEnergyFacilities.filter(
    (f) =>
      f.featureType?.toLowerCase().includes("substation") ||
      f.featureSubType?.toLowerCase().includes("substation")
  );
  const nearestSubstation = substations.find((s) => s.distance !== undefined);

  // Find nearest transmission line
  const linesWithDistance = electricityTransmissionLines.filter(
    (l) => l.distance?.measurement !== undefined
  );
  const sortedLines = [...linesWithDistance].sort(
    (a, b) =>
      (a.distance?.measurement || Infinity) -
      (b.distance?.measurement || Infinity)
  );
  const nearestLine = sortedLines[0];

  // Generate description
  const description = generateDescription({
    accessLevel,
    transmissionLineRisk,
    emfExposure,
    networkRedundancy,
    facilityCount: nearbyEnergyFacilities.length,
    nearestSubstation,
    nearestLine,
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
    accessLevel,
    transmissionLineRisk,
    emfExposure,
    networkRedundancy,
    nearestSubstation,
    nearestLine,
  });

  return {
    accessLevel,
    hasReliableAccess,
    nearestSubstation: nearestSubstation
      ? {
          distance: nearestSubstation.distance!,
          voltage: nearestSubstation.voltage,
          capacity: nearestSubstation.capacity,
        }
      : undefined,
    facilityCount: nearbyEnergyFacilities.length,
    transmissionLineRisk,
    nearestTransmissionLine: nearestLine
      ? {
          distance: nearestLine.distance!.measurement,
          capacityKv: nearestLine.capacityKv,
        }
      : undefined,
    emfExposure,
    networkRedundancy,
    description,
    recommendations,
  };
};

/**
 * Generates human-readable description of electricity infrastructure
 */
function generateDescription({
  accessLevel,
  transmissionLineRisk,
  emfExposure,
  networkRedundancy,
  facilityCount,
  nearestSubstation,
  nearestLine,
}: {
  accessLevel: string;
  transmissionLineRisk: string;
  emfExposure: string;
  networkRedundancy: number;
  facilityCount: number;
  nearestSubstation?: InferredElectricityData;
  nearestLine?: InferredTransmissionLineData;
}): string {
  const parts: string[] = [];

  // Access level description
  if (accessLevel === "EXCELLENT") {
    parts.push(
      `Excellent electricity access with ${facilityCount} nearby energy ${
        facilityCount === 1 ? "facility" : "facilities"
      }`
    );
  } else if (accessLevel === "GOOD") {
    parts.push(
      `Good electricity access with ${facilityCount} nearby energy ${
        facilityCount === 1 ? "facility" : "facilities"
      }`
    );
  } else if (accessLevel === "ADEQUATE") {
    parts.push(
      `Adequate electricity access with ${facilityCount} ${
        facilityCount === 1 ? "facility" : "facilities"
      } in the area`
    );
  } else {
    parts.push("Limited electricity infrastructure in the immediate area");
  }

  // Substation information
  if (nearestSubstation && nearestSubstation.distance !== undefined) {
    const distanceKm = nearestSubstation.distance;
    const distanceM = Math.round(distanceKm * 1000);
    parts.push(`Nearest substation is ${distanceM}m away`);
  }

  // Network redundancy
  if (networkRedundancy >= 80) {
    parts.push("Very high network redundancy ensures reliable power supply");
  } else if (networkRedundancy >= 60) {
    parts.push("High network redundancy provides good reliability");
  } else if (networkRedundancy >= 40) {
    parts.push("Moderate network redundancy");
  } else if (networkRedundancy >= 20) {
    parts.push("Limited network redundancy may affect reliability");
  }

  // Transmission line risk
  if (nearestLine && nearestLine.distance?.measurement !== undefined) {
    const distance = nearestLine.distance.measurement;
    const voltage = nearestLine.capacityKv;

    if (transmissionLineRisk === "VERY_HIGH" || transmissionLineRisk === "HIGH") {
      parts.push(
        `High voltage transmission line ${voltage ? `(${voltage}kV) ` : ""}at ${distance}m poses property development constraints`
      );
    } else if (transmissionLineRisk === "MODERATE") {
      parts.push(
        `Transmission line ${voltage ? `(${voltage}kV) ` : ""}at ${distance}m requires consideration for development`
      );
    } else if (transmissionLineRisk === "LOW") {
      parts.push(
        `Transmission infrastructure ${voltage ? `(${voltage}kV) ` : ""}at ${distance}m has minimal impact`
      );
    }
  }

  // EMF exposure
  if (emfExposure === "HIGH") {
    parts.push(
      "HIGH EMF exposure - property unsuitable for sensitive uses without mitigation"
    );
  } else if (emfExposure === "MODERATE") {
    parts.push("Moderate EMF exposure from nearby high voltage infrastructure");
  }

  return parts.join(". ") + ".";
}

/**
 * Generates actionable recommendations based on analysis
 */
function generateRecommendations({
  accessLevel,
  transmissionLineRisk,
  emfExposure,
  networkRedundancy,
  nearestSubstation,
  nearestLine,
}: {
  accessLevel: string;
  transmissionLineRisk: string;
  emfExposure: string;
  networkRedundancy: number;
  nearestSubstation?: InferredElectricityData;
  nearestLine?: InferredTransmissionLineData;
}): string[] {
  const recommendations: string[] = [];

  // Access level recommendations
  if (accessLevel === "EXCELLENT" || accessLevel === "GOOD") {
    recommendations.push(
      "Property has excellent access to reliable electricity infrastructure"
    );
    recommendations.push(
      "Suitable for high electricity demand uses (commercial, industrial, data centers)"
    );
  } else if (accessLevel === "ADEQUATE") {
    recommendations.push(
      "Adequate electricity infrastructure for residential and light commercial use"
    );
    recommendations.push(
      "Consult electricity distributor for high-demand developments"
    );
  } else {
    recommendations.push(
      "Limited electricity infrastructure - consult distributor before purchase"
    );
    recommendations.push(
      "May require significant infrastructure upgrades for development"
    );
    recommendations.push(
      "Consider alternative energy sources (solar, battery storage)"
    );
  }

  // Network redundancy recommendations
  if (networkRedundancy < 40) {
    recommendations.push(
      "Low network redundancy - consider backup power systems (UPS, generators)"
    );
    recommendations.push(
      "Property may experience more frequent or longer power outages"
    );
  }

  // Transmission line risk recommendations
  if (transmissionLineRisk === "VERY_HIGH") {
    recommendations.push(
      "CRITICAL: Very high voltage line proximity - mandatory easement restrictions"
    );
    recommendations.push(
      "Obtain easement documentation and building restrictions from electricity authority"
    );
    recommendations.push(
      "Property development severely constrained - building setbacks required"
    );
    recommendations.push(
      "Professional EMF assessment required before development or occupation"
    );
    recommendations.push(
      "May significantly impact property value and insurance premiums"
    );
  } else if (transmissionLineRisk === "HIGH") {
    recommendations.push(
      "High voltage transmission line nearby - check easement restrictions"
    );
    recommendations.push(
      "Consult electricity authority regarding building setbacks and height restrictions"
    );
    recommendations.push(
      "Consider EMF assessment for sensitive uses (childcare, healthcare)"
    );
    recommendations.push(
      "May affect property value and development potential"
    );
  } else if (transmissionLineRisk === "MODERATE") {
    recommendations.push(
      "Transmission line proximity requires consideration for development"
    );
    recommendations.push(
      "Check planning overlays for building restrictions"
    );
    recommendations.push("Consider visual impact and noise from transmission lines");
  }

  // EMF exposure recommendations
  if (emfExposure === "HIGH") {
    recommendations.push(
      "HIGH EMF exposure - professional assessment mandatory before development"
    );
    recommendations.push(
      "Property unsuitable for sensitive uses (childcare, schools, hospitals) without mitigation"
    );
    recommendations.push(
      "Consider EMF shielding for residential development (costly)"
    );
    recommendations.push(
      "Disclosure requirements - may affect marketability and value"
    );
  } else if (emfExposure === "MODERATE") {
    recommendations.push(
      "Moderate EMF levels - assessment recommended for sensitive uses"
    );
    recommendations.push(
      "Consider room placement away from transmission lines for habitable spaces"
    );
  } else if (emfExposure === "LOW") {
    recommendations.push("EMF exposure within normal urban background levels");
  }

  // General transmission line recommendations
  if (nearestLine && nearestLine.distance?.measurement !== undefined) {
    const distance = nearestLine.distance.measurement;
    if (distance < 100) {
      recommendations.push(
        "Obtain transmission line easement documentation and survey plans"
      );
      recommendations.push(
        "Consult with electricity distributor (Powercor, AusNet, CitiPower, United Energy)"
      );
      recommendations.push(
        "Consider impact on property aesthetics and marketability"
      );
    }
  }

  // Positive recommendations
  if (
    accessLevel === "EXCELLENT" &&
    transmissionLineRisk === "MINIMAL" &&
    networkRedundancy >= 70
  ) {
    recommendations.push(
      "Excellent electricity infrastructure with no significant constraints"
    );
    recommendations.push(
      "Property well-suited for any electricity-dependent development"
    );
  }

  return recommendations;
}
