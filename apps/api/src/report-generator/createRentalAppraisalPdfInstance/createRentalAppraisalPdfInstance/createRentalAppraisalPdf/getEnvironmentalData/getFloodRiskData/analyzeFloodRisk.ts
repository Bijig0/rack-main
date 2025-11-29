import * as turf from "@turf/turf";
import {
  FloodRiskLevel,
  FloodSource,
  Flood100YearFeatures,
  FloodHistory2022Features,
  Flood100YearFeature,
  FloodHistory2022Feature,
} from "./types";

type Args = {
  floodHistory2022Features: FloodHistory2022Features;
  flood100YearFeatures: Flood100YearFeatures;
  propertyLat: number;
  propertyLon: number;
};

type Return = {
  riskLevel: FloodRiskLevel;
  affectedByHistoricalFlood: boolean;
  within100YearFloodExtent: boolean;
  floodSources: FloodSource[];
  nearbyFloodZonesCount: number;
  minimumDistanceToFloodZone?: number;
  description: string;
  recommendations: string[];
};

/**
 * Validates that a coordinate array contains valid numbers
 */
function isValidCoordinate(coord: any): coord is [number, number] {
  return (
    Array.isArray(coord) &&
    coord.length >= 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]) &&
    isFinite(coord[0]) &&
    isFinite(coord[1])
  );
}

/**
 * Filters out invalid coordinates from a linear ring
 */
function cleanLinearRing(ring: any[]): [number, number][] {
  return ring.filter(isValidCoordinate);
}

/**
 * Filters out invalid coordinates from polygon coordinates
 */
function cleanPolygonCoordinates(coords: any[][]): [number, number][][] {
  const cleaned = coords.map(cleanLinearRing).filter((ring) => ring.length >= 4); // Polygon rings must have at least 4 points
  return cleaned;
}

/**
 * Calculates distance from property to flood feature
 * Note: For distance calculations, we simplify very large polygons and use only outer rings
 * to avoid Turf.js issues with very large geometries (>5000 points)
 */
function calculateDistance(
  floodFeature: Flood100YearFeature | FloodHistory2022Feature,
  propertyLat: number,
  propertyLon: number
): number {
  const propertyPoint = turf.point([propertyLon, propertyLat]);
  const floodGeometry = floodFeature.geometry;

  try {
    // Handle different geometry types
    if (floodGeometry.type === "Polygon") {
      const cleanedCoords = cleanPolygonCoordinates(floodGeometry.coordinates);
      if (cleanedCoords.length === 0) {
        console.warn("Polygon has no valid coordinates after cleaning");
        return Infinity;
      }

      const floodPolygon = turf.polygon(cleanedCoords);

      // Check if point is inside polygon
      if (turf.booleanPointInPolygon(propertyPoint, floodPolygon)) {
        return 0; // Property is within flood extent
      }

      // For distance calculation, only use the outer ring (first ring)
      const outerRing = cleanedCoords[0];

      // If the outer ring is very large (>5000 points), simplify it
      // to avoid Turf.js nearestPointOnLine issues
      let simplifiedRing = outerRing;
      if (outerRing.length > 5000) {
        const simplified = turf.simplify(turf.lineString(outerRing), {
          tolerance: 0.0001, // ~11 meters at this latitude
          highQuality: false,
        });
        simplifiedRing = simplified.geometry.coordinates as [number, number][];
      }

      const outerLine = turf.lineString(simplifiedRing);
      const nearestPoint = turf.nearestPointOnLine(outerLine, propertyPoint);
      return turf.distance(propertyPoint, nearestPoint, { units: "meters" });
    } else if (floodGeometry.type === "MultiPolygon") {
      let minDistance = Infinity;
      let processedPolygons = 0;

      for (let i = 0; i < floodGeometry.coordinates.length; i++) {
        const polygonCoords = floodGeometry.coordinates[i];
        const cleanedCoords = cleanPolygonCoordinates(polygonCoords);

        if (cleanedCoords.length === 0) {
          continue; // Skip polygons with no valid coordinates
        }

        processedPolygons++;

        const floodPolygon = turf.polygon(cleanedCoords);

        // Check if point is inside any polygon
        if (turf.booleanPointInPolygon(propertyPoint, floodPolygon)) {
          return 0;
        }

        // For distance calculation, only use the outer ring (first ring)
        const outerRing = cleanedCoords[0];

        // If the outer ring is very large (>5000 points), simplify it
        // to avoid Turf.js nearestPointOnLine issues
        let simplifiedRing = outerRing;
        if (outerRing.length > 5000) {
          const simplified = turf.simplify(turf.lineString(outerRing), {
            tolerance: 0.0001, // ~11 meters at this latitude
            highQuality: false,
          });
          simplifiedRing = simplified.geometry.coordinates as [number, number][];
        }

        const outerLine = turf.lineString(simplifiedRing);
        const nearestPoint = turf.nearestPointOnLine(outerLine, propertyPoint);
        const distance = turf.distance(propertyPoint, nearestPoint, {
          units: "meters",
        });
        minDistance = Math.min(minDistance, distance);
      }

      if (processedPolygons === 0) {
        console.warn(
          `⚠️  MultiPolygon had ${floodGeometry.coordinates.length} polygons but none had valid coordinates`
        );
        return Infinity;
      }

      return minDistance;
    }

    // Fallback: use centroid for other geometry types
    const floodCentroid = turf.centroid(floodGeometry as any);
    return turf.distance(propertyPoint, floodCentroid, { units: "meters" });
  } catch (error) {
    console.warn(
      `⚠️  Could not calculate distance to flood zone (data quality issue) - skipping this zone`
    );
    return Infinity;
  }
}

/**
 * Determines overall flood risk level based on proximity and extent
 */
function determineFloodRiskLevel(
  affectedByHistoricalFlood: boolean,
  within100YearFloodExtent: boolean,
  minimumDistance?: number
): FloodRiskLevel {
  // VERY HIGH: Property directly affected by historical flood
  if (affectedByHistoricalFlood) {
    return "VERY_HIGH";
  }

  // HIGH: Property within 1 in 100 year flood extent
  if (within100YearFloodExtent) {
    return "HIGH";
  }

  // MODERATE: Property near flood zones (within 100m)
  if (minimumDistance !== undefined && minimumDistance < 100) {
    return "MODERATE";
  }

  // LOW: Property near flood zones (within 500m)
  if (minimumDistance !== undefined && minimumDistance < 500) {
    return "LOW";
  }

  // MINIMAL: No identified flood risk
  return "MINIMAL";
}

/**
 * Generates human-readable description of flood risk
 */
function generateDescription(
  riskLevel: FloodRiskLevel,
  floodSources: FloodSource[],
  affectedByHistoricalFlood: boolean,
  within100YearFloodExtent: boolean
): string {
  const descriptions: Record<FloodRiskLevel, string> = {
    VERY_HIGH:
      "Very high flood risk - property was affected by the October 2022 flood event",
    HIGH: "High flood risk - property is within the 1 in 100 year flood extent",
    MODERATE:
      "Moderate flood risk - property is near identified flood-prone areas",
    LOW: "Low flood risk - property is in proximity to flood zones but outside high-risk areas",
    MINIMAL: "Minimal flood risk - no identified flood hazards in the immediate vicinity",
  };

  const baseDescription = descriptions[riskLevel];

  if (floodSources.length === 0) {
    return baseDescription;
  }

  // Add details about closest flood source
  const closestSource = floodSources[0];
  let sourceDetail = "";

  if (closestSource.affectsProperty) {
    sourceDetail = `Property is within ${closestSource.sourceName} flood extent`;
  } else {
    sourceDetail = `Nearest flood zone (${closestSource.sourceName}) is ${Math.round(closestSource.distanceMeters)}m away`;
  }

  return `${baseDescription}. ${sourceDetail}`;
}

/**
 * Generates planning and risk mitigation recommendations
 */
function generateRecommendations(
  riskLevel: FloodRiskLevel,
  affectedByHistoricalFlood: boolean,
  within100YearFloodExtent: boolean
): string[] {
  const recommendations: string[] = [];

  if (affectedByHistoricalFlood || within100YearFloodExtent) {
    recommendations.push(
      "Consult with local council regarding Land Subject to Inundation Overlay (LSIO) or Floodway Overlay (FO) requirements"
    );
    recommendations.push(
      "Building and development may require planning permits with specific flood mitigation measures"
    );
    recommendations.push(
      "Consider flood resilient building design with elevated floor levels"
    );
    recommendations.push(
      "Obtain a detailed flood study or site-specific flood assessment from a qualified professional"
    );
  }

  if (affectedByHistoricalFlood) {
    recommendations.push(
      "Review historical flood records and speak with long-term residents about flood experience"
    );
    recommendations.push(
      "Consider flood insurance and emergency preparedness planning"
    );
  }

  if (riskLevel === "MODERATE" || riskLevel === "LOW") {
    recommendations.push(
      "Check planning scheme overlays and consult with council before undertaking development"
    );
    recommendations.push(
      "Consider stormwater management and drainage in property design"
    );
  }

  if (riskLevel === "MINIMAL") {
    recommendations.push(
      "Property appears to be outside identified flood risk areas"
    );
    recommendations.push(
      "Standard drainage and stormwater management practices recommended"
    );
  }

  return recommendations;
}

/**
 * Analyzes flood risk based on multiple data sources
 */
export async function analyzeFloodRisk({
  floodHistory2022Features,
  flood100YearFeatures,
  propertyLat,
  propertyLon,
}: Args): Promise<Return> {
  console.log("\n📊 Analyzing flood risk...");

  const floodSources: FloodSource[] = [];
  let affectedByHistoricalFlood = false;
  let within100YearFloodExtent = false;

  // Analyze 2022 historical flood data
  for (const feature of floodHistory2022Features) {
    const distance = calculateDistance(feature, propertyLat, propertyLon);
    const affectsProperty = distance === 0;

    if (affectsProperty) {
      affectedByHistoricalFlood = true;
    }

    floodSources.push({
      sourceName: feature.properties.event_name || "2022 October Flood Event",
      sourceType: "Historical",
      distanceMeters: distance,
      affectsProperty,
      dataQuality: feature.properties.data_quality || "Good",
    });
  }

  // Analyze 1 in 100 year flood extent data
  for (const feature of flood100YearFeatures) {
    const distance = calculateDistance(feature, propertyLat, propertyLon);
    const affectsProperty = distance === 0;

    if (affectsProperty) {
      within100YearFloodExtent = true;
    }

    floodSources.push({
      sourceName: "1 in 100 Year Flood Extent",
      sourceType: "Modelled",
      distanceMeters: distance,
      affectsProperty,
      dataQuality: "High (Statistical Model)",
    });
  }

  // Sort by distance and filter out very distant sources
  floodSources.sort((a, b) => a.distanceMeters - b.distanceMeters);
  const relevantSources = floodSources.filter((s) => s.distanceMeters < 1000); // Within 1km

  const minimumDistanceToFloodZone =
    relevantSources.length > 0 ? relevantSources[0].distanceMeters : undefined;

  const riskLevel = determineFloodRiskLevel(
    affectedByHistoricalFlood,
    within100YearFloodExtent,
    minimumDistanceToFloodZone
  );

  const description = generateDescription(
    riskLevel,
    relevantSources,
    affectedByHistoricalFlood,
    within100YearFloodExtent
  );

  const recommendations = generateRecommendations(
    riskLevel,
    affectedByHistoricalFlood,
    within100YearFloodExtent
  );

  console.log(`✅ Flood risk analysis complete: ${riskLevel}`);
  console.log(`   Historical flood affected: ${affectedByHistoricalFlood ? "Yes" : "No"}`);
  console.log(`   Within 100-year extent: ${within100YearFloodExtent ? "Yes" : "No"}`);
  console.log(`   Nearby flood zones: ${relevantSources.length}`);

  return {
    riskLevel,
    affectedByHistoricalFlood,
    within100YearFloodExtent,
    floodSources: relevantSources.slice(0, 5), // Return top 5 sources
    nearbyFloodZonesCount: relevantSources.length,
    minimumDistanceToFloodZone,
    description,
    recommendations,
  };
}
