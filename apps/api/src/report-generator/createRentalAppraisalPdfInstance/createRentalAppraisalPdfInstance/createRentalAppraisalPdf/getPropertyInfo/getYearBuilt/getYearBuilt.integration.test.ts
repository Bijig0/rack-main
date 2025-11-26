import { Effect } from "effect";
import * as E from "effect/Either";
import { describe, expect, it, mock } from "bun:test";
import type { Address } from "../../../../../../../shared/types";

// Mock fetchOrRetrieve to prevent actual scraping
// Note: This is an integration test file (.integration.test.ts) because
// mocking fetchOrRetrieve would interfere with createReportCache tests
// Integration tests are excluded from the fast test suite
mock.module("../utils/createReportCache", () => ({
  fetchOrRetrieve: async () => E.right({ html: "<html><body></body></html>" }),
  getReportCache: () => ({
    get: async () => undefined,
    set: async () => {},
    has: async () => false,
    clear: async () => {},
    clearExpired: async () => {},
  }),
}));

// Import after mocking
import { getYearBuilt } from "./getYearBuilt";

describe("getYearBuilt", () => {
  const validAddress: Address = {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  };

  it("should handle whitespace-only text from parser", async () => {
    const result = await Effect.runPromise(
      getYearBuilt({
        address: validAddress,
      })
    );

    // When no year built is found in the HTML, the parser returns null
    expect(result.yearBuilt).toBe(null);
  });
});
