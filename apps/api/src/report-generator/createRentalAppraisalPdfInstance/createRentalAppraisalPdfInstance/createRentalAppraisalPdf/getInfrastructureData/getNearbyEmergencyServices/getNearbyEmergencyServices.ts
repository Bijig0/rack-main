import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { fetchNearbyEmergencyServices } from "./fetchNearbyEmergencyServices";
import { EmergencyService, EmergencyServices, emergencyServiceTypes } from "./types";

type Args = {
  address: Address;
  radius?: number;
};

/**

* Get all nearby emergency services for a given address
  */
export async function getNearbyEmergencyServicesData({
  address,
  radius = 2000,
}: Args): Promise<EmergencyServices> {
  const { lat, lon } = await geocodeAddress({ address });

  // List of all emergency service types

  // Fetch services for all types in parallel
  const allResults = await Promise.all(
    emergencyServiceTypes.map((type) =>
      fetchNearbyEmergencyServices({ lat, lon, radius, type })
    )
  );

  // Flatten the results
  const services: EmergencyService[] = allResults.flat();

  return services;
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

  getNearbyEmergencyServicesData({ address, radius: 10000 })
    .then((services) => {
      console.log(`Found ${services.length} nearby emergency services:`);
      services.forEach((service, i) => {
        console.log(`${i + 1}. ${service.name} - ${service.address}`);
      });
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
}
