import { DrainageCatchment, RetardingBasin, StormwaterRiskLevel } from "../types";

type Args = {
  drainageCatchment: DrainageCatchment | undefined;
  retardingBasins: RetardingBasin[];
  lat: number;
  lon: number;
};

type Return = {
  riskLevel: StormwaterRiskLevel;
  description: string;
  recommendations: string[];
};

/**
 * Analyzes stormwater and flooding risk for a property
 *
 * Assesses risk based on multiple factors:
 * 1. Proximity to flood retarding basins (closer = better protection)
 * 2. Number of retarding basins nearby
 * 3. Total retention capacity available
 * 4. Drainage catchment characteristics
 * 5. Distance to nearest basin
 *
 * Risk Classification:
 * - LOW: Multiple basins within 1km, good capacity, well-managed catchment
 * - MODERATE: Some basins within 2km, moderate capacity
 * - HIGH: Few basins or beyond 2km, limited capacity
 * - VERY_HIGH: No basins within 3km, poor flood protection
 *
 * @param drainageCatchment - The drainage catchment the property belongs to
 * @param retardingBasins - Nearby retarding basins (sorted by distance)
 * @param lat - Property latitude
 * @param lon - Property longitude
 * @returns Risk assessment with level, description, and recommendations
 *
 * @example
 * ```typescript
 * const analysis = analyzeStormwaterRisk({
 *   drainageCatchment: { name: "Yarra", area: 4000, waterway: "Yarra River" },
 *   retardingBasins: [{ name: "Test RB", distance: 800, capacity: 125, ... }],
 *   lat: -37.8136,
 *   lon: 144.9631
 * });
 * // Returns: { riskLevel: "MODERATE", description: "...", recommendations: [...] }
 * ```
 */
export const analyzeStormwaterRisk = ({
  drainageCatchment,
  retardingBasins,
  lat,
  lon,
}: Args): Return => {
  const basinsWithin1km = retardingBasins.filter((b) => b.distance <= 1000);
  const basinsWithin2km = retardingBasins.filter((b) => b.distance <= 2000);
  const basinsWithin3km = retardingBasins.filter((b) => b.distance <= 3000);

  // Calculate total retention capacity
  const totalCapacity = retardingBasins.reduce((sum, basin) => {
    return sum + (basin.capacity || 0);
  }, 0);

  const nearestBasin = retardingBasins[0];
  const nearestDistance = nearestBasin?.distance || Infinity;

  // Determine risk level based on multiple factors
  let riskLevel: StormwaterRiskLevel;

  if (basinsWithin1km.length >= 2 || (basinsWithin1km.length >= 1 && totalCapacity >= 50)) {
    // Excellent flood protection: Multiple basins close by or good capacity
    riskLevel = "LOW";
  } else if (basinsWithin2km.length >= 1 || (basinsWithin3km.length >= 2 && totalCapacity >= 30)) {
    // Good flood protection: At least one basin reasonably close
    riskLevel = "MODERATE";
  } else if (basinsWithin3km.length >= 1 || nearestDistance <= 5000) {
    // Limited flood protection: Some infrastructure but not optimal
    riskLevel = "HIGH";
  } else {
    // Poor flood protection: No nearby retarding basins
    riskLevel = "VERY_HIGH";
  }

  // Generate description
  const description = generateDescription({
    riskLevel,
    drainageCatchment,
    retardingBasins,
    nearestBasin,
    nearestDistance,
    totalCapacity,
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
    riskLevel,
    drainageCatchment,
    retardingBasins,
    nearestBasin,
    totalCapacity,
  });

  return {
    riskLevel,
    description,
    recommendations,
  };
};

/**
 * Generates human-readable risk description
 */
function generateDescription({
  riskLevel,
  drainageCatchment,
  retardingBasins,
  nearestBasin,
  nearestDistance,
  totalCapacity,
}: {
  riskLevel: StormwaterRiskLevel;
  drainageCatchment: DrainageCatchment | undefined;
  retardingBasins: RetardingBasin[];
  nearestBasin?: RetardingBasin;
  nearestDistance: number;
  totalCapacity: number;
}): string {
  const catchmentInfo = drainageCatchment
    ? ` within the ${drainageCatchment.name} drainage catchment`
    : "";

  if (riskLevel === "LOW") {
    const capacityInfo = totalCapacity > 0
      ? ` with ${totalCapacity.toFixed(0)}ML total retention capacity`
      : "";
    return `Low stormwater risk - property${catchmentInfo} has excellent flood protection with ${retardingBasins.length} retarding basin(s) nearby${capacityInfo}. Nearest basin is ${nearestDistance}m away.`;
  }

  if (riskLevel === "MODERATE") {
    const capacityInfo = totalCapacity > 0
      ? ` providing ${totalCapacity.toFixed(0)}ML retention capacity`
      : "";
    return `Moderate stormwater risk - property${catchmentInfo} has good flood protection with ${retardingBasins.length} retarding basin(s)${capacityInfo}. Nearest basin is ${nearestDistance}m away.`;
  }

  if (riskLevel === "HIGH") {
    if (nearestBasin) {
      return `High stormwater risk - property${catchmentInfo} has limited flood protection. Nearest retarding basin (${nearestBasin.name}) is ${nearestDistance}m away. Consider flood mitigation measures.`;
    }
    return `High stormwater risk - property${catchmentInfo} has limited flood protection infrastructure in the immediate vicinity.`;
  }

  // VERY_HIGH
  if (drainageCatchment) {
    return `Very high stormwater risk - property${catchmentInfo} has minimal flood protection. No retarding basins within 3km. Property may be vulnerable to flooding during heavy rainfall events.`;
  }
  return `Very high stormwater risk - property has minimal flood protection infrastructure. No retarding basins identified within search area. Property may be vulnerable to flooding.`;
}

/**
 * Generates planning and risk mitigation recommendations
 */
function generateRecommendations({
  riskLevel,
  drainageCatchment,
  retardingBasins,
  nearestBasin,
  totalCapacity,
}: {
  riskLevel: StormwaterRiskLevel;
  drainageCatchment: DrainageCatchment | undefined;
  retardingBasins: RetardingBasin[];
  nearestBasin?: RetardingBasin;
  totalCapacity: number;
}): string[] {
  const recommendations: string[] = [];

  if (riskLevel === "LOW") {
    recommendations.push(
      "Property benefits from excellent stormwater management infrastructure"
    );
    recommendations.push(
      "Maintain property drainage systems and downpipes in good condition"
    );
    recommendations.push(
      "Consider rainwater tanks to further reduce stormwater runoff"
    );
    if (totalCapacity > 100) {
      recommendations.push(
        "Area has significant flood protection capacity - low flooding risk"
      );
    }
  }

  if (riskLevel === "MODERATE") {
    recommendations.push(
      "Property has good stormwater infrastructure but consider additional protection"
    );
    recommendations.push(
      "Ensure property has adequate stormwater drainage and guttering"
    );
    recommendations.push(
      "Consider permeable paving for driveways and outdoor areas"
    );
    recommendations.push(
      "Install rainwater tanks to reduce peak stormwater discharge"
    );
    recommendations.push(
      "Check Melbourne Water flood maps for detailed flood risk assessment"
    );
  }

  if (riskLevel === "HIGH") {
    recommendations.push(
      "Limited flood protection - implement comprehensive stormwater management"
    );
    recommendations.push(
      "Conduct detailed flood risk assessment before any development"
    );
    recommendations.push(
      "Install substantial rainwater retention systems (tanks, soakage pits)"
    );
    recommendations.push(
      "Consider raising floor levels above potential flood levels"
    );
    recommendations.push(
      "Implement permeable surfaces to reduce runoff"
    );
    recommendations.push(
      "Consult Melbourne Water and local council regarding flood overlays"
    );
    recommendations.push(
      "Consider flood insurance and check policy coverage carefully"
    );
  }

  if (riskLevel === "VERY_HIGH") {
    recommendations.push(
      "CRITICAL: Minimal flood protection - comprehensive mitigation essential"
    );
    recommendations.push(
      "Obtain professional flood risk assessment before purchase or development"
    );
    recommendations.push(
      "Check if property is within Land Subject to Inundation Overlay (LSIO)"
    );
    recommendations.push(
      "Consult Melbourne Water regarding flood risk and required floor levels"
    );
    recommendations.push(
      "Implement maximum stormwater retention (large tanks, detention systems)"
    );
    recommendations.push(
      "Design building with flood-resistant construction and elevated floor levels"
    );
    recommendations.push(
      "Install flood barriers, pumps, and emergency drainage systems"
    );
    recommendations.push(
      "Ensure comprehensive flood insurance coverage before purchase"
    );
    recommendations.push(
      "Consider if property location is suitable given flood risks"
    );
  }

  // Add catchment-specific recommendations
  if (drainageCatchment) {
    recommendations.push(
      `Property drains to ${drainageCatchment.waterway} - consult waterway management plan`
    );

    if (drainageCatchment.area > 5000) {
      recommendations.push(
        "Property in large catchment area - stormwater impacts may be significant"
      );
    }
  }

  // Add recommendations based on nearby basins
  if (retardingBasins.length > 0 && nearestBasin) {
    if (nearestBasin.owner) {
      recommendations.push(
        `Nearest retarding basin managed by ${nearestBasin.owner}`
      );
    }
  }

  return recommendations;
}
