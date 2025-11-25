import { Address } from "../../../../../../../../../shared/types";

// Map of full street type names to property.com.au abbreviations
const STREET_TYPE_ABBREVIATIONS: Record<string, string> = {
  place: "pl",
  street: "st",
  road: "rd",
  avenue: "ave",
  crescent: "cr",
  drive: "dr",
  court: "ct",
  boulevard: "blvd",
  terrace: "tce",
  parade: "pde",
  highway: "hwy",
  lane: "ln",
  grove: "gr",
  close: "cl",
};

/**
 * Converts an address and property ID into property.com.au URL format:
 * Example: "7 English Place, Kew VIC 3101" + "11097147"
 *   -> "vic/kew-3101/english-pl/7-pid-11097147"
 */
export function formatAddressForPropertyComUrl(
  address: Address,
  propertyId: string
): string {
  const { addressLine, suburb, state, postcode } = address;

  // Parse street number and street name from addressLine
  // Expected format: "7 English Place" -> number: "7", street: "English Place"
  const addressParts = addressLine.trim().split(/\s+/);
  const streetNumber = addressParts[0].toLowerCase();
  const streetParts = addressParts.slice(1);

  // Get the last word as potential street type
  const lastWord = streetParts[streetParts.length - 1];
  const normalizedLastWord = lastWord?.toLowerCase().replace(/[^a-z]/g, "");

  // Check if last word is a street type that needs abbreviation
  const abbreviation = normalizedLastWord
    ? STREET_TYPE_ABBREVIATIONS[normalizedLastWord]
    : undefined;

  let streetName: string;
  if (abbreviation) {
    // Replace last word with abbreviation
    const nameWithoutType = streetParts.slice(0, -1).join("-").toLowerCase();
    streetName = nameWithoutType
      ? `${nameWithoutType}-${abbreviation}`
      : abbreviation;
  } else {
    // No abbreviation needed, just join with hyphens
    streetName = streetParts.join("-").toLowerCase();
  }

  // Format: {state}/{suburb}-{postcode}/{street-name}/{number}-pid-{propertyId}
  const stateLower = state.toLowerCase();
  const suburbLower = suburb.toLowerCase().replace(/\s+/g, "-");

  return `${stateLower}/${suburbLower}-${postcode}/${streetName}/${streetNumber}-pid-${propertyId}`;
}
