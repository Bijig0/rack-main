import fs from "fs";
import path from "path";
import {
  InferredFireManagementZone,
  FireManagementZoneFeature,
  FireManagementZoneFeatureCollectionSchema,
} from "./types";

type Args = {
  lat: number;
  lon: number;
};

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

/**
 * Get fire management zones data for a property
 * Reads from local GeoJSON file and finds zones within radius or containing the point
 */
export const getFireManagementZones = async ({
  lat,
  lon,
}: Args): Promise<InferredFireManagementZone[]> => {
  // Load and parse the GeoJSON file
  const geoJsonPath = path.join(__dirname, "fire_management_zones.geojson");

  console.log(`Loading fire management zones from: ${geoJsonPath}`);

  const rawData = fs.readFileSync(geoJsonPath, "utf-8");
  const parsedData = JSON.parse(rawData);

  // Validate with Zod schema
  const featureCollection = FireManagementZoneFeatureCollectionSchema.parse(parsedData);

  console.log(`Total fire management zones in dataset: ${featureCollection.features.length}`);

  // Process all features and calculate distances
  const allZones = featureCollection.features
    .map((feature) => processFireManagementZone(feature, lat, lon))
    .filter((zone): zone is InferredFireManagementZone => zone !== null);

  // Filter zones within reasonable radius (50km) or containing the point
  const nearbyZones = allZones.filter(
    (zone) => zone.isWithinZone || zone.distance.measurement <= 50
  );

  // Sort by distance (closest first)
  nearbyZones.sort((a, b) => {
    const distA = a.distance.measurement;
    const distB = b.distance.measurement;
    return distA - distB;
  });

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
