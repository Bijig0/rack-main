import { InferredBushfireRiskData } from "./createBushfireRiskResponseSchema/types";
import { InferredFireHistoryData } from "./createFireHistoryResponseSchema/types";
import { InferredFireManagementZone } from "./getFireManagementZones/types";

type Args = {
  bushfireProneAreas?: InferredBushfireRiskData[];
  fireHistory?: InferredFireHistoryData[];
  fireManagementZones?: InferredFireManagementZone[];
  propertyLat: number;
  propertyLon: number;
};

export type BushfireRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "EXTREME";

export type BushfireRiskAnalysis = {
  overallRisk: BushfireRiskLevel;
  riskFactors: {
    inBushfireProneArea: boolean;
    distanceToProneArea?: {
      measurement: number;
      unit: string;
    };
    historicalFiresNearby: number;
    recentFiresNearby: number; // Fires in last 10 years
    fireManagementZone?: {
      zoneTypeDescription: string;
      isWithinZone: boolean;
      distance: {
        measurement: number;
        unit: string;
      };
    };
    closestHistoricalFire?: {
      distance: {
        measurement: number;
        unit: string;
      };
      fireName?: string;
      fireSeason?: string;
      fireType?: string;
    };
  };
  summary: string;
  recommendations: string[];
};


/**
 * Analyze bushfire risk based on multiple data sources
 */
export function analyzeBushfireRisk({
  bushfireProneAreas = [],
  fireHistory = [],
  fireManagementZones = [],
  propertyLat,
  propertyLon,
}: Args): BushfireRiskAnalysis {
  // Determine if property is in a bushfire prone area
  const inBushfireProneArea = bushfireProneAreas.length > 0;

  // Get fire management zone information (optional)
  const closestZone = fireManagementZones.length > 0 ? fireManagementZones[0] : undefined;
  const inFireManagementZone = closestZone?.isWithinZone || false;

  // Count fires within different radii
  const firesWithin5km = fireHistory.filter(
    (f) => (f.distance?.measurement ?? Infinity) <= 5
  );
  const firesWithin10km = fireHistory.filter(
    (f) => (f.distance?.measurement ?? Infinity) <= 10
  );

  // Count recent fires (last 10 years - approximate)
  const currentYear = new Date().getFullYear();
  const recentFiresNearby = fireHistory.filter((f) => {
    if (!f.fireSeason) return false;
    // Parse seasons like "2023/24" or "2023"
    const seasonMatch = f.fireSeason.match(/(\d{4})/);
    if (!seasonMatch) return false;
    const year = parseInt(seasonMatch[1]);
    return year >= currentYear - 10 && (f.distance?.measurement ?? Infinity) <= 10;
  }).length;

  // Get closest historical fire
  const closestFire = fireHistory[0]; // Already sorted by distance

  // Calculate risk level
  let overallRisk: BushfireRiskLevel = "LOW";
  const riskScore = calculateRiskScore({
    inBushfireProneArea,
    inFireManagementZone,
    firesWithin5km: firesWithin5km.length,
    firesWithin10km: firesWithin10km.length,
    recentFiresNearby,
    fireManagementZoneType: closestZone?.zoneType,
  });

  if (riskScore >= 8) {
    overallRisk = "EXTREME";
  } else if (riskScore >= 5) {
    overallRisk = "HIGH";
  } else if (riskScore >= 3) {
    overallRisk = "MEDIUM";
  }

  // Generate summary
  const summary = generateSummary({
    overallRisk,
    inBushfireProneArea,
    inFireManagementZone,
    firesWithin5km: firesWithin5km.length,
    firesWithin10km: firesWithin10km.length,
    recentFiresNearby,
    fireManagementZone: closestZone,
  });

  // Generate recommendations
  const recommendations = generateRecommendations({
    overallRisk,
    inBushfireProneArea,
    inFireManagementZone,
    recentFiresNearby,
    fireManagementZone: closestZone,
  });

  return {
    overallRisk,
    riskFactors: {
      inBushfireProneArea,
      distanceToProneArea: inBushfireProneArea
        ? undefined
        : closestFire?.distance,
      historicalFiresNearby: firesWithin10km.length,
      recentFiresNearby,
      fireManagementZone: closestZone
        ? {
            zoneTypeDescription: closestZone.zoneTypeDescription,
            isWithinZone: closestZone.isWithinZone,
            distance: closestZone.distance,
          }
        : undefined,
      closestHistoricalFire: closestFire
        ? {
            distance: closestFire.distance!,
            fireName: closestFire.fireName,
            fireSeason: closestFire.fireSeason,
            fireType: closestFire.fireType,
          }
        : undefined,
    },
    summary,
    recommendations,
  };
}

function calculateRiskScore(factors: {
  inBushfireProneArea: boolean;
  inFireManagementZone: boolean;
  firesWithin5km: number;
  firesWithin10km: number;
  recentFiresNearby: number;
  fireManagementZoneType?: number;
}): number {
  let score = 0;

  // In bushfire prone area: +3 points
  if (factors.inBushfireProneArea) score += 3;

  // Fire management zone scoring based on zone type
  // Zone types: 1 = Asset Protection Zone, 2 = Bushfire Moderation Zone, 3 = Landscape Management Zone
  if (factors.inFireManagementZone) {
    if (factors.fireManagementZoneType === 1) score += 2; // Asset Protection Zone (high risk)
    else if (factors.fireManagementZoneType === 2) score += 1.5; // Bushfire Moderation Zone
    else if (factors.fireManagementZoneType === 3) score += 1; // Landscape Management Zone
    else score += 0.5; // Other zones
  }

  // Fires within 5km: +2 points per fire (max 4 points)
  score += Math.min(factors.firesWithin5km * 2, 4);

  // Recent fires nearby: +2 points per recent fire (max 3 points)
  score += Math.min(factors.recentFiresNearby * 2, 3);

  // Historical fires within 10km: +0.5 points per fire (max 2 points)
  score += Math.min(factors.firesWithin10km * 0.5, 2);

  return score;
}

function generateSummary(factors: {
  overallRisk: BushfireRiskLevel;
  inBushfireProneArea: boolean;
  inFireManagementZone: boolean;
  firesWithin5km: number;
  firesWithin10km: number;
  recentFiresNearby: number;
  fireManagementZone?: InferredFireManagementZone;
}): string {
  const parts = [];

  parts.push(`This property has a ${factors.overallRisk} bushfire risk rating.`);

  if (factors.inBushfireProneArea) {
    parts.push("The property is located within a designated bushfire prone area.");
  } else {
    parts.push("The property is not within a designated bushfire prone area.");
  }

  if (factors.fireManagementZone?.isWithinZone) {
    parts.push(
      `The property is within a ${factors.fireManagementZone.zoneTypeDescription}.`
    );
  } else if (factors.fireManagementZone) {
    parts.push(
      `The nearest fire management zone (${factors.fireManagementZone.zoneTypeDescription}) is ${factors.fireManagementZone.distance.measurement.toFixed(
        1
      )}km away.`
    );
  }

  if (factors.firesWithin5km > 0) {
    parts.push(
      `There have been ${factors.firesWithin5km} recorded fire${
        factors.firesWithin5km > 1 ? "s" : ""
      } within 5km of the property.`
    );
  }

  if (factors.recentFiresNearby > 0) {
    parts.push(
      `${factors.recentFiresNearby} fire${
        factors.recentFiresNearby > 1 ? "s" : ""
      } ha${
        factors.recentFiresNearby > 1 ? "ve" : "s"
      } occurred in the area within the last 10 years.`
    );
  }

  return parts.join(" ");
}

function generateRecommendations(factors: {
  overallRisk: BushfireRiskLevel;
  inBushfireProneArea: boolean;
  inFireManagementZone: boolean;
  recentFiresNearby: number;
  fireManagementZone?: InferredFireManagementZone;
}): string[] {
  const recommendations = [];

  if (factors.overallRisk === "EXTREME" || factors.overallRisk === "HIGH") {
    recommendations.push(
      "Develop and maintain a comprehensive bushfire survival plan"
    );
    recommendations.push(
      "Ensure property has adequate defendable space and fuel load management"
    );
    recommendations.push(
      "Install ember-proof screens on windows and vents"
    );
    recommendations.push(
      "Consider bushfire-rated construction materials for any renovations"
    );
  }

  if (factors.inBushfireProneArea) {
    recommendations.push(
      "Check building regulations for bushfire prone areas (AS 3959)"
    );
    recommendations.push(
      "Verify bushfire attack level (BAL) rating for the property"
    );
  }

  if (factors.inFireManagementZone) {
    recommendations.push(
      "Review fire management zone requirements and restrictions for the property"
    );
    if (factors.fireManagementZone?.zoneType === 1) {
      recommendations.push(
        "Asset Protection Zone: Maintain minimal fuel loads and ensure regular vegetation management"
      );
    } else if (factors.fireManagementZone?.zoneType === 3) {
      recommendations.push(
        "Landscape Management Zone: Understand fuel management objectives and seasonal restrictions"
      );
    }
  }

  if (factors.recentFiresNearby > 0) {
    recommendations.push(
      "Review CFA (Country Fire Authority) fire history and learn from recent incidents"
    );
  }

  recommendations.push(
    "Register for emergency alerts with VicEmergency"
  );
  recommendations.push(
    "Prepare an emergency evacuation kit and know evacuation routes"
  );

  if (factors.overallRisk === "LOW") {
    recommendations.push(
      "While risk is low, maintain general fire safety awareness"
    );
  }

  return recommendations;
}
