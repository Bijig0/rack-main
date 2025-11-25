import makeFetchHappen from "make-fetch-happen";
import type { Address } from "../../../../shared/types";

type FetchFunction = (
  url: string,
  options?: any
) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<any>;
}>;

type Args = {
  address: Address;
  fetchFn?: FetchFunction;
};

type Return = {
  lat: number;
  lon: number;
};

type NominatimResponse = Array<{
  lat: string;
  lon: string;
  display_name: string;
}>;

const ADDRESS_STRING_TO_GEOCODE_URL =
  "https://nominatim.openstreetmap.org/search";

// Create default fetch instance
const defaultFetch = makeFetchHappen.defaults({
  cachePath: "./node_modules/.cache/geocode-cache",
  timeout: 10000,
}) as FetchFunction;

/**
 * Geocode an address to lat/lon coordinates using OpenStreetMap Nominatim API.
 * Results are cached automatically by make-fetch-happen with filesystem-based caching.
 *
 * Cache location: ./node_modules/.cache/geocode-cache
 * Cache TTL: 24 hours
 *
 * @param address - The address string to geocode
 * @param fetchFn - Optional fetch function (for testing)
 * @returns Object with lat/lon coordinates, or null if geocoding failed
 */
export async function geocodeAddress({
  address,
  fetchFn = defaultFetch,
}: Args): Promise<Return> {
  const { addressLine, suburb, state, postcode } = address;

  try {
    // Build URL with query parameters
    const url = new URL(ADDRESS_STRING_TO_GEOCODE_URL);
    url.searchParams.set("q", `${addressLine}, ${state}, Australia`);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const response = await fetchFn(url.toString(), {
      headers: {
        "User-Agent": "RentalAppraisalApp/1.0",
      },
    });

    if (!response.ok) {
      console.error(
        `[Geocode] HTTP error: ${response.status} ${response.statusText}`
      );
      throw new Error("HTTP error");
    }

    const data = (await response.json()) as NominatimResponse;

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }

    throw new Error("No results");
  } catch (error) {
    console.error("[Geocode] Error:", error);
    throw new Error("Geocode error");
  }
}

if (import.meta.main) {
  const sampleAddress = {
    addressLine: "Flinders Street Station",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  } satisfies Address;

  const geocodedAddress = await geocodeAddress({ address: sampleAddress });

  console.log({ geocodedAddress });
}
