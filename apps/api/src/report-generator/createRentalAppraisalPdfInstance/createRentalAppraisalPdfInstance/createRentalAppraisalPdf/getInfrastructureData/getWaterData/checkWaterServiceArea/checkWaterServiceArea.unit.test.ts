import { describe, it, expect } from "bun:test";
import { checkWaterServiceArea } from "./checkWaterServiceArea";
import type { Address } from "../../../../../../../shared/types";

describe("checkWaterServiceArea", () => {
  describe("Yarra Valley Water service area", () => {
    it("should identify Kew as YVW service area", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
      expect(result.useYVW).toBe(true);
    });

    it("should identify Richmond as YVW service area", () => {
      const address: Address = {
        addressLine: "123 Bridge Road",
        suburb: "Richmond",
        state: "VIC",
        postcode: "3121",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
      expect(result.useYVW).toBe(true);
    });

    it("should identify Doncaster as YVW service area", () => {
      const address: Address = {
        addressLine: "100 Doncaster Road",
        suburb: "Doncaster",
        state: "VIC",
        postcode: "3108",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
      expect(result.useYVW).toBe(true);
    });

    it("should identify Bundoora as YVW service area", () => {
      const address: Address = {
        addressLine: "50 Plenty Road",
        suburb: "Bundoora",
        state: "VIC",
        postcode: "3083",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
      expect(result.useYVW).toBe(true);
    });

    it("should identify Melbourne CBD as YVW service area by postcode", () => {
      const address: Address = {
        addressLine: "1 Collins Street",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
      expect(result.useYVW).toBe(true);
    });
  });

  describe("South East Water service area", () => {
    it("should identify Frankston as South East Water service area", () => {
      const address: Address = {
        addressLine: "100 Beach Street",
        suburb: "Frankston",
        state: "VIC",
        postcode: "3199",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("South East Water");
      expect(result.useYVW).toBe(false);
    });

    it("should identify Dandenong as South East Water service area", () => {
      const address: Address = {
        addressLine: "200 Lonsdale Street",
        suburb: "Dandenong",
        state: "VIC",
        postcode: "3175",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("South East Water");
      expect(result.useYVW).toBe(false);
    });

    it("should identify Brighton as South East Water service area", () => {
      const address: Address = {
        addressLine: "300 Bay Street",
        suburb: "Brighton",
        state: "VIC",
        postcode: "3186",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("South East Water");
      expect(result.useYVW).toBe(false);
    });
  });

  describe("City West Water service area", () => {
    it("should identify Footscray as City West Water service area", () => {
      const address: Address = {
        addressLine: "50 Barkly Street",
        suburb: "Footscray",
        state: "VIC",
        postcode: "3011",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("City West Water");
      expect(result.useYVW).toBe(false);
    });

    it("should identify Werribee as City West Water service area", () => {
      const address: Address = {
        addressLine: "100 Watton Street",
        suburb: "Werribee",
        state: "VIC",
        postcode: "3030",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("City West Water");
      expect(result.useYVW).toBe(false);
    });

    it("should identify Sunshine as City West Water service area", () => {
      const address: Address = {
        addressLine: "200 Hampshire Road",
        suburb: "Sunshine",
        state: "VIC",
        postcode: "3020",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("City West Water");
      expect(result.useYVW).toBe(false);
    });
  });

  describe("Regional areas", () => {
    it("should identify regional Victorian areas with unknown provider", () => {
      const address: Address = {
        addressLine: "789 Test Road",
        suburb: "Geelong",
        state: "VIC",
        postcode: "3220",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Regional Water Authority");
      expect(result.useYVW).toBe(false);
    });

    it("should identify another regional area", () => {
      const address: Address = {
        addressLine: "123 Main Street",
        suburb: "Ballarat",
        state: "VIC",
        postcode: "3350",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Regional Water Authority");
      expect(result.useYVW).toBe(false);
    });
  });

  describe("Case insensitivity", () => {
    it("should handle uppercase suburb names", () => {
      const address: Address = {
        addressLine: "7 English Place",
        suburb: "KEW",
        state: "VIC",
        postcode: "3101",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("Yarra Valley Water");
    });

    it("should handle mixed case suburb names", () => {
      const address: Address = {
        addressLine: "100 Beach Street",
        suburb: "FrAnKsToN",
        state: "VIC",
        postcode: "3199",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(true);
      expect(result.provider).toBe("South East Water");
    });
  });

  describe("Non-Victorian addresses", () => {
    it("should return no service area for NSW addresses", () => {
      const address: Address = {
        addressLine: "1 George Street",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(false);
      expect(result.provider).toBe(null);
      expect(result.useYVW).toBe(false);
    });

    it("should return no service area for QLD addresses", () => {
      const address: Address = {
        addressLine: "1 Queen Street",
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
      };

      const result = checkWaterServiceArea({ address });

      expect(result.isInServiceArea).toBe(false);
      expect(result.provider).toBe(null);
      expect(result.useYVW).toBe(false);
    });
  });
});
