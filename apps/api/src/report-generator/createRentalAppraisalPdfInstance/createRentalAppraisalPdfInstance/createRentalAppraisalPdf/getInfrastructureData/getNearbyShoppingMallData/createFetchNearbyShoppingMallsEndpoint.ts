type Args = {
  lat: number;
  lon: number;
  radius: number;
  apiKey: string;
};

type Return = {
  endpoint: URL;
};

export const createFetchNearbyShoppingMallsEndpoint = (args: Args): Return => {
  const { lat, lon, radius, apiKey } = args;

  const endpoint = new URL(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=shopping_mall&key=${apiKey}`
  );

  return { endpoint };
};
