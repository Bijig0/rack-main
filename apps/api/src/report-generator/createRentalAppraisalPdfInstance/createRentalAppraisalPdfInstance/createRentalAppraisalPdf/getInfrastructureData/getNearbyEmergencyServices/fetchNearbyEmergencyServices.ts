import { GOOGLE_MAPS_API_KEY } from "../../../../../../shared/config";
import { createFetchNearbyEmergencyEndpoint } from "./createFetchNearbyEmergencyServicesEndpoint";
import { EmergencyService, EmergencyServiceSchema } from "./types";

type Args = {
  lat: number;
  lon: number;
  radius: number;
  type: "hospital" | "police" | "fire_station" | "doctor";
};

export const fetchNearbyEmergencyServices = async ({
  lat,
  lon,
  radius,
  type,
}: Args): Promise<EmergencyService[]> => {
  const { endpoint } = createFetchNearbyEmergencyEndpoint({
    lat,
    lon,
    radius,
    apiKey: GOOGLE_MAPS_API_KEY,
    type,
  });

  const nearbyRes = await fetch(endpoint.href);
  const nearbyData = await nearbyRes.json();

  if (!nearbyData.results || nearbyData.results.length === 0) {
    return [];
  }

  // Validate and map results to EmergencyService[]
  const services: EmergencyService[] = nearbyData.results.map((place: any) =>
    EmergencyServiceSchema.parse({
      name: place.name,
      place_id: place.place_id,
      address: place.vicinity || place.formatted_address || "",
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      type,
    })
  );

  return services;
};
