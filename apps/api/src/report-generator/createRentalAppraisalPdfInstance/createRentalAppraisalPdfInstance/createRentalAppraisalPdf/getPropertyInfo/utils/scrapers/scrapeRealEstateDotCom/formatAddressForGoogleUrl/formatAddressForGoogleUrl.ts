import { Address } from "../../../../../../../../../shared/types";

// Map of full street type names to Google-style abbreviations
const STREET_TYPE_ABBREVIATIONS: Record<string, string> = {
  place: "pl",
  street: "st",
  road: "rd",
  avenue: "ave",
  crescent: "cr",
  drive: "dr",
  court: "ct",
  boulevard: "blvd",
};

/**
 * Converts an address into Google Street View URL style:
 * - lowercase
 * - spaces replaced with '-'
 * - commas removed
 * - street type abbreviations applied
 */
export function formatAddressForGoogleUrl(address: Address): string {
  // Combine all address components into one string
  const fullAddress = `${address.addressLine} ${address.suburb} ${address.state} ${address.postcode}`;

  // Split into words, normalize punctuation, lowercase, and map abbreviations
  const words = fullAddress.split(/\s+/).map((word) => {
    const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, ""); // remove commas/periods/etc
    return STREET_TYPE_ABBREVIATIONS[normalized] ?? normalized;
  });

  // Join with hyphens
  return words.join("-");
}
