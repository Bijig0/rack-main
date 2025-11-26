import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { fetchNearbyPlaygrounds } from "./fetchNearbyPlaygrounds";
import { Playgrounds } from "./types";

type Args = {
  address: Address;
};

/**
 * Get nearby playgrounds or playgrounds for a given address
 */
export async function getNearbyPlaygroundsData(
  { address }: Args,
  radius: number = 2000
): Promise<Playgrounds> {
  // 1. Geocode the address to get lat/lon
  const { lat, lon } = await geocodeAddress({ address });

  // 2. Search for nearby playgrounds/playgrounds
  const playgrounds = await fetchNearbyPlaygrounds({ lat, lon, radius });

  return playgrounds;
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

  getNearbyPlaygroundsData({ address })
    .then((playgrounds) => {
      console.log(
        `Found ${playgrounds.length} playgrounds near "${address.addressLine}":`
      );
      playgrounds.forEach((park, i) => {
        console.log(`${i + 1}. ${park.name} - ${park.address}`);
      });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}
