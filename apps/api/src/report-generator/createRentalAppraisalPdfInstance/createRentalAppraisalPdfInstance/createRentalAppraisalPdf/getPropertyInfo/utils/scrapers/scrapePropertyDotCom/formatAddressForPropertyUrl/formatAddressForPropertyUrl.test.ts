import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatAddressForPropertyUrl } from "./formatAddressForPropertyUrl";

describe("formatAddressForPropertyUrl", () => {
  describe("standard formatting", () => {
    test("should format a complete address correctly", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("7-english-place-kew-vic-3101");
    });

    test("should handle multi-word street names", () => {
      const address: Address = {
        addressLine: "123 Main Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("123-main-street-st-kilda-vic-3182");
    });

    test("should handle unit numbers", () => {
      const address: Address = {
        addressLine: "Unit 5/10 Park Road",
        suburb: "Brighton",
        state: "VIC",
        postcode: "3186",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("unit-510-park-road-brighton-vic-3186");
    });
  });

  describe("different Australian states", () => {
    test("should format NSW address", () => {
      const address: Address = {
        addressLine: "123 George Street",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("123-george-street-sydney-nsw-2000");
    });

    test("should format QLD address", () => {
      const address: Address = {
        addressLine: "45 Queen Street",
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("45-queen-street-brisbane-qld-4000");
    });

    test("should format SA address", () => {
      const address: Address = {
        addressLine: "78 King William Street",
        suburb: "Adelaide",
        state: "SA",
        postcode: "5000",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("78-king-william-street-adelaide-sa-5000");
    });
  });

  describe("special characters handling", () => {
    test("should remove apostrophes", () => {
      const address: Address = {
        addressLine: "10 O'Brien Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("10-obrien-street-st-kilda-vic-3182");
    });

    test("should remove commas", () => {
      const address: Address = {
        addressLine: "5 Smith, Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("5-smith-street-melbourne-vic-3000");
    });

    test("should handle slashes in unit numbers", () => {
      const address: Address = {
        addressLine: "3/45 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("345-collins-street-melbourne-vic-3000");
    });
  });

  describe("consistency", () => {
    test("should produce identical output for identical addresses", () => {
      const address1: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      const address2: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForPropertyUrl(address1)).toBe(formatAddressForPropertyUrl(address2));
    });

    test("should convert uppercase to lowercase", () => {
      const address: Address = {
        addressLine: "7 ENGLISH PLACE",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForPropertyUrl(address)).toBe("7-english-place-kew-vic-3101");
    });
  });
});
