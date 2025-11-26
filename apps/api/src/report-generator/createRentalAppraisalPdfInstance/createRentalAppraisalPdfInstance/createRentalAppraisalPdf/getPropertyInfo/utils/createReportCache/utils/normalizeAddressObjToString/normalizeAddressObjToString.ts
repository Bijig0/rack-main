import { Address } from "../../../../../../../../../../shared/types";

/**
 * Normalizes an Address object to a standardized string format.
 * Converts the address to title case and joins components with spaces.
 *
 * @param address - The address object to normalize
 * @returns A normalized string in the format "AddressLine Suburb State Postcode"
 *
 * @example
 * const address = {
 *   addressLine: "123 MAIN STREET",
 *   suburb: "MELBOURNE",
 *   state: "VIC",
 *   postcode: "3000"
 * };
 * normalizeAddressObjToString(address);
 * // Returns: "123 Main Street Melbourne VIC 3000"
 */
export function normalizeAddressObjToString(address: Address): string {
  const toTitleCase = (str: string | undefined): string => {
    if (!str) return "";

    const trimmed = str.trim();
    if (!trimmed) return "";

    return trimmed
      .toLowerCase()
      .split(" ")
      .map((word) => {
        // Keep common abbreviations uppercase
        const upperWords = [
          "vic",
          "nsw",
          "qld",
          "sa",
          "wa",
          "tas",
          "nt",
          "act",
        ];
        if (upperWords.includes(word.toLowerCase())) {
          return word.toUpperCase();
        }
        // Capitalize first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const components = [
    toTitleCase(address.addressLine),
    toTitleCase(address.suburb),
    toTitleCase(address.state),
    address.postcode?.trim() || "",
  ];

  return components.join(" ");
}
