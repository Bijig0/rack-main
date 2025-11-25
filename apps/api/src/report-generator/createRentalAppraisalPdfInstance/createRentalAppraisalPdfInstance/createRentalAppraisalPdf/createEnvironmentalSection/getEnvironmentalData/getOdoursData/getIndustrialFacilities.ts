import { getEpaLicensedPremises, InferredEpaLicenceData } from "./getEpaLicensedPremises";

type Args = {
  lat: number;
  lon: number;
};

/**
 * Get industrial facilities that may emit odours
 * Uses EPA Victoria licensed premises data, filtering for odour-related activities
 *
 * Includes:
 * - Food processing plants
 * - Waste and recycling facilities
 * - Chemical manufacturing
 * - Composting/organic waste processing
 * - Other odour-emitting industrial activities
 */
export const getIndustrialFacilities = async ({
  lat,
  lon,
}: Args): Promise<InferredEpaLicenceData[]> => {
  const epaLicensedPremises = await getEpaLicensedPremises({ lat, lon });

  return epaLicensedPremises;
};

if (import.meta.main) {
  const facilities = await getIndustrialFacilities({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== INDUSTRIAL FACILITIES (ODOUR-RELATED) ===");
  console.log(`Found ${facilities.length} odour-related industrial facilities within 10km`);

  facilities.slice(0, 5).forEach((facility, index) => {
    console.log(`\n${index + 1}. ${facility.facilityName}`);
    console.log(`   Activity: ${facility.activity}`);
    console.log(`   Distance: ${facility.distance?.measurement.toFixed(2)}${facility.distance?.unit}`);
  });

  console.log(`\n✓ Industrial odour sources integrated from EPA licensed premises`);
}
