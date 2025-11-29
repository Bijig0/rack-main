import fs from "fs";
import path from "path";
import { gunzipSync } from "zlib";
import {
  InferredFireManagementZone,
  FireManagementZoneFeature,
} from "./types";

type Args = {
  lat: number;
  lon: number;
};

// Region index type
type RegionIndex = Record<string, {
  featureCount: number;
  bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number };
  filename: string;
}>;

// Haversine formula to calculate distance between two points in km
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Check if a point is inside a polygon using ray casting algorithm
const isPointInPolygon = (
  pointLat: number,
  pointLon: number,
  polygon: [number, number][]
): boolean => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [lon1, lat1] = polygon[i];
    const [lon2, lat2] = polygon[j];

    const intersect = ((lat1 > pointLat) !== (lat2 > pointLat)) &&
      (pointLon < (lon2 - lon1) * (pointLat - lat1) / (lat2 - lat1) + lon1);

    if (intersect) inside = !inside;
  }

  return inside;
};

// Find closest point on a polygon edge to a given point
const closestPointOnPolygon = (
  pointLat: number,
  pointLon: number,
  polygon: [number, number][]
): { lat: number; lon: number; distance: number } => {
  let minDistance = Infinity;
  let closestPoint = { lat: 0, lon: 0, distance: Infinity };

  // Check each edge of the polygon
  for (let i = 0; i < polygon.length - 1; i++) {
    const [lon1, lat1] = polygon[i];
    const [lon2, lat2] = polygon[i + 1];

    // Calculate the parameter t that represents the position on the line segment
    const dx = lon2 - lon1;
    const dy = lat2 - lat1;
    const lengthSquared = dx * dx + dy * dy;

    let t = 0;
    if (lengthSquared !== 0) {
      t = ((pointLon - lon1) * dx + (pointLat - lat1) * dy) / lengthSquared;
      t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
    }

    // Calculate the closest point
    const closestLon = lon1 + t * dx;
    const closestLat = lat1 + t * dy;

    // Calculate distance
    const distance = calculateDistance(pointLat, pointLon, closestLat, closestLon);

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = {
        lat: closestLat,
        lon: closestLon,
        distance,
      };
    }
  }

  return closestPoint;
};

// Process a fire management zone feature
const processFireManagementZone = (
  feature: FireManagementZoneFeature,
  propertyLat: number,
  propertyLon: number
): InferredFireManagementZone | null => {
  const { properties, geometry } = feature;

  // Extract the outer ring(s) from the geometry
  let polygons: [number, number][][] = [];

  if (geometry.type === "Polygon") {
    // For Polygon, coordinates is an array of rings (first is outer, rest are holes)
    polygons = [geometry.coordinates[0] as [number, number][]];
  } else if (geometry.type === "MultiPolygon") {
    // For MultiPolygon, each element is a Polygon (array of rings)
    polygons = geometry.coordinates.map((polygon) => polygon[0] as [number, number][]);
  }

  // Check if point is inside any of the polygons
  let isWithinZone = false;
  let minDistance = Infinity;
  let closestPoint = { lat: 0, lon: 0, distance: Infinity };

  for (const polygon of polygons) {
    if (isPointInPolygon(propertyLat, propertyLon, polygon)) {
      isWithinZone = true;
      minDistance = 0;
      break;
    }

    // If not inside, find the closest edge
    const closest = closestPointOnPolygon(propertyLat, propertyLon, polygon);
    if (closest.distance < minDistance) {
      minDistance = closest.distance;
      closestPoint = closest;
    }
  }

  return {
    regionName: properties.REGION_NAME,
    districtName: properties.DISTRICT_NAME,
    zoneType: properties.ZONETYPE,
    zoneTypeDescription: properties.X_ZONETYPE,
    distance: {
      measurement: minDistance,
      unit: "km",
    },
    isWithinZone,
  };
};

// Quick check using first coordinate of geometry as approximate location
const getApproximateCenter = (
  feature: FireManagementZoneFeature
): { lat: number; lon: number } | null => {
  const { geometry } = feature;
  try {
    if (geometry.type === "Polygon") {
      const [lon, lat] = geometry.coordinates[0][0];
      return { lat: lat as number, lon: lon as number };
    } else if (geometry.type === "MultiPolygon") {
      const [lon, lat] = geometry.coordinates[0][0][0];
      return { lat: lat as number, lon: lon as number };
    }
  } catch {
    return null;
  }
  return null;
};

// Check if a point is within or near a bounding box (with buffer)
const isPointNearBbox = (
  lat: number,
  lon: number,
  bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  bufferDegrees: number = 0.2 // ~22km buffer - reduced to avoid loading too many regions
): boolean => {
  return (
    lat >= bbox.minLat - bufferDegrees &&
    lat <= bbox.maxLat + bufferDegrees &&
    lon >= bbox.minLon - bufferDegrees &&
    lon <= bbox.maxLon + bufferDegrees
  );
};

// Find regions that could contain the property location
const findRelevantRegions = (
  lat: number,
  lon: number,
  regionIndex: RegionIndex
): string[] => {
  const relevantRegions: string[] = [];

  for (const [regionName, regionInfo] of Object.entries(regionIndex)) {
    if (isPointNearBbox(lat, lon, regionInfo.bbox)) {
      relevantRegions.push(regionName);
    }
  }

  return relevantRegions;
};

/**
 * Get fire management zones data for a property
 * Loads only relevant regional files based on property location
 */
export const getFireManagementZones = async ({
  lat,
  lon,
}: Args): Promise<InferredFireManagementZone[]> => {
  const regionsDir = path.join(__dirname, "regions");
  const indexPath = path.join(regionsDir, "region-index.json");

  // Load region index
  if (!fs.existsSync(indexPath)) {
    console.log("Region index not found, falling back to full file...");
    return loadFromFullFile(lat, lon);
  }

  const regionIndex: RegionIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

  // Find relevant regions
  const relevantRegions = findRelevantRegions(lat, lon, regionIndex);

  if (relevantRegions.length === 0) {
    console.log("No relevant fire management regions found for this location");
    return [];
  }

  console.log(`Loading fire management zones from ${relevantRegions.length} region(s): ${relevantRegions.join(", ")}`);

  const nearbyZones: InferredFireManagementZone[] = [];
  const maxDistanceKm = 100;

  // Load and process each relevant region
  for (const regionName of relevantRegions) {
    const regionInfo = regionIndex[regionName];
    const regionPath = path.join(regionsDir, regionInfo.filename);

    if (!fs.existsSync(regionPath)) {
      console.log(`Region file not found: ${regionPath}`);
      continue;
    }

    const compressedData = fs.readFileSync(regionPath);
    const rawData = gunzipSync(compressedData).toString("utf-8");
    const parsedData = JSON.parse(rawData) as {
      type: string;
      features: FireManagementZoneFeature[];
    };

    console.log(`  ${regionName}: ${parsedData.features.length} features`);

    // Process features with early distance filtering
    for (const feature of parsedData.features) {
      const center = getApproximateCenter(feature);
      if (center) {
        const approxDistance = calculateDistance(lat, lon, center.lat, center.lon);
        if (approxDistance > maxDistanceKm) {
          continue;
        }
      }

      const zone = processFireManagementZone(feature, lat, lon);
      if (zone && (zone.isWithinZone || zone.distance.measurement <= 50)) {
        nearbyZones.push(zone);
      }
    }
  }

  // Sort by distance (closest first)
  nearbyZones.sort((a, b) => {
    const distA = a.distance.measurement;
    const distB = b.distance.measurement;
    return distA - distB;
  });

  console.log(`Found ${nearbyZones.length} fire management zones within 50km`);

  return nearbyZones;
};

// Fallback to loading full file if regional files don't exist
const loadFromFullFile = async (lat: number, lon: number): Promise<InferredFireManagementZone[]> => {
  const geoJsonPath = path.join(__dirname, "fire_management_zones.geojson.gz");

  console.log(`Loading fire management zones from: ${geoJsonPath}`);

  const compressedData = fs.readFileSync(geoJsonPath);
  const rawData = gunzipSync(compressedData).toString("utf-8");

  const parsedData = JSON.parse(rawData) as {
    type: string;
    features: FireManagementZoneFeature[];
  };

  const features = parsedData.features;
  console.log(`Total fire management zones in dataset: ${features.length}`);

  const nearbyZones: InferredFireManagementZone[] = [];
  const maxDistanceKm = 100;

  for (const feature of features) {
    const center = getApproximateCenter(feature);
    if (center) {
      const approxDistance = calculateDistance(lat, lon, center.lat, center.lon);
      if (approxDistance > maxDistanceKm) {
        continue;
      }
    }

    const zone = processFireManagementZone(feature, lat, lon);
    if (zone && (zone.isWithinZone || zone.distance.measurement <= 50)) {
      nearbyZones.push(zone);
    }
  }

  nearbyZones.sort((a, b) => a.distance.measurement - b.distance.measurement);

  return nearbyZones;
};

if (import.meta.main) {
  const zones = await getFireManagementZones({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== FIRE MANAGEMENT ZONES ===");
  console.log(`Found ${zones.length} zones within 50km`);

  if (zones.length > 0) {
    console.log("\nClosest Zone:");
    console.log(`  Region: ${zones[0].regionName}`);
    console.log(`  District: ${zones[0].districtName}`);
    console.log(`  Zone Type: ${zones[0].zoneTypeDescription}`);
    console.log(`  Distance: ${zones[0].distance.measurement.toFixed(2)}${zones[0].distance.unit}`);
    console.log(`  Within Zone: ${zones[0].isWithinZone}`);

    if (zones.length > 1) {
      console.log("\nNearby Zones:");
      zones.slice(1, 6).forEach((zone, index) => {
        console.log(`\n${index + 2}. ${zone.zoneTypeDescription}`);
        console.log(`   Region: ${zone.regionName}`);
        console.log(`   District: ${zone.districtName}`);
        console.log(`   Distance: ${zone.distance.measurement.toFixed(2)}${zone.distance.unit}`);
        console.log(`   Within Zone: ${zone.isWithinZone}`);
      });
    }
  }
}
