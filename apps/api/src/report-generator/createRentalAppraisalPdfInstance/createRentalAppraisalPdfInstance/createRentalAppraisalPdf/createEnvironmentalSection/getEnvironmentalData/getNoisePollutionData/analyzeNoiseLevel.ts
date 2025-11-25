import * as turf from "@turf/turf";
import {
  NoiseLevel,
  NoiseSource,
  RoadClassification,
  RoadFeature,
  RoadFeatures,
} from "./types";
import { TrafficSignalData } from "./getTrafficSignalData/trafficSignalTypes";

type Args = {
  roadFeatures: RoadFeatures;
  propertyLat: number;
  propertyLon: number;
  trafficData?: TrafficSignalData | null;
};

type Return = {
  noiseLevel: NoiseLevel;
  noiseSources: NoiseSource[];
  estimatedAverageNoiseLevel: number;
  trafficVolumeContribution: number;
  description: string;
};

/**
 * Classifies road type based on road name and type
 */
function classifyRoad(roadFeature: RoadFeature): RoadClassification {
  const name = (roadFeature.properties.road_name || "").toUpperCase();
  const type = (roadFeature.properties.road_type || "").toUpperCase();
  const classCode = roadFeature.properties.class_code?.toString();

  // Freeway classification
  if (
    name.includes("FREEWAY") ||
    name.includes("FWY") ||
    type.includes("FREEWAY")
  ) {
    return "FREEWAY";
  }

  // Highway classification
  if (
    name.includes("HIGHWAY") ||
    name.includes("HWY") ||
    type.includes("HIGHWAY")
  ) {
    return "HIGHWAY";
  }

  // Arterial classification
  if (
    name.includes("ARTERIAL") ||
    type.includes("ARTERIAL") ||
    classCode === "1" ||
    classCode === "2"
  ) {
    return "ARTERIAL";
  }

  // Main road classification
  if (
    name.includes("MAIN") ||
    type.includes("MAIN") ||
    name.includes("ROAD") ||
    classCode === "3"
  ) {
    return "MAIN_ROAD";
  }

  // Collector road
  if (
    type.includes("COLLECTOR") ||
    name.includes("DRIVE") ||
    name.includes("AVENUE") ||
    name.includes("BOULEVARD") ||
    classCode === "4"
  ) {
    return "COLLECTOR";
  }

  // Track
  if (type.includes("TRACK") || name.includes("TRACK")) {
    return "TRACK";
  }

  // Local street (default)
  if (
    type.includes("STREET") ||
    type.includes("PLACE") ||
    type.includes("COURT") ||
    type.includes("CLOSE")
  ) {
    return "LOCAL";
  }

  return "UNKNOWN";
}

/**
 * Estimates noise level in dB(A) based on road classification and distance
 * Reference: Australian Standard AS/NZS 2107:2016 Acoustics - Recommended design sound levels
 */
function estimateNoiseLevel(
  classification: RoadClassification,
  distanceMeters: number
): number {
  // Base noise levels at 10m (dB(A))
  const baseNoiseLevels: Record<RoadClassification, number> = {
    FREEWAY: 78,
    HIGHWAY: 75,
    ARTERIAL: 72,
    MAIN_ROAD: 68,
    COLLECTOR: 63,
    LOCAL: 55,
    SERVICE_ROAD: 52,
    TRACK: 45,
    UNKNOWN: 60,
  };

  const baseNoise = baseNoiseLevels[classification];

  // Apply distance attenuation (6 dB reduction per doubling of distance)
  const referenceDistance = 10; // meters
  const distanceRatio = Math.max(distanceMeters, 10) / referenceDistance;
  const attenuation = 6 * Math.log2(distanceRatio);

  return Math.max(baseNoise - attenuation, 35); // Minimum background noise level
}

/**
 * Calculates distance from property to road feature
 */
function calculateDistance(
  roadFeature: RoadFeature,
  propertyLat: number,
  propertyLon: number
): number {
  const propertyPoint = turf.point([propertyLon, propertyLat]);

  // Road geometry can be LineString or MultiLineString
  const roadGeometry = roadFeature.geometry;

  if (roadGeometry.type === "LineString") {
    const roadLine = turf.lineString(roadGeometry.coordinates);
    const nearestPoint = turf.nearestPointOnLine(roadLine, propertyPoint);
    return turf.distance(propertyPoint, nearestPoint, { units: "meters" });
  } else if (roadGeometry.type === "MultiLineString") {
    let minDistance = Infinity;
    for (const lineCoords of roadGeometry.coordinates) {
      const roadLine = turf.lineString(lineCoords);
      const nearestPoint = turf.nearestPointOnLine(roadLine, propertyPoint);
      const distance = turf.distance(propertyPoint, nearestPoint, {
        units: "meters",
      });
      minDistance = Math.min(minDistance, distance);
    }
    return minDistance;
  }

  // Fallback: use centroid for other geometry types
  const roadCentroid = turf.centroid(roadGeometry as any);
  return turf.distance(propertyPoint, roadCentroid, { units: "meters" });
}

/**
 * Determines overall noise level classification
 */
function determineNoiseLevel(noiseSources: NoiseSource[]): NoiseLevel {
  if (noiseSources.length === 0) {
    return "MINIMAL";
  }

  // Check for very high noise sources
  const hasFreeway = noiseSources.some(
    (s) => s.classification === "FREEWAY" && s.distanceMeters < 50
  );
  const hasHighway = noiseSources.some(
    (s) => s.classification === "HIGHWAY" && s.distanceMeters < 50
  );

  if (hasFreeway || hasHighway) {
    return "VERY_HIGH";
  }

  // Check for high noise
  const hasArterialNearby = noiseSources.some(
    (s) => s.classification === "ARTERIAL" && s.distanceMeters < 100
  );
  const hasDistantHighway = noiseSources.some(
    (s) => s.classification === "HIGHWAY" && s.distanceMeters < 200
  );

  if (hasArterialNearby || hasDistantHighway) {
    return "HIGH";
  }

  // Check for moderate noise
  const hasMainRoadNearby = noiseSources.some(
    (s) => s.classification === "MAIN_ROAD" && s.distanceMeters < 100
  );
  const hasDistantArterial = noiseSources.some(
    (s) => s.classification === "ARTERIAL" && s.distanceMeters < 300
  );

  if (hasMainRoadNearby || hasDistantArterial) {
    return "MODERATE";
  }

  // Check for low noise
  const hasCollector = noiseSources.some(
    (s) => s.classification === "COLLECTOR"
  );
  const hasDistantMainRoad = noiseSources.some(
    (s) => s.classification === "MAIN_ROAD" && s.distanceMeters > 100
  );

  if (hasCollector || hasDistantMainRoad) {
    return "LOW";
  }

  return "MINIMAL";
}

/**
 * Generates human-readable description of noise pollution
 */
function generateDescription(
  noiseLevel: NoiseLevel,
  noiseSources: NoiseSource[]
): string {
  const descriptions: Record<NoiseLevel, string> = {
    VERY_HIGH:
      "Very high noise levels expected due to proximity to major highway or freeway",
    HIGH: "High noise levels expected from nearby arterial roads or highways",
    MODERATE:
      "Moderate noise levels from nearby main roads or distant arterial roads",
    LOW: "Low noise levels with only collector roads or distant main roads nearby",
    MINIMAL: "Minimal road noise pollution - quiet residential area",
  };

  const baseDescription = descriptions[noiseLevel];

  if (noiseSources.length === 0) {
    return baseDescription;
  }

  // Add details about primary noise sources
  const primarySource = noiseSources[0];
  const sourceDetail = `Primary source: ${primarySource.roadName || "Unnamed road"} (${Math.round(primarySource.distanceMeters)}m away, ~${Math.round(primarySource.estimatedNoiseLevel)} dB(A))`;

  return `${baseDescription}. ${sourceDetail}`;
}

/**
 * Calculate traffic volume contribution to noise level
 * Based on vehicle counts from traffic signal data
 */
function calculateTrafficVolumeContribution(
  trafficData: TrafficSignalData | null | undefined
): number {
  if (!trafficData || trafficData.sites.length === 0) {
    return 0;
  }

  // Convert traffic volume to noise contribution
  // Higher volumes increase noise by logarithmic scale
  // Reference: 10 dB increase for every 10x traffic volume increase
  const avgVolume = trafficData.averageVolume;

  // Base: 1000 vehicles/day = 0 dB contribution
  // 10,000 vehicles/day = +10 dB
  // 100,000 vehicles/day = +20 dB
  if (avgVolume < 1000) {
    return 0;
  }

  const contribution = 10 * Math.log10(avgVolume / 1000);
  return Math.min(contribution, 15); // Cap at +15 dB
}

/**
 * Analyzes noise pollution based on nearby roads and traffic data
 */
export async function analyzeNoiseLevel({
  roadFeatures,
  propertyLat,
  propertyLon,
  trafficData,
}: Args): Promise<Return> {
  // Calculate noise sources
  const noiseSources: NoiseSource[] = roadFeatures
    .map((road) => {
      const classification = classifyRoad(road);
      const distanceMeters = calculateDistance(road, propertyLat, propertyLon);
      const estimatedNoiseLevel = estimateNoiseLevel(
        classification,
        distanceMeters
      );

      return {
        roadName: road.properties.road_name || "Unnamed Road",
        roadType: road.properties.road_type || "Unknown",
        classification,
        distanceMeters,
        estimatedNoiseLevel,
      };
    })
    .sort((a, b) => b.estimatedNoiseLevel - a.estimatedNoiseLevel); // Sort by noise level

  // Calculate traffic volume contribution
  const trafficVolumeContribution = calculateTrafficVolumeContribution(trafficData);

  // Calculate average noise level (energy average in dB)
  let estimatedAverageNoiseLevel = 35; // Background noise
  if (noiseSources.length > 0) {
    const energySum = noiseSources.reduce((sum, source) => {
      return sum + Math.pow(10, source.estimatedNoiseLevel / 10);
    }, 0);
    estimatedAverageNoiseLevel = 10 * Math.log10(energySum);
  }

  // Add traffic volume contribution
  if (trafficVolumeContribution > 0) {
    // Energy sum for traffic contribution
    const trafficEnergy = Math.pow(10, trafficVolumeContribution / 10);
    const totalEnergy = Math.pow(10, estimatedAverageNoiseLevel / 10) + trafficEnergy;
    estimatedAverageNoiseLevel = 10 * Math.log10(totalEnergy);
  }

  const noiseLevel = determineNoiseLevel(noiseSources);
  const description = generateDescription(noiseLevel, noiseSources);

  console.log(`✅ Noise analysis complete: ${noiseLevel}`);
  console.log(`   Average noise level: ${Math.round(estimatedAverageNoiseLevel)} dB(A)`);
  if (trafficVolumeContribution > 0) {
    console.log(`   Traffic volume contribution: +${Math.round(trafficVolumeContribution)} dB(A)`);
  }

  return {
    noiseLevel,
    noiseSources: noiseSources.slice(0, 5), // Return top 5 sources
    estimatedAverageNoiseLevel: Math.round(estimatedAverageNoiseLevel),
    trafficVolumeContribution: Math.round(trafficVolumeContribution),
    description,
  };
}
