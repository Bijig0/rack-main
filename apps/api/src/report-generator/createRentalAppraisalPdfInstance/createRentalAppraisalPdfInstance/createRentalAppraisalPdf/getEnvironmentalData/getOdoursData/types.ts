import { z } from "zod";
import { GeometrySchema } from "../../../../wfsDataToolkit/types";
import {
  AreaMeasurement,
  LengthMeasurement,
  Measurement,
} from "../getEasmentsData/types";

// Odours properties schema (based on your data)
export const OdoursPropertiesSchema = z.object({
  landfill_register_number: z.number(),
  reference_number: z.number().nullable(),
  address: z.string(),
  suburb: z.string(),
  council: z.string(),
  latitude: z.number(),
  extra_address_information: z.string().nullable(),
  longitude: z.number(),
  landfill_name: z.string(),
  operating_status: z.string(),
  waste_type_accepted: z.string(),
  estimated_year_of_closure: z.string().nullable(),
  provenance: z.string(),
  estimated_total_waste_volume: z.string().nullable(),
  licence_number: z.string().nullable(),
  historic_licence_number: z.string().nullable(),
  data_extracted_on: z.string(), // optionally could parse to Date with z.coerce.date()
});

// Geographic Feature schema
export const OdoursFeatureSchema = z.object({
  type: z.literal("Feature"),
  id: z.string(),
  properties: OdoursPropertiesSchema,
  geometry: GeometrySchema,
});

// Main schema for the response
export const OdoursFeaturesSchema = z.array(OdoursFeatureSchema);

// Measurement schema
const MeasurementSchema = z.object({
  measurement: z.number(),
  unit: z.string(),
});

// Updated InferredOdoursData schema with proper measurement handling
export const InferredOdoursDataSchema = z.object({
  landfillRegisterNumber: z.number(), // Unique EPA register ID
  referenceNumber: z.string().nullable(), // Optional reference code
  address: z.string(), // Full address string
  suburb: z.string(), // Suburb name
  council: z.string(), // Local Government Authority
  latitude: z.number(), // Decimal latitude
  extraAddressInformation: z.string().nullable(), // Additional address info
  longitude: z.number(), // Decimal longitude
  landfillName: z.string(), // Common or legacy landfill name
  siteName: z.string(), // Alias for landfillName (for consistency with analysis)
  status: z.string(), // Alias for operatingStatus (for consistency with analysis)
  operatingStatus: z.string(), // e.g., "Closed" or "Operating"
  wasteTypeAccepted: z.string(), // Types of waste accepted
  estimatedYearOfClosure: z.string().nullable(), // e.g., "1984"
  provenance: z.string(), // Source of the data
  estimatedTotalWasteVolume: z.string().nullable(), // e.g., "Not available"
  licenceNumber: z.string().nullable(), // Current licence reference
  historicLicenceNumber: z.string().nullable(), // Legacy licence number
  dataExtractedOn: z.string(), // ISO date string when data was extracted
  distance: MeasurementSchema.optional(), // Distance from property
});

// Infer types
export type InferredOdoursData = z.infer<typeof InferredOdoursDataSchema>;
export type OdoursFeature = z.infer<typeof OdoursFeatureSchema>;
export type OdoursFeatures = z.infer<typeof OdoursFeaturesSchema>;

// Type guards for discriminated union
export function isLengthMeasurement(
  measurement: Measurement
): measurement is LengthMeasurement {
  return measurement.type === "length";
}

export function isAreaMeasurement(
  measurement: Measurement
): measurement is AreaMeasurement {
  return measurement.type === "area";
}
