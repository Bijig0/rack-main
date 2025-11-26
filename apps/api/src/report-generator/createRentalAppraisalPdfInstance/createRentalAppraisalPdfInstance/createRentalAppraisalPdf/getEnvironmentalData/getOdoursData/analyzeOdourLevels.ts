import { InferredOdoursData } from "./types";
import { InferredWastewaterData } from "./createWastewaterResponseSchema/types";
import { InferredEpaLicenceData } from "./getEpaLicensedPremises";

type Args = {
  landfills: InferredOdoursData[];
  wasteWaterPlants: InferredWastewaterData[];
  industrialFacilities: InferredEpaLicenceData[];
  propertyLat: number;
  propertyLon: number;
};

export type OdourLevel = "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";

export type OdourLevelAnalysis = {
  overallLevel: OdourLevel;
  odourSources: {
    closestLandfill?: {
      distance: {
        measurement: number;
        unit: string;
      };
      name: string;
      status: string;
    };
    closestWastewaterPlant?: {
      distance: {
        measurement: number;
        unit: string;
      };
      name: string;
      operator?: string;
    };
    closestIndustrialFacility?: {
      distance: {
        measurement: number;
        unit: string;
      };
      name: string;
      activity: string;
    };
    landfillsWithin10km: number;
    wastewaterPlantsWithin10km: number;
    industrialFacilitiesWithin5km: number;
  };
  summary: string;
  considerations: string[];
};

/**
 * Analyze odour levels based on proximity to odour-emitting sources
 * This assesses how odorous a location is, not risk factors
 */
export function analyzeOdourLevels({
  landfills,
  wasteWaterPlants,
  industrialFacilities,
  propertyLat,
  propertyLon,
}: Args): OdourLevelAnalysis {
  // Get closest sources
  const closestLandfill = landfills[0]; // Already sorted by distance
  const closestWastewaterPlant = wasteWaterPlants[0];
  const closestIndustrialFacility = industrialFacilities[0];

  // Count sources within different radii
  const landfillsWithin10km = landfills.filter(
    (l) => (l.distance?.measurement ?? Infinity) <= 10
  ).length;

  const wastewaterPlantsWithin10km = wasteWaterPlants.filter(
    (w) => (w.distance?.measurement ?? Infinity) <= 10
  ).length;

  const industrialFacilitiesWithin5km = industrialFacilities.filter(
    (f) => (f.distance?.measurement ?? Infinity) <= 5
  ).length;

  // Calculate odour intensity score
  const odourScore = calculateOdourIntensityScore({
    closestLandfillDistance: closestLandfill?.distance?.measurement,
    closestWastewaterDistance: closestWastewaterPlant?.distance?.measurement,
    landfillsWithin10km,
    wastewaterPlantsWithin10km,
    industrialFacilitiesWithin5km,
  });

  let overallLevel: OdourLevel = "MINIMAL";
  if (odourScore >= 7) {
    overallLevel = "VERY_HIGH";
  } else if (odourScore >= 5) {
    overallLevel = "HIGH";
  } else if (odourScore >= 3) {
    overallLevel = "MODERATE";
  } else if (odourScore >= 1) {
    overallLevel = "LOW";
  }

  // Generate summary
  const summary = generateOdourSummary({
    overallLevel,
    closestLandfill,
    closestWastewaterPlant,
    closestIndustrialFacility,
    landfillsWithin10km,
    wastewaterPlantsWithin10km,
    industrialFacilitiesWithin5km,
  });

  // Generate considerations
  const considerations = generateOdourConsiderations({
    overallLevel,
    closestLandfillDistance: closestLandfill?.distance?.measurement,
    closestWastewaterDistance: closestWastewaterPlant?.distance?.measurement,
  });

  return {
    overallLevel,
    odourSources: {
      closestLandfill: closestLandfill
        ? {
            distance: closestLandfill.distance!,
            name: closestLandfill.siteName || "Unknown landfill",
            status: closestLandfill.status || "Unknown",
          }
        : undefined,
      closestWastewaterPlant: closestWastewaterPlant
        ? {
            distance: closestWastewaterPlant.distance!,
            name: closestWastewaterPlant.facilityName || "Unknown facility",
            operator: closestWastewaterPlant.operator,
          }
        : undefined,
      closestIndustrialFacility: closestIndustrialFacility
        ? {
            distance: closestIndustrialFacility.distance!,
            name: closestIndustrialFacility.facilityName,
            activity: closestIndustrialFacility.activity,
          }
        : undefined,
      landfillsWithin10km,
      wastewaterPlantsWithin10km,
      industrialFacilitiesWithin5km,
    },
    summary,
    considerations,
  };
}

function calculateOdourIntensityScore(factors: {
  closestLandfillDistance?: number;
  closestWastewaterDistance?: number;
  landfillsWithin10km: number;
  wastewaterPlantsWithin10km: number;
  industrialFacilitiesWithin5km: number;
}): number {
  let score = 0;

  // Closest landfill scoring - based on typical odour dispersion distances
  if (factors.closestLandfillDistance) {
    if (factors.closestLandfillDistance <= 2) score += 5; // Very close - strong odour likely
    else if (factors.closestLandfillDistance <= 5) score += 3; // Moderate distance - odour probable
    else if (factors.closestLandfillDistance <= 10) score += 2; // Some distance - occasional odour
    else score += 1; // Far - minimal odour impact
  }

  // Closest wastewater plant scoring
  if (factors.closestWastewaterDistance) {
    if (factors.closestWastewaterDistance <= 2) score += 4; // Very close - odour likely
    else if (factors.closestWastewaterDistance <= 5) score += 2; // Moderate distance
    else if (factors.closestWastewaterDistance <= 10) score += 1; // Some distance
  }

  // Multiple sources increase overall odour intensity
  score += Math.min(factors.landfillsWithin10km * 0.5, 2);
  score += Math.min(factors.wastewaterPlantsWithin10km * 0.5, 2);
  score += factors.industrialFacilitiesWithin5km;

  return score;
}

function generateOdourSummary(factors: {
  overallLevel: OdourLevel;
  closestLandfill?: InferredOdoursData;
  closestWastewaterPlant?: InferredWastewaterData;
  closestIndustrialFacility?: InferredEpaLicenceData;
  landfillsWithin10km: number;
  wastewaterPlantsWithin10km: number;
  industrialFacilitiesWithin5km: number;
}): string {
  const parts = [];

  const levelDescriptions = {
    MINIMAL: "minimal odour levels",
    LOW: "low odour levels",
    MODERATE: "moderate odour levels",
    HIGH: "high odour levels",
    VERY_HIGH: "very high odour levels",
  };

  parts.push(`This location has ${levelDescriptions[factors.overallLevel]}.`);

  if (factors.closestLandfill) {
    const dist = factors.closestLandfill.distance!.measurement;
    parts.push(
      `The nearest landfill (${factors.closestLandfill.siteName || "Unknown"}) is ${dist.toFixed(
        1
      )}km away.`
    );

    if (dist <= 2) {
      parts.push(
        "At this distance, odour from the landfill may be noticeable, especially on hot days or with certain wind conditions."
      );
    } else if (dist <= 5) {
      parts.push("Occasional odour from the landfill may be detected under certain wind conditions.");
    }
  }

  if (factors.closestWastewaterPlant) {
    const dist = factors.closestWastewaterPlant.distance!.measurement;
    parts.push(
      `The nearest wastewater treatment plant is ${dist.toFixed(1)}km away.`
    );

    if (dist <= 2) {
      parts.push("Odour from wastewater treatment may occasionally be noticeable.");
    }
  }

  if (factors.closestIndustrialFacility) {
    const dist = factors.closestIndustrialFacility.distance!.measurement;
    parts.push(
      `The nearest odour-emitting industrial facility is ${dist.toFixed(1)}km away (${factors.closestIndustrialFacility.activity}).`
    );
  }

  if (factors.landfillsWithin10km > 1) {
    parts.push(
      `There are ${factors.landfillsWithin10km} landfills within 10km of the property.`
    );
  }

  if (factors.industrialFacilitiesWithin5km > 0) {
    parts.push(
      `There are ${factors.industrialFacilitiesWithin5km} odour-emitting industrial facilities within 5km.`
    );
  }

  if (!factors.closestLandfill && !factors.closestWastewaterPlant && !factors.closestIndustrialFacility) {
    parts.push("No significant odour sources were identified nearby.");
  }

  return parts.join(" ");
}

function generateOdourConsiderations(factors: {
  overallLevel: OdourLevel;
  closestLandfillDistance?: number;
  closestWastewaterDistance?: number;
}): string[] {
  const considerations = [];

  if (factors.overallLevel === "VERY_HIGH" || factors.overallLevel === "HIGH") {
    considerations.push(
      "Consider the property's location relative to prevailing winds"
    );
    considerations.push(
      "Visit the property on different days and times, especially during hot weather"
    );
    considerations.push(
      "Speak with neighbors about their experience with odours"
    );
    considerations.push(
      "Check EPA Victoria records for odour complaints in the area"
    );
  }

  if (
    factors.closestLandfillDistance &&
    factors.closestLandfillDistance <= 5
  ) {
    considerations.push(
      "Review the landfill's operating hours and EPA license conditions"
    );
    considerations.push(
      "Check if the landfill has an odour management plan"
    );
    considerations.push(
      "Consider air conditioning to minimize the need to open windows"
    );
  }

  if (
    factors.closestWastewaterDistance &&
    factors.closestWastewaterDistance <= 5
  ) {
    considerations.push(
      "Review the wastewater treatment plant's odour management practices"
    );
    considerations.push(
      "Check EPA Victoria for any complaints or enforcement actions"
    );
  }

  if (factors.overallLevel === "MODERATE" || factors.overallLevel === "LOW") {
    considerations.push(
      "Be aware that odour intensity can vary seasonally"
    );
    considerations.push(
      "Hot, still days can increase odour intensity from distant sources"
    );
  }

  if (factors.overallLevel === "MINIMAL") {
    considerations.push(
      "Odour sources are distant - minimal impact expected"
    );
  }

  considerations.push(
    "Visit EPA Victoria's website for information on odour management in your area"
  );

  return considerations;
}
