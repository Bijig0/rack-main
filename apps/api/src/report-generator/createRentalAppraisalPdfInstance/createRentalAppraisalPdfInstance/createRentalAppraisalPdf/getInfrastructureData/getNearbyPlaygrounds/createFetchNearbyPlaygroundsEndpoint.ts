type Args = {
  lat: number;
  lon: number;
  radius: number;
  apiKey: string;
};

type Return = {
  endpoint: URL;
};

export const createFetchNearbyPlaygroundsEndpoint = (args: Args): Return => {
  const { lat, lon, radius, apiKey } = args;

  const endpoint = new URL(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
  );

  endpoint.searchParams.set("location", `${lat},${lon}`);
  endpoint.searchParams.set("radius", String(radius));
  endpoint.searchParams.set("keyword", "playground");
  endpoint.searchParams.set("key", apiKey);

  return { endpoint };
};