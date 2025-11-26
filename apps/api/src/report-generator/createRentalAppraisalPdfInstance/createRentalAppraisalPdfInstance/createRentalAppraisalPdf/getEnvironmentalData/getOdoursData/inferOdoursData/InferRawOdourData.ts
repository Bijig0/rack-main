// @ts-nocheck
import { numberToString } from "../../../../../../utils/numberToString/numberToString";
import {
  InferredOdoursData,
  InferredOdoursDataSchema,
  OdoursFeatures,
} from "../types";

type Args = {
  features: OdoursFeatures;
  propertyLat: number;
  propertyLon: number;
};

type Return = {
  inferredOdoursData: InferredOdoursData[];
};

// Haversine formula to calculate distance between two points in km
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Summarizes Vicmap landfill features into structured data objects.
 * Provides landfill information, operating status, and distance from property.
 */
export async function inferRawOdourData({
  features,
  propertyLat,
  propertyLon,
}: Args): Promise<Return> {
  const inferredOdoursData = features.map((feature): InferredOdoursData => {
    const { properties } = feature;

    const landfillRegisterNumber = properties.landfill_register_number;
    const referenceNumber = numberToString.parse(properties.reference_number);
    const address = properties.address;
    const suburb = properties.suburb;
    const council = properties.council;
    const latitude = properties.latitude;
    const extraAddressInformation = properties.extra_address_information;
    const longitude = properties.longitude;
    const landfillName = properties.landfill_name;
    const operatingStatus = properties.operating_status;
    const wasteTypeAccepted = properties.waste_type_accepted;
    const estimatedYearOfClosure = properties.estimated_year_of_closure;
    const provenance = properties.provenance;
    const estimatedTotalWasteVolume = properties.estimated_total_waste_volume;
    const licenceNumber = properties.licence_number;
    const historicLicenceNumber = properties.historic_licence_number;
    const dataExtractedOn = properties.data_extracted_on;

    // Calculate distance from property to landfill
    const distanceKm = calculateDistance(
      propertyLat,
      propertyLon,
      latitude,
      longitude
    );

    const inferredOdourData = InferredOdoursDataSchema.parse({
      landfillRegisterNumber,
      referenceNumber,
      address,
      suburb,
      council,
      latitude,
      extraAddressInformation,
      longitude,
      landfillName,
      siteName: landfillName, // Alias for consistency with analysis
      status: operatingStatus, // Alias for consistency with analysis
      operatingStatus,
      wasteTypeAccepted,
      estimatedYearOfClosure,
      provenance,
      estimatedTotalWasteVolume,
      licenceNumber,
      historicLicenceNumber,
      dataExtractedOn,
      distance: {
        measurement: distanceKm,
        unit: "km",
      },
    });

    // --- Build structured response ---
    return inferredOdourData;
  });

  return {
    inferredOdoursData,
  };
}

if (import.meta.main) {
}
