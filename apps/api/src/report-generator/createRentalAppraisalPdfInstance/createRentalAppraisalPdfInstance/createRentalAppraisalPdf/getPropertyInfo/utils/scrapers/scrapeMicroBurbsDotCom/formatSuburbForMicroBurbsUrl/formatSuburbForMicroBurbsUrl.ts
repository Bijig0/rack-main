import { Address } from "../../../../../../../../../../shared/types";

// Map of state abbreviations to their full names for microburbs.com.au
const STATE_FULL_NAMES: Record<string, string> = {
  ACT: "A.C.T.",
  NSW: "N.S.W.",
  NT: "N.T.",
  QLD: "Qld.",
  SA: "S.A.",
  TAS: "Tas.",
  VIC: "Vic.",
  WA: "W.A.",
};

/**
 * Converts an address into microburbs.com.au query parameter format:
 * Example: "Kew VIC" -> "Kew+(Vic.)"
 * - Suburb name with spaces replaced by '+'
 * - State in parentheses with proper formatting (e.g., "Vic.")
 */
export function formatSuburbForMicroBurbsUrl(address: Address): string {
  const { suburb, state } = address;

  // Get the formatted state name
  const stateFormatted = STATE_FULL_NAMES[state] || state;

  // Format: {suburb}+({state})
  // Replace spaces in suburb with '+'
  const suburbFormatted = suburb.replace(/\s+/g, "+");

  return `${suburbFormatted}+(${stateFormatted})`;
}
