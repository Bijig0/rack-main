import z from "zod";
import { createFetchNearbyParksEndpoint } from "./createFetchNearbyPlaygroundsEndpoint";
import { Playground, PlaygroundSchema } from "./types";

const GOOGLE_MAPS_API_KEY = z.string().parse(process.env.GOOGLE_PLACES_API_KEY);

type Args = {
  lat: number;
  lon: number;
  radius: number;
};

export const fetchNearbyParks = async ({
  lat,
  lon,
  radius,
}: Args): Promise<Playground[]> => {
  const { endpoint } = createFetchNearbyParksEndpoint({
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
  const parks: Playground[] = nearbyData.results.map((place: any) =>
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

  return parks;
};
