import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../../shared/types";
import { formatAddressForDomainUrl } from "./formatAddressForDomainUrl";

describe("formatAddressForDomainUrl", () => {
  describe("standard formatting", () => {
    test("should format a complete address correctly", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
    });

    test("should convert all uppercase to lowercase", () => {
      const address: Address = {
        addressLine: "7 ENGLISH PLACE",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
    });

    test("should convert mixed case to lowercase", () => {
      const address: Address = {
        addressLine: "7 EnGlIsH PlAcE",
        suburb: "KeW",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
    });
  });

  describe("special character handling", () => {
    test("should remove commas", () => {
      const address: Address = {
        addressLine: "7 English Place,",
        suburb: "Kew,",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
    });

    test("should remove periods", () => {
      const address: Address = {
        addressLine: "7 English Pl.",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-pl-kew-vic-3101"
      );
    });

    test("should remove apostrophes", () => {
      const address: Address = {
        addressLine: "7 O'Brien Street",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-obrien-street-kew-vic-3101"
      );
    });

    test("should remove slashes", () => {
      const address: Address = {
        addressLine: "Unit 7/123 Main Street",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "unit-7123-main-street-kew-vic-3101"
      );
    });
  });

  describe("whitespace handling", () => {
    test("should replace multiple spaces with single hyphen", () => {
      const address: Address = {
        addressLine: "7  English   Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
    });

    test("should trim leading and trailing whitespace", () => {
      const address: Address = {
        addressLine: "  7 English Place  ",
        suburb: "  Kew  ",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "7-english-place-kew-vic-3101"
      );
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
      expect(formatAddressForDomainUrl(address)).toBe(
        "123-george-street-sydney-nsw-2000"
      );
    });

    test("should format QLD address", () => {
      const address: Address = {
        addressLine: "45 Queen Street",
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "45-queen-street-brisbane-qld-4000"
      );
    });

    test("should format SA address", () => {
      const address: Address = {
        addressLine: "78 King William Street",
        suburb: "Adelaide",
        state: "SA",
        postcode: "5000",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "78-king-william-street-adelaide-sa-5000"
      );
    });

    test("should format WA address", () => {
      const address: Address = {
        addressLine: "56 St Georges Terrace",
        suburb: "Perth",
        state: "WA",
        postcode: "6000",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "56-st-georges-terrace-perth-wa-6000"
      );
    });
  });

  describe("real-world examples", () => {
    test("should format typical Melbourne address", () => {
      const address: Address = {
        addressLine: "123 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "123-collins-street-melbourne-vic-3000"
      );
    });

    test("should format unit/apartment address", () => {
      const address: Address = {
        addressLine: "Unit 5, 42 Smith Street",
        suburb: "Fitzroy",
        state: "VIC",
        postcode: "3065",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "unit-5-42-smith-street-fitzroy-vic-3065"
      );
    });

    test("should format address with long street name", () => {
      const address: Address = {
        addressLine: "10 Royal Parade",
        suburb: "Parkville",
        state: "VIC",
        postcode: "3052",
      };
      expect(formatAddressForDomainUrl(address)).toBe(
        "10-royal-parade-parkville-vic-3052"
      );
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
      expect(formatAddressForDomainUrl(address1)).toBe(
        formatAddressForDomainUrl(address2)
      );
    });

    test("should produce identical output for different casing", () => {
      const address1: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      const address2: Address = {
        addressLine: "7 ENGLISH PLACE",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatAddressForDomainUrl(address1)).toBe(
        formatAddressForDomainUrl(address2)
      );
    });
  });
});
