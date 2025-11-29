import z from "zod";
import { ElectricityFeature, InferredElectricityData } from "../types";

type Args = {
  features: ElectricityFeature[];
  propertyLat?: number;
  propertyLon?: number;
};

type Return = {
  inferredElectricityData: InferredElectricityData[];
};

const stringToOptional = (value: any): string | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return String(value);
};

// Helper function to calculate distance between two coordinates
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

export function inferRawElectricityData({
  features,
  propertyLat,
  propertyLon,
}: Args): Return {
  const inferredElectricityData = features.map((feature) => {
    const { properties, geometry } = feature;

    // Extract coordinates from geometry
    let featureLat: number | undefined;
    let featureLon: number | undefined;

    if (geometry.type === "Point") {
      featureLon = geometry.coordinates[0];
      featureLat = geometry.coordinates[1];
    } else if (geometry.type === "Polygon" && geometry.coordinates[0]?.length > 0) {
      // Use first coordinate of polygon as reference point
      featureLon = geometry.coordinates[0][0][0];
      featureLat = geometry.coordinates[0][0][1];
    }

    // Calculate distance if property coordinates are provided
    let distance: number | undefined;
    if (
      propertyLat !== undefined &&
      propertyLon !== undefined &&
      featureLat !== undefined &&
      featureLon !== undefined
    ) {
      distance = calculateDistance(propertyLat, propertyLon, featureLat, featureLon);
    }

    const assetId = stringToOptional(properties.asset_id || properties.pfi);
    const featureType = stringToOptional(properties.feature_type);
    const featureSubType = stringToOptional(properties.feature_sub_type);
    const voltage = stringToOptional(properties.voltage);
    const capacity = stringToOptional(properties.capacity);
    const owner = stringToOptional(properties.owner);
    const status = stringToOptional(properties.status);

    return {
      assetId,
      featureType,
      featureSubType,
      voltage,
      capacity,
      owner,
      status,
      distance,
      coordinates:
        featureLat !== undefined && featureLon !== undefined
          ? { lat: featureLat, lon: featureLon }
          : undefined,
    } satisfies InferredElectricityData;
  });

  return {
    inferredElectricityData,
  };
}
