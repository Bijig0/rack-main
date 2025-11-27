import crypto from "crypto";
import { PTV_DEV_ID, PTV_DEV_KEY } from "../../../../../../../shared/config";
import type { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { InferredTransportStop } from "./types";

// PTV API Configuration
const PTV_BASE_URL = "https://timetableapi.ptv.vic.gov.au";

type Args = {
  address: Address;
  radiusKm?: number; // Default to 1km
  maxResults?: number; // Default to 30
};

type Return = {
  nearbyStops: InferredTransportStop[];
};

// Route types in PTV API
const ROUTE_TYPE_MAP: Record<number, string> = {
  0: "METRO TRAIN",
  1: "METRO TRAM",
  2: "METRO BUS",
  3: "REGIONAL TRAIN",
  4: "REGIONAL BUS",
};

// PTV API Response types
interface PTVStop {
  stop_distance: number;
  stop_suburb: string;
  stop_name: string;
  stop_id: number;
  route_type: number;
  stop_latitude: number;
  stop_longitude: number;
  stop_landmark?: string;
  stop_sequence?: number;
}

interface PTVStopsResponse {
  stops: PTVStop[];
  status: {
    version: string;
    health: number;
  };
}

/**
 * Generate HMAC-SHA1 signature for PTV API authentication
 * The signature is calculated from the request path (including devid) and the developer key
 */
const generateSignature = (request: string): string => {
  const hmac = crypto.createHmac("sha1", PTV_DEV_KEY);
  hmac.update(request);
  return hmac.digest("hex").toUpperCase();
};

/**
 * Build authenticated PTV API URL
 */
const buildPTVUrl = (
  path: string,
  params: Record<string, string | number> = {}
): string => {
  // Add devid to params
  const allParams = { ...params, devid: PTV_DEV_ID };

  // Build query string
  const queryString = Object.entries(allParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  // The request for signature calculation starts from /v3
  const request = `${path}?${queryString}`;

  // Generate signature
  const signature = generateSignature(request);

  // Return full URL with signature
  return `${PTV_BASE_URL}${request}&signature=${signature}`;
};

/**
 * Fetch stops near a location from PTV API
 */
const fetchStopsNearLocation = async (
  lat: number,
  lon: number,
  maxDistanceMeters: number,
  maxResults: number
): Promise<PTVStop[]> => {
  const path = `/v3/stops/location/${lat},${lon}`;
  const url = buildPTVUrl(path, {
    max_distance: maxDistanceMeters,
    max_results: maxResults,
  });

  console.log(`Fetching stops from PTV API...`);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`PTV API error: ${response.status} - ${errorText}`);
    throw new Error(`PTV API request failed: ${response.status}`);
  }

  const data: PTVStopsResponse = await response.json();

  if (data.status?.health !== 1) {
    console.warn(`PTV API health status: ${data.status?.health}`);
  }

  return data.stops || [];
};

/**
 * Get public transport stops near an address using PTV API
 * This replaces the previous GeoJSON file-based approach with live API data
 */
export const getPublicTransportData = async ({
  address,
  radiusKm = 1,
  maxResults = 30,
}: Args): Promise<Return> => {
  // Geocode the address
  const { lat, lon } = await geocodeAddress({ address });

  // Convert radius to meters for API
  const maxDistanceMeters = Math.round(radiusKm * 1000);

  console.log(
    `Searching for public transport stops within ${radiusKm}km of ${address.addressLine}, ${address.suburb}...`
  );

  try {
    // Fetch stops from PTV API
    const ptvStops = await fetchStopsNearLocation(
      lat,
      lon,
      maxDistanceMeters,
      maxResults
    );

    console.log(`Found ${ptvStops.length} stops from PTV API`);

    // Transform PTV stops to our internal format
    const nearbyStops: InferredTransportStop[] = ptvStops.map((stop) => {
      // Calculate actual distance (PTV returns distance in meters)
      const distanceKm = stop.stop_distance / 1000;

      return {
        stopId: stop.stop_id.toString(),
        stopName: stop.stop_name,
        mode: ROUTE_TYPE_MAP[stop.route_type] || `TYPE_${stop.route_type}`,
        distance: {
          measurement: distanceKm,
          unit: "km",
        },
        coordinates: {
          lat: stop.stop_latitude,
          lon: stop.stop_longitude,
        },
        // PTV API doesn't return routes directly, would need additional API calls
        routes: undefined,
      };
    });

    // Sort by distance (should already be sorted by API, but ensure consistency)
    nearbyStops.sort((a, b) => {
      const distA = a.distance?.measurement ?? Infinity;
      const distB = b.distance?.measurement ?? Infinity;
      return distA - distB;
    });

    return { nearbyStops };
  } catch (error) {
    console.error("Error fetching from PTV API:", error);
    // Return empty array on error rather than throwing
    return { nearbyStops: [] };
  }
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
  console.log(`Found ${nearbyStops.length} stops within 1km`);

  // Show first 10 stops
  console.log("\nClosest 10 stops:");
  nearbyStops.slice(0, 10).forEach((stop, index) => {
    console.log(`\n${index + 1}. ${stop.stopName}`);
    console.log(`   Mode: ${stop.mode}`);
    console.log(`   Distance: ${stop.distance?.measurement.toFixed(2)}km`);
    console.log(
      `   Coordinates: ${stop.coordinates.lat}, ${stop.coordinates.lon}`
    );
  });
}
