import { InferredWastewaterData, WastewaterFeature } from "../types";

type Args = {
  features: WastewaterFeature[];
  propertyLat: number;
  propertyLon: number;
};

type Return = {
  inferredWastewaterData: InferredWastewaterData[];
};

const stringToOptional = (value: any): string | undefined => {
  if (value === undefined || value === null || value === "null" || value === "") {
    return undefined;
  }
  return String(value);
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

export function inferRawWastewaterData({
  features,
  propertyLat,
  propertyLon,
}: Args): Return {
  const inferredWastewaterData: InferredWastewaterData[] = features.map(
    (feature) => {
      const { properties, geometry } = feature;

      const [lon, lat] = geometry.coordinates;

      // Calculate distance from property
      const distanceKm = calculateDistance(
        propertyLat,
        propertyLon,
        lat,
        lon
      );

      return {
        facilityName: stringToOptional(properties.facility_name),
        facilityType: stringToOptional(properties.facility_type),
        operator: stringToOptional(properties.operator),
        capacity: stringToOptional(properties.capacity),
        status: stringToOptional(properties.status),
        state: stringToOptional(properties.state),
        distance: {
          measurement: distanceKm,
          unit: "km",
        },
        coordinates: {
          lat,
          lon,
        },
      };
    }
  );

  return { inferredWastewaterData };
}
