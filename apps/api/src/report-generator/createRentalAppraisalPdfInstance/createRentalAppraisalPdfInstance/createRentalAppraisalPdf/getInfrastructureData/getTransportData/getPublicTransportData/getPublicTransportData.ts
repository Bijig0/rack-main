import fs from "fs";
import path from "path";
import type { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import {
  InferredTransportStop,
  TransportLineFeature,
  TransportLinesCollectionSchema,
  TransportStopFeature,
  TransportStopsCollectionSchema,
} from "./types";

type Args = {
  address: Address;
  radiusKm?: number; // Default to 5km
};

type Return = {
  nearbyStops: InferredTransportStop[];
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

// Check if a point is within radius of another point
const isWithinRadius = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
};

// Find routes that serve a stop by checking which lines pass near it
const findRoutesForStop = (
  stop: TransportStopFeature,
  lines: TransportLineFeature[]
): string[] => {
  const routes = new Set<string>();
  const [stopLon, stopLat] = stop.geometry.coordinates;

  // Check each line to see if it passes near this stop (within 100m)
  for (const line of lines) {
    if (line.properties.MODE !== stop.properties.MODE) {
      continue; // Only match lines with same transport mode
    }

    // Check if any point on the line is within 100m of the stop
    const lineCoords = line.geometry.coordinates;
    for (const [lon, lat] of lineCoords) {
      const distanceKm = calculateDistance(stopLat, stopLon, lat, lon);
      if (distanceKm <= 0.1) {
        // 100m
        const routeName =
          line.properties.LONG_NAME ||
          line.properties.HEADSIGN ||
          line.properties.SHAPE_ID;
        routes.add(routeName);
        break; // Found a match, move to next line
      }
    }
  }

  return Array.from(routes);
};

/**
 * Get public transport stops and their routes within a given radius
 */
export const getPublicTransportData = async ({
  address,
  radiusKm = 5,
}: Args): Promise<Return> => {
  // Geocode the address
  const { lat, lon } = await geocodeAddress({ address });

  // Load and parse the GeoJSON files
  const stopsPath = path.join(__dirname, "../public_transport_stops.geojson");
  const linesPath = path.join(__dirname, "../public_transport_lines.geojson");

  const stopsData = JSON.parse(fs.readFileSync(stopsPath, "utf-8"));
  const linesData = JSON.parse(fs.readFileSync(linesPath, "utf-8"));

  const stopsCollection = TransportStopsCollectionSchema.parse(stopsData);
  const linesCollection = TransportLinesCollectionSchema.parse(linesData);

  console.log(
    `Loaded ${stopsCollection.features.length} stops and ${linesCollection.features.length} lines`
  );

  // Filter stops within radius
  const nearbyStopFeatures = stopsCollection.features.filter((stop) => {
    const [stopLon, stopLat] = stop.geometry.coordinates;
    return isWithinRadius(lat, lon, stopLat, stopLon, radiusKm);
  });

  console.log(`Found ${nearbyStopFeatures.length} stops within ${radiusKm}km`);

  // For each nearby stop, find the routes that serve it
  const nearbyStops: InferredTransportStop[] = nearbyStopFeatures.map(
    (stop) => {
      const [stopLon, stopLat] = stop.geometry.coordinates;
      const distance = calculateDistance(lat, lon, stopLat, stopLon);
      const routes = findRoutesForStop(stop, linesCollection.features);

      return {
        stopId: stop.properties.STOP_ID,
        stopName: stop.properties.STOP_NAME,
        mode: stop.properties.MODE,
        distance: {
          measurement: distance,
          unit: "km",
        },
        coordinates: {
          lat: stopLat,
          lon: stopLon,
        },
        routes: routes.length > 0 ? routes : undefined,
      };
    }
  );

  // Sort by distance
  nearbyStops.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  return { nearbyStops };
};

if (import.meta.main) {
  const { nearbyStops } = await getPublicTransportData({
    address: {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
    radiusKm: 1,
  });

  console.log("\n=== PUBLIC TRANSPORT STOPS ===");
  console.log(`Found ${nearbyStops.length} stops within 5km`);

  // Show first 10 stops
  console.log("\nClosest 10 stops:");
  nearbyStops.slice(0, 10).forEach((stop, index) => {
    console.log(`\n${index + 1}. ${stop.stopName}`);
    console.log(`   Mode: ${stop.mode}`);
    console.log(`   Distance: ${stop.distance?.measurement.toFixed(2)}km`);
    if (stop.routes && stop.routes.length > 0) {
      console.log(
        `   Routes: ${stop.routes.slice(0, 3).join(", ")}${
          stop.routes.length > 3 ? "..." : ""
        }`
      );
    }
  });

  // Write to JSON file
  const outputPath = path.join(__dirname, "nearbyTransportStops.json");
  fs.writeFileSync(outputPath, JSON.stringify(nearbyStops, null, 2));

  console.log(`\n✓ Full data written to ${outputPath}`);
}
