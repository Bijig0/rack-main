type Args = {
  lat: number;
  lon: number;
  radius: number;
  apiKey: string;
};

type Return = {
  endpoint: URL;
};

export const createFetchNearbyParksEndpoint = (args: Args): Return => {
  const { lat, lon, radius, apiKey } = args;

  const TYPE = "park" as const;

  const endpoint = new URL(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${TYPE}&key=${apiKey}`
  );

  return { endpoint };
};
