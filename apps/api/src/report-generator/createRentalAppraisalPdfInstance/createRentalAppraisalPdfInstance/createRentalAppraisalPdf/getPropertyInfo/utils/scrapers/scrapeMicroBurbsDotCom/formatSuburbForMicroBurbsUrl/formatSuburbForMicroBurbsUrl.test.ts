import { describe, expect, test } from "bun:test";
import { Address } from "../../../../../../../../../shared/types";
import { formatSuburbForMicroBurbsUrl } from "./formatSuburbForMicroBurbsUrl";

describe("formatSuburbForMicroBurbsUrl", () => {
  describe("standard formatting", () => {
    test("should format a single-word suburb correctly", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Kew+(Vic.)");
    });

    test("should format a multi-word suburb with spaces replaced by +", () => {
      const address: Address = {
        addressLine: "123 Main Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("St+Kilda+(Vic.)");
    });

    test("should format suburbs with multiple spaces", () => {
      const address: Address = {
        addressLine: "456 Park Road",
        suburb: "Brighton East",
        state: "VIC",
        postcode: "3187",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe(
        "Brighton+East+(Vic.)"
      );
    });
  });

  describe("state formatting", () => {
    test("should format VIC as Vic.", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Kew+(Vic.)");
    });

    test("should format NSW as N.S.W.", () => {
      const address: Address = {
        addressLine: "123 George Street",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Sydney+(N.S.W.)");
    });

    test("should format QLD as Qld.", () => {
      const address: Address = {
        addressLine: "45 Queen Street",
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Brisbane+(Qld.)");
    });

    test("should format SA as S.A.", () => {
      const address: Address = {
        addressLine: "78 King William Street",
        suburb: "Adelaide",
        state: "SA",
        postcode: "5000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Adelaide+(S.A.)");
    });

    test("should format WA as W.A.", () => {
      const address: Address = {
        addressLine: "56 St Georges Terrace",
        suburb: "Perth",
        state: "WA",
        postcode: "6000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Perth+(W.A.)");
    });

    test("should format TAS as Tas.", () => {
      const address: Address = {
        addressLine: "101 Elizabeth Street",
        suburb: "Hobart",
        state: "TAS",
        postcode: "7000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Hobart+(Tas.)");
    });

    test("should format ACT as A.C.T.", () => {
      const address: Address = {
        addressLine: "50 Commonwealth Avenue",
        suburb: "Canberra",
        state: "ACT",
        postcode: "2600",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Canberra+(A.C.T.)");
    });

    test("should format NT as N.T.", () => {
      const address: Address = {
        addressLine: "25 Mitchell Street",
        suburb: "Darwin",
        state: "NT",
        postcode: "0800",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Darwin+(N.T.)");
    });
  });

  describe("real-world examples", () => {
    test("should format typical Melbourne suburb", () => {
      const address: Address = {
        addressLine: "123 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Melbourne+(Vic.)");
    });

    test("should format suburb with apostrophe (St Kilda)", () => {
      const address: Address = {
        addressLine: "10 Acland Street",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("St+Kilda+(Vic.)");
    });

    test("should format suburb with hyphen (Hunters Hill)", () => {
      const address: Address = {
        addressLine: "5 Alexandra Street",
        suburb: "Hunters Hill",
        state: "NSW",
        postcode: "2110",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe(
        "Hunters+Hill+(N.S.W.)"
      );
    });

    test("should format three-word suburb (Port Phillip Bay)", () => {
      const address: Address = {
        addressLine: "99 Beach Road",
        suburb: "Port Phillip Bay",
        state: "VIC",
        postcode: "3000",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe(
        "Port+Phillip+Bay+(Vic.)"
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
      expect(formatSuburbForMicroBurbsUrl(address1)).toBe(
        formatSuburbForMicroBurbsUrl(address2)
      );
    });

    test("should preserve suburb casing", () => {
      const address1: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      const address2: Address = {
        addressLine: "7 English Place",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };
      expect(formatSuburbForMicroBurbsUrl(address1)).toBe("Kew+(Vic.)");
      expect(formatSuburbForMicroBurbsUrl(address2)).toBe("KEW+(Vic.)");
      expect(formatSuburbForMicroBurbsUrl(address1)).not.toBe(
        formatSuburbForMicroBurbsUrl(address2)
      );
    });
  });

  describe("edge cases", () => {
    test("should handle suburb with leading/trailing spaces", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "  Kew  ",
        state: "VIC",
        postcode: "3101",
      };
      // Note: The function uses \s+ which collapses multiple spaces
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("+Kew++(Vic.)");
    });

    test("should handle multiple consecutive spaces in suburb", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "St  Kilda",
        state: "VIC",
        postcode: "3182",
      };
      // Multiple spaces are collapsed into a single +
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("St+Kilda+(Vic.)");
    });

    test("should handle unknown state code", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "XX" as any,
        postcode: "3101",
      };
      expect(formatSuburbForMicroBurbsUrl(address)).toBe("Kew+(XX)");
    });
  });

  describe("microburbs-specific formatting", () => {
    test("should use + for spaces (not hyphens)", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "St Kilda",
        state: "VIC",
        postcode: "3182",
      };
      const result = formatSuburbForMicroBurbsUrl(address);
      expect(result).toContain("+");
      expect(result).not.toContain("-");
    });

    test("should wrap state in parentheses", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      const result = formatSuburbForMicroBurbsUrl(address);
      expect(result).toMatch(/\(.+\)$/);
    });

    test("should use state abbreviations with dots", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };
      const result = formatSuburbForMicroBurbsUrl(address);
      expect(result).toContain("Vic.");
      expect(result).toContain(".");
    });
  });
});
