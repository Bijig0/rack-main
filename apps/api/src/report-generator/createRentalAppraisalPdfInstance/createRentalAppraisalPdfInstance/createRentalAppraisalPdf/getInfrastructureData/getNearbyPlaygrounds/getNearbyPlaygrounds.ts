import { Address } from "../../../../../../../shared/types";
import { geocodeAddress } from "../../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { fetchNearbyParks } from "./fetchNearbyPlaygrounds";
import { Playground } from "./types";

type Args = {
  address: Address;
  type: "park" | "playground";
};

/**
 * Get nearby parks or playgrounds for a given address
 */
export async function getNearbyParksData(
  { address, type }: Args,
  radius: number = 2000
): Promise<Playground[]> {
  // 1. Geocode the address to get lat/lon
  const { lat, lon } = await geocodeAddress({ address });

  // 2. Search for nearby parks/playgrounds
  const parks = await fetchNearbyParks({ lat, lon, radius });

  return parks;
}

// ----------------------------
// Run if executed directly
// ----------------------------
if (import.meta.main) {
  const address = {
    addressLine: "Flinders Street Station",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  } satisfies Address;

  getNearbyParksData({ address, type: "park" })
    .then((parks) => {
      console.log(`Found ${parks.length} parks near "${address.addressLine}":`);
      parks.forEach((park, i) => {
        console.log(`${i + 1}. ${park.name} - ${park.address}`);
      });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}
