import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatAddressForPropertyValueUrl } from "./formatAddressForPropertyValueUrl";

describe("formatAddressForPropertyValueUrl", () => {
  test("should format a standard address", () => {
    const address: Address = {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("7-english-place-kew-vic-3101");
  });

  test("should handle addresses with apostrophes", () => {
    const address: Address = {
      addressLine: "5 O'Brien Street",
      suburb: "Bondi",
      state: "NSW",
      postcode: "2026",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("5-obrien-street-bondi-nsw-2026");
  });

  test("should handle addresses with commas", () => {
    const address: Address = {
      addressLine: "10 Smith, Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("10-smith-street-melbourne-vic-3000");
  });

  test("should handle addresses with multiple spaces", () => {
    const address: Address = {
      addressLine: "15  Main   Street",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("15-main-street-sydney-nsw-2000");
  });

  test("should handle unit numbers", () => {
    const address: Address = {
      addressLine: "Unit 3/45 Park Road",
      suburb: "Richmond",
      state: "VIC",
      postcode: "3121",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("unit-345-park-road-richmond-vic-3121");
  });

  test("should handle addresses with hyphens", () => {
    const address: Address = {
      addressLine: "12-14 Smith Street",
      suburb: "St Kilda",
      state: "VIC",
      postcode: "3182",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("1214-smith-street-st-kilda-vic-3182");
  });

  test("should convert to lowercase", () => {
    const address: Address = {
      addressLine: "123 UPPER CASE STREET",
      suburb: "MELBOURNE",
      state: "VIC",
      postcode: "3000",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("123-upper-case-street-melbourne-vic-3000");
  });

  test("should handle special characters", () => {
    const address: Address = {
      addressLine: "7 St. George's Road",
      suburb: "Toorak",
      state: "VIC",
      postcode: "3142",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("7-st-georges-road-toorak-vic-3142");
  });

  test("should handle addresses with numbers only in street name", () => {
    const address: Address = {
      addressLine: "5 1st Avenue",
      suburb: "Brighton",
      state: "VIC",
      postcode: "3186",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("5-1st-avenue-brighton-vic-3186");
  });

  test("should handle different states", () => {
    const address: Address = {
      addressLine: "100 Queen Street",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("100-queen-street-brisbane-qld-4000");
  });

  test("should handle suburb names with spaces", () => {
    const address: Address = {
      addressLine: "25 Beach Road",
      suburb: "St Kilda East",
      state: "VIC",
      postcode: "3183",
    };

    const result = formatAddressForPropertyValueUrl(address);
    expect(result).toBe("25-beach-road-st-kilda-east-vic-3183");
  });
});
