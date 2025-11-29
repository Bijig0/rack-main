import type {
  YVWWaterPipeFeatureCollection,
  YVWHydrantFeatureCollection,
  YVWDistributionZoneFeatureCollection,
  WaterMain,
  Hydrant,
} from "../types";

type Args = {
  propertyLat: number;
  propertyLon: number;
  waterPipes: YVWWaterPipeFeatureCollection | null;
  hydrants: YVWHydrantFeatureCollection | null;
  distributionZones: YVWDistributionZoneFeatureCollection | null;
};

type Return = {
  hasWaterConnection: boolean;
  nearestWaterMain: WaterMain | undefined;
  nearestHydrant: Hydrant | undefined;
  waterPressureZone: string | null;
};

/**
 * Haversine formula to calculate distance between two points in kilometers
 */
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

/**
 * Find closest point on a line segment to a given point
 */
const closestPointOnSegment = (
  pointLat: number,
  pointLon: number,
  segmentStart: [number, number],
  segmentEnd: [number, number]
): { lat: number; lon: number; distance: number } => {
  const [lon1, lat1] = segmentStart;
  const [lon2, lat2] = segmentEnd;

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

  // Calculate distance in kilometers
  const distanceKm = calculateDistance(
    pointLat,
    pointLon,
    closestLat,
    closestLon
  );

  return {
    lat: closestLat,
    lon: closestLon,
    distance: distanceKm * 1000, // Convert to meters
  };
};

/**
 * Find closest point on a linestring to a given point
 */
const closestPointOnLineString = (
  pointLat: number,
  pointLon: number,
  coordinates: Array<[number, number] | [number, number, number]>
): { lat: number; lon: number; distance: number } => {
  let minDistance = Infinity;
  let closestPoint = { lat: 0, lon: 0, distance: Infinity };

  // Check each segment of the linestring
  for (let i = 0; i < coordinates.length - 1; i++) {
    const coord1: [number, number] = [coordinates[i][0], coordinates[i][1]];
    const coord2: [number, number] = [
      coordinates[i + 1][0],
      coordinates[i + 1][1],
    ];

    const result = closestPointOnSegment(pointLat, pointLon, coord1, coord2);

    if (result.distance < minDistance) {
      minDistance = result.distance;
      closestPoint = result;
    }
  }

  return closestPoint;
};

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
const isPointInPolygon = (
  lat: number,
  lon: number,
  polygon: Array<[number, number] | [number, number, number]>
): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = [polygon[i][0], polygon[i][1]];
    const [xj, yj] = [polygon[j][0], polygon[j][1]];

    const intersect =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Analyzes water infrastructure access for a property
 *
 * @param propertyLat - Property latitude
 * @param propertyLon - Property longitude
 * @param waterPipes - Water pipes feature collection
 * @param hydrants - Hydrants feature collection
 * @param distributionZones - Distribution zones feature collection
 * @returns Analysis of water access
 *
 * @example
 * ```typescript
 * const analysis = analyzeWaterAccess({
 *   propertyLat: -37.8136,
 *   propertyLon: 145.0352,
 *   waterPipes: pipesData,
 *   hydrants: hydrantsData,
 *   distributionZones: zonesData
 * });
 * console.log(`Has water connection: ${analysis.hasWaterConnection}`);
 * ```
 */
export const analyzeWaterAccess = ({
  propertyLat,
  propertyLon,
  waterPipes,
  hydrants,
  distributionZones,
}: Args): Return => {
  let nearestWaterMain: WaterMain | undefined;
  let nearestHydrant: Hydrant | undefined;
  let waterPressureZone: string | null = null;

  // Analyze water pipes to find nearest main
  if (waterPipes && waterPipes.features.length > 0) {
    let minDistance = Infinity;

    for (const feature of waterPipes.features) {
      const { geometry, properties } = feature;

      let closestPoint: { lat: number; lon: number; distance: number };

      if (geometry.type === "LineString") {
        closestPoint = closestPointOnLineString(
          propertyLat,
          propertyLon,
          geometry.coordinates
        );
      } else if (geometry.type === "MultiLineString") {
        let minLineDistance = Infinity;
        closestPoint = { lat: 0, lon: 0, distance: Infinity };

        for (const lineString of geometry.coordinates) {
          const result = closestPointOnLineString(
            propertyLat,
            propertyLon,
            lineString as Array<[number, number] | [number, number, number]>
          );

          if (result.distance < minLineDistance) {
            minLineDistance = result.distance;
            closestPoint = result;
          }
        }
      } else {
        continue;
      }

      if (closestPoint.distance < minDistance) {
        minDistance = closestPoint.distance;
        nearestWaterMain = {
          distance: closestPoint.distance,
          diameter: properties.PIPE_DIAMETER || null,
          material: properties.PIPE_MATERIAL || null,
          type: properties.UNITTYPE || null,
          assetId: properties.ASSET_ID,
          serviceStatus: properties.SERVICE_STATUS || null,
          pressureZone: properties.PRESSURE_ZONE || null,
          closestPoint: {
            lat: closestPoint.lat,
            lon: closestPoint.lon,
          },
        };
      }
    }
  }

  // Analyze hydrants to find nearest
  if (hydrants && hydrants.features.length > 0) {
    let minDistance = Infinity;

    for (const feature of hydrants.features) {
      const { geometry, properties } = feature;

      if (geometry.type === "Point") {
        const [lon, lat] = geometry.coordinates;
        const distanceKm = calculateDistance(propertyLat, propertyLon, lat, lon);
        const distanceMeters = distanceKm * 1000;

        if (distanceMeters < minDistance) {
          minDistance = distanceMeters;
          nearestHydrant = {
            distance: distanceMeters,
            type: properties.HYDRANT_TYPE || null,
            serviceStatus: properties.SERVICE_STATUS || null,
            location: properties.LOCATION || null,
            assetId: properties.MXASSETNUM,
            coordinates: {
              lat,
              lon,
            },
          };
        }
      }
    }
  }

  // Determine water pressure zone
  if (distributionZones && distributionZones.features.length > 0) {
    for (const feature of distributionZones.features) {
      const { geometry, properties } = feature;

      let isInside = false;

      if (geometry.type === "Polygon") {
        // Check outer ring (first array)
        isInside = isPointInPolygon(
          propertyLat,
          propertyLon,
          geometry.coordinates[0] as Array<
            [number, number] | [number, number, number]
          >
        );
      } else if (geometry.type === "MultiPolygon") {
        // Check each polygon
        for (const polygon of geometry.coordinates) {
          if (
            isPointInPolygon(
              propertyLat,
              propertyLon,
              polygon[0] as Array<[number, number] | [number, number, number]>
            )
          ) {
            isInside = true;
            break;
          }
        }
      }

      if (isInside) {
        waterPressureZone =
          properties.PRESSURE_ZONE ||
          properties.ZONE_NAME ||
          properties.ZONE_ID ||
          null;
        break;
      }
    }
  }

  // Determine if property has water connection (threshold: 50 meters)
  const hasWaterConnection = nearestWaterMain
    ? nearestWaterMain.distance <= 50
    : false;

  return {
    hasWaterConnection,
    nearestWaterMain,
    nearestHydrant,
    waterPressureZone,
  };
};

if (import.meta.main) {
  console.log("\n=== ANALYZE WATER ACCESS TEST ===\n");

  // Mock data for testing
  const mockWaterPipes = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {
          PIPE_DIAMETER: 150,
          PIPE_MATERIAL: "PVC",
          UNITTYPE: "Water Main",
          SERVICE_STATUS: "Active",
          ASSET_ID: "PIPE001",
          PRESSURE_ZONE: "High",
        },
        geometry: {
          type: "LineString" as const,
          coordinates: [
            [145.035, -37.813] as [number, number],
            [145.036, -37.814] as [number, number],
          ],
        },
      },
    ],
  };

  const mockHydrants = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {
          MXASSETNUM: "HYDRANT001",
          HYDRANT_TYPE: "Pillar",
          SERVICE_STATUS: "Active",
        },
        geometry: {
          type: "Point" as const,
          coordinates: [145.0352, -37.8136] as [number, number],
        },
      },
    ],
  };

  const result = analyzeWaterAccess({
    propertyLat: -37.8136,
    propertyLon: 145.0352,
    waterPipes: mockWaterPipes,
    hydrants: mockHydrants,
    distributionZones: null,
  });

  console.log("=== ANALYSIS RESULTS ===\n");
  console.log(`Has Water Connection: ${result.hasWaterConnection}`);

  if (result.nearestWaterMain) {
    console.log("\nNearest Water Main:");
    console.log(`  Distance: ${result.nearestWaterMain.distance.toFixed(2)}m`);
    console.log(`  Diameter: ${result.nearestWaterMain.diameter || "N/A"}mm`);
    console.log(`  Material: ${result.nearestWaterMain.material || "N/A"}`);
    console.log(`  Type: ${result.nearestWaterMain.type || "N/A"}`);
    console.log(`  Status: ${result.nearestWaterMain.serviceStatus || "N/A"}`);
  }

  if (result.nearestHydrant) {
    console.log("\nNearest Hydrant:");
    console.log(`  Distance: ${result.nearestHydrant.distance.toFixed(2)}m`);
    console.log(`  Type: ${result.nearestHydrant.type || "N/A"}`);
    console.log(`  Status: ${result.nearestHydrant.serviceStatus || "N/A"}`);
  }

  console.log(
    `\nPressure Zone: ${result.waterPressureZone || "Unknown"}`
  );
}
