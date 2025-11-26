import axios from "axios";
import { createWfsParams } from "../../../../../wfsDataToolkit/createWfsParams/createWfsParams";
import { WFS_DATA_URL } from "../../../../../wfsDataToolkit/defaults";

type Args = {
  lat: number;
  lon: number;
};

type EpaLicenceProperties = {
  licence_number: string;
  place_or_premises: string;
  premises_address: string;
  suburb: string;
  permission_activity: string;
  status: string;
  date_issued?: string;
  last_amended?: string;
  acn?: string | null;
  registered_address?: string;
};

type EpaLicenceFeature = {
  type: "Feature";
  id: string;
  properties: EpaLicenceProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
};

export type InferredEpaLicenceData = {
  licenceNumber: string;
  facilityName: string;
  address: string;
  suburb: string;
  activity: string;
  status: string;
  distance?: {
    measurement: number;
    unit: string;
  };
};

/**
 * Get EPA licensed premises (industrial facilities)
 * These may include odour-emitting facilities like food processing, chemical manufacturing, etc.
 */
export const getEpaLicensedPremises = async ({
  lat,
  lon,
}: Args): Promise<InferredEpaLicenceData[]> => {
  const buffer = 0.1; // 10km buffer for industrial facilities

  const params = createWfsParams({
    lat,
    lon,
    buffer,
    typeName: "open-data-platform:epa_licence_point",
  });

  const response = await axios.get(WFS_DATA_URL, {
    params,
    timeout: 15000,
  });

  console.log(
    "Raw EPA licensed premises response:",
    JSON.stringify(response.data, null, 2)
  );

  // TODO: Add proper schema validation once we see the actual response structure
  const features: EpaLicenceFeature[] = response.data.features || [];

  // Filter for potentially odour-emitting facilities
  const odourRelatedKeywords = [
    "food",
    "meat",
    "poultry",
    "abattoir",
    "rendering",
    "compost",
    "waste",
    "chemical",
    "manufacturing",
    "processing",
    "brewery",
    "winery",
    "distillery",
    "dairy",
    "feedlot",
    "piggery",
    "recycling",
    "sewage",
    "treatment",
  ];

  const odourRelatedFacilities = features.filter((feature) => {
    const activity =
      feature.properties.permission_activity?.toLowerCase() || "";
    const placeName = feature.properties.place_or_premises?.toLowerCase() || "";
    return odourRelatedKeywords.some(
      (keyword) => activity.includes(keyword) || placeName.includes(keyword)
    );
  });

  // Calculate distances and map to output format
  const inferredData: InferredEpaLicenceData[] = odourRelatedFacilities.map(
    (feature) => {
      const props = feature.properties;
      const [facLon, facLat] = feature.geometry.coordinates;

      // Haversine distance calculation
      const R = 6371; // Earth's radius in km
      const dLat = ((facLat - lat) * Math.PI) / 180;
      const dLon = ((facLon - lon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((facLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      return {
        licenceNumber: props.licence_number,
        facilityName: props.place_or_premises,
        address: props.premises_address,
        suburb: props.suburb,
        activity: props.permission_activity,
        status: props.status,
        distance: {
          measurement: distanceKm,
          unit: "km",
        },
      };
    }
  );

  // Sort by distance (closest first)
  inferredData.sort((a, b) => {
    const distA = a.distance?.measurement ?? Infinity;
    const distB = b.distance?.measurement ?? Infinity;
    return distA - distB;
  });

  return inferredData;
};

if (import.meta.main) {
  const facilities = await getEpaLicensedPremises({
    lat: -37.8136,
    lon: 144.9631,
  });

  console.log("\n=== EPA LICENSED PREMISES (ODOUR-RELATED) ===");
  console.log(
    `Found ${facilities.length} odour-related licensed facilities within 10km`
  );

  // Show closest 5
  facilities.slice(0, 5).forEach((facility, index) => {
    console.log(`\n${index + 1}. ${facility.facilityName}`);
    console.log(`   Activity: ${facility.activity}`);
    console.log(`   Address: ${facility.address}, ${facility.suburb}`);
    console.log(
      `   Distance: ${facility.distance?.measurement.toFixed(2)}${
        facility.distance?.unit
      }`
    );
    console.log(`   Status: ${facility.status}`);
  });

  console.log(`\n✓ Found ${facilities.length} odour-related licensed premises`);
}
