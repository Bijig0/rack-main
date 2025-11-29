import { GOOGLE_MAPS_API_KEY } from "../../../../../../shared/config";
import { createFetchNearbyPlaygroundsEndpoint } from "./createFetchNearbyPlaygroundsEndpoint";
import { Playground, Playgrounds, PlaygroundSchema } from "./types";

type Args = {
  lat: number;
  lon: number;
  radius: number;
};

export const fetchNearbyPlaygrounds = async ({
  lat,
  lon,
  radius,
}: Args): Promise<Playgrounds> => {
  const { endpoint } = createFetchNearbyPlaygroundsEndpoint({
    lat,
    lon,
    radius,
    apiKey: GOOGLE_MAPS_API_KEY,
  });

  const nearbyRes = await fetch(endpoint.href);
  const nearbyData = await nearbyRes.json();

  if (!nearbyData.results || nearbyData.results.length === 0) {
    return [];
  }

  // Validate and map results to Park[]
  const playgrounds: Playground[] = nearbyData.results.map((place: any) =>
    PlaygroundSchema.parse({
      name: place.name,
      place_id: place.place_id,
      address: place.vicinity || place.formatted_address || "",
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    })
  );

  return playgrounds;
};
