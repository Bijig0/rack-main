import { FireHistoryFeature, InferredFireHistoryData } from "../types";

type Args = {
  features: FireHistoryFeature[];
  propertyLat?: number;
  propertyLon?: number;
};

type Return = {
  inferredFireHistoryData: InferredFireHistoryData[];
};

const stringToOptional = (value: any): string | undefined => {
  if (value === undefined || value === null || value === "null" || value === "") {
    return undefined;
  }
  return String(value);
};

const numberToOptional = (value: any): number | undefined => {
  if (value === undefined || value === null || value === "null" || value === "") {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
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

// Get centroid of a polygon or multipolygon
const getPolygonCentroid = (geometry: any): { lat: number; lon: number } | undefined => {
  try {
    let allCoords: number[][] = [];

    if (geometry.type === "Polygon") {
      // Polygon has array of rings, use first ring (exterior)
      allCoords = geometry.coordinates[0];
    } else if (geometry.type === "MultiPolygon") {
      // MultiPolygon has array of polygons, use first polygon's first ring
      allCoords = geometry.coordinates[0][0];
    }

    if (allCoords.length === 0) return undefined;

    // Calculate centroid
    let sumLon = 0;
    let sumLat = 0;
    for (const [lon, lat] of allCoords) {
      sumLon += lon;
      sumLat += lat;
    }

    return {
      lon: sumLon / allCoords.length,
      lat: sumLat / allCoords.length,
    };
  } catch {
    return undefined;
  }
};

export function inferRawFireHistoryData({
  features,
  propertyLat,
  propertyLon,
}: Args): Return {
  const inferredFireHistoryData: InferredFireHistoryData[] = features.map(
    (feature) => {
      const { properties, geometry } = feature;

      // Get centroid of fire area
      const centroid = getPolygonCentroid(geometry);

      // Calculate distance from property if both coordinates are available
      let distanceKm: number | undefined;
      if (propertyLat && propertyLon && centroid) {
        distanceKm = calculateDistance(
          propertyLat,
          propertyLon,
          centroid.lat,
          centroid.lon
        );
      }

      const areaHa = numberToOptional(properties.area_ha);

      // Format name - trim and handle empty strings
      const name = properties.name?.trim();
      const fireName = name && name !== "" ? name : undefined;

      // Convert season number to string format
      const fireSeason = properties.season ? String(properties.season) : undefined;

      return {
        fireId: stringToOptional(properties.fire_no || properties.firekey),
        fireName,
        fireType: stringToOptional(properties.firetype || properties.treatment_type),
        fireSeason,
        ignitionDate: stringToOptional(properties.start_date),
        area: areaHa !== undefined
          ? { measurement: areaHa, unit: "ha" }
          : undefined,
        distance: distanceKm !== undefined
          ? { measurement: distanceKm, unit: "km" }
          : undefined,
        district: undefined, // Not in actual data
        region: undefined, // Not in actual data
      };
    }
  );

  return { inferredFireHistoryData };
}
