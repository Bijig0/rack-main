import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { fetchNearbyShoppingMalls } from "./fetchNearbyShoppingMalls";
import { ShoppingMalls } from "./types";

type Args = {
  address: Address;
};

/**

* Get nearby shopping malls for a given address
* @param address string
* @param radius search radius in meters (default 2000)
* @returns Promise<ShoppingMall[]>
  */
export async function getNearbyShoppingMallsData(
  { address }: Args,
  radius: number = 2000
): Promise<ShoppingMalls> {
  // 1. Geocode the address to get lat/lng
  const { lat, lon } = await geocodeAddress({ address });

  // 2. Search for nearby shopping malls
  const shoppingMalls = await fetchNearbyShoppingMalls({ lat, lon, radius });

  return shoppingMalls;
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

  getNearbyShoppingMallsData({ address })
    .then((malls) => {
      console.log(`Found ${malls.length} shopping malls near "${address}":`);
      malls.forEach((mall, i) => {
        console.log(`${i + 1}. ${mall.name} - ${mall.address}`);
      });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}
