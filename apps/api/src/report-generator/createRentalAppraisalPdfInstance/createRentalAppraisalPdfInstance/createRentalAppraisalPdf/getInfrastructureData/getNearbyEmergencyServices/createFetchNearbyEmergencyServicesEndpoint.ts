type Args = {
  lat: number;
  lon: number;
  radius: number;
  apiKey: string;
  type: "hospital" | "police" | "fire_station" | "doctor";
};

type Return = {
  endpoint: URL;
};

export const createFetchNearbyEmergencyEndpoint = (args: Args): Return => {
  const { lat, lon, radius, apiKey, type } = args;

  const endpoint = new URL(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=${type}&key=${apiKey}`
  );

  return { endpoint };
};
