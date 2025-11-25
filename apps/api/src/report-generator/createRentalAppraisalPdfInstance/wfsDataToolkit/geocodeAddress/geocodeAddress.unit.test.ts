import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import type { Address } from "../../../../shared/types";
import { geocodeAddress } from "./geoCodeAddress";

describe("geocodeAddress", () => {
  let mockFetch: ReturnType<typeof mock>;

  beforeEach(() => {
    mockFetch = mock();
  });

  describe("Successful geocoding", () => {
    it("should return lat/lon coordinates for a valid address", async () => {
      const mockResponse = [
        {
          lat: "-37.8136",
          lon: "144.9631",
          display_name: "Melbourne, Victoria, Australia",
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const address: Address = {
        addressLine: "123 Main St",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      const result = await geocodeAddress({
        address,
        fetchFn: mockFetch as any,
      });

      expect(result).toEqual({
        lat: -37.8136,
        lon: 144.9631,
      });

      // Verify the fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callUrl = mockFetch.mock.calls[0][0];
      const url = new URL(callUrl);

      // Check the decoded query parameter
      expect(url.searchParams.get("q")).toBe("123 Main St, VIC, Australia");
      expect(url.searchParams.get("format")).toBe("json");
      expect(url.searchParams.get("limit")).toBe("1");

      const callOptions = mockFetch.mock.calls[0][1];
      expect(callOptions.headers["User-Agent"]).toBe("RentalAppraisalApp/1.0");
    });

    it("should handle addresses with special characters", async () => {
      const mockResponse = [
        {
          lat: "-33.8688",
          lon: "151.2093",
          display_name: "Sydney, New South Wales, Australia",
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const address: Address = {
        addressLine: "45 O'Connell St",
        suburb: "Sydney",
        state: "NSW",
        postcode: "2000",
      };

      const result = await geocodeAddress({
        address,
        fetchFn: mockFetch as any,
      });

      expect(result).toEqual({
        lat: -33.8688,
        lon: 151.2093,
      });
    });

    it("should correctly parse float coordinates", async () => {
      const mockResponse = [
        {
          lat: "-37.123456789",
          lon: "144.987654321",
          display_name: "Test Location",
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const address: Address = {
        addressLine: "Test St",
        suburb: "Test",
        state: "VIC",
        postcode: "3000",
      };

      const result = await geocodeAddress({
        address,
        fetchFn: mockFetch as any,
      });

      expect(result).toEqual({
        lat: -37.123456789,
        lon: 144.987654321,
      });
    });
  });

  describe("Error handling", () => {
    it("should throw error when no results are found", async () => {
      const consoleErrorSpy = spyOn(console, "error").mockImplementation(
        () => {}
      );

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const address: Address = {
        addressLine: "Nonexistent Address",
        suburb: "Nowhere",
        state: "VIC",
        postcode: "0000",
      };

      await expect(
        geocodeAddress({
          address,
          fetchFn: mockFetch as any,
        })
      ).rejects.toThrow("Geocode error");

      consoleErrorSpy.mockRestore();
    });

    it("should throw error on HTTP error", async () => {
      const consoleErrorSpy = spyOn(console, "error").mockImplementation(
        () => {}
      );

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const address: Address = {
        addressLine: "123 Main St",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      await expect(
        geocodeAddress({
          address,
          fetchFn: mockFetch as any,
        })
      ).rejects.toThrow("Geocode error");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Geocode] HTTP error: 500 Internal Server Error"
      );

      consoleErrorSpy.mockRestore();
    });

    it("should throw error on network error", async () => {
      const consoleErrorSpy = spyOn(console, "error").mockImplementation(
        () => {}
      );

      mockFetch.mockRejectedValue(new Error("Network error"));

      const address: Address = {
        addressLine: "123 Main St",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      await expect(
        geocodeAddress({
          address,
          fetchFn: mockFetch as any,
        })
      ).rejects.toThrow("Geocode error");

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should throw error when response is malformed", async () => {
      const consoleErrorSpy = spyOn(console, "error").mockImplementation(
        () => {}
      );

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      const address: Address = {
        addressLine: "123 Main St",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      await expect(
        geocodeAddress({
          address,
          fetchFn: mockFetch as any,
        })
      ).rejects.toThrow("Geocode error");

      consoleErrorSpy.mockRestore();
    });

    it("should throw error on JSON parsing errors", async () => {
      const consoleErrorSpy = spyOn(console, "error").mockImplementation(
        () => {}
      );

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const address: Address = {
        addressLine: "123 Main St",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      };

      await expect(
        geocodeAddress({
          address,
          fetchFn: mockFetch as any,
        })
      ).rejects.toThrow("Geocode error");

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("URL construction", () => {
    it("should build correct query URL with all address components", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [
          {
            lat: "-27.47",
            lon: "153.025",
            display_name: "Test",
          },
        ],
      });

      const address: Address = {
        addressLine: "456 Test Avenue",
        suburb: "Suburb Name",
        state: "QLD",
        postcode: "4000",
      };

      await geocodeAddress({
        address,
        fetchFn: mockFetch as any,
      });

      const callUrl = mockFetch.mock.calls[0][0];
      const url = new URL(callUrl);

      expect(url.searchParams.get("q")).toBe("456 Test Avenue, QLD, Australia");
      expect(url.searchParams.get("format")).toBe("json");
      expect(url.searchParams.get("limit")).toBe("1");
      expect(url.origin + url.pathname).toBe(
        "https://nominatim.openstreetmap.org/search"
      );
    });
  });
});
