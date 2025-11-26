import { GOOGLE_MAPS_API_KEY } from "../../../../../../shared/config";
import { createFetchNearbyShoppingMallsEndpoint } from "./createFetchNearbyShoppingMallsEndpoint";
import { ShoppingMall, ShoppingMallSchema } from "./types";

type Args = {
  lat: number;
  lon: number;
  radius: number;
};

export const fetchNearbyShoppingMalls = async ({
  lat,
  lon,
  radius,
}: Args): Promise<ShoppingMall[]> => {
  const { endpoint } = createFetchNearbyShoppingMallsEndpoint({
    lat,
    lon,
    radius,
    apiKey: GOOGLE_MAPS_API_KEY,
  });

  const nearbyRes = await fetch(endpoint.href);
  const nearbyData = await nearbyRes.json();

  console.log({ nearbyData });

  if (!nearbyData.results || nearbyData.results.length === 0) {
    return [];
  }

  // 3. Validate and map results to ShoppingMall[]
  const shoppingMalls: ShoppingMall[] = nearbyData.results.map((place: any) =>
    ShoppingMallSchema.parse({
      name: place.name,
      place_id: place.place_id,
      address: place.vicinity || place.formatted_address || "",
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    })
  );

  return shoppingMalls;
};
