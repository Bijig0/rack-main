import {
  InferredTransmissionLineData,
  TransmissionLineFeature,
} from "../types";

type Args = {
  features: TransmissionLineFeature[];
  propertyLat?: number;
  propertyLon?: number;
};

type Return = {
  inferredTransmissionLineData: InferredTransmissionLineData[];
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

// Get the centroid of a LineString or MultiLineString
const getLineCentroid = (coordinates: any): { lat: number; lon: number } | undefined => {
  try {
    // Handle LineString: coordinates is array of [lon, lat]
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      if (typeof coordinates[0][0] === 'number') {
        // Simple LineString
        const midIndex = Math.floor(coordinates.length / 2);
        return {
          lon: coordinates[midIndex][0],
          lat: coordinates[midIndex][1],
        };
      } else if (Array.isArray(coordinates[0])) {
        // MultiLineString - take first line's midpoint
        const firstLine = coordinates[0];
        const midIndex = Math.floor(firstLine.length / 2);
        return {
          lon: firstLine[midIndex][0],
          lat: firstLine[midIndex][1],
        };
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export function inferRawTransmissionLineData({
  features,
  propertyLat,
  propertyLon,
}: Args): Return {
  const inferredTransmissionLineData: InferredTransmissionLineData[] = features.map(
    (feature) => {
      const { properties, geometry } = feature;

      // Extract coordinates based on geometry type
      let featureLat: number | undefined;
      let featureLon: number | undefined;

      if (geometry.type === "Point") {
        featureLon = geometry.coordinates[0];
        featureLat = geometry.coordinates[1];
      } else if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
        const centroid = getLineCentroid(geometry.coordinates);
        if (centroid) {
          featureLat = centroid.lat;
          featureLon = centroid.lon;
        }
      }

      // Calculate distance from property if both coordinates are available
      let distanceKm: number | undefined;
      if (propertyLat && propertyLon && featureLat && featureLon) {
        distanceKm = calculateDistance(propertyLat, propertyLon, featureLat, featureLon);
      }

      // Extract length from properties
      const lengthMeters = numberToOptional(properties.LENGTH_M);

      return {
        id: stringToOptional(properties.GmlID || properties.OBJECTID),
        name: stringToOptional(properties.TRANSMISSIONLINE_NAME),
        description: stringToOptional(properties.DESCRIPTION),
        featureType: stringToOptional(properties.FEATURETYPE),
        class: stringToOptional(properties.CLASS),
        operationalStatus: stringToOptional(properties.OPERATIONALSTATUS),
        state: stringToOptional(properties.STATE),
        capacityKv: numberToOptional(properties.CAPACITYKV),
        length: lengthMeters !== undefined
          ? { measurement: lengthMeters, unit: "m" }
          : undefined,
        distance: distanceKm !== undefined
          ? { measurement: distanceKm, unit: "km" }
          : undefined,
        coordinates:
          featureLat !== undefined && featureLon !== undefined
            ? { lat: featureLat, lon: featureLon }
            : undefined,
      };
    }
  );

  return { inferredTransmissionLineData };
}
