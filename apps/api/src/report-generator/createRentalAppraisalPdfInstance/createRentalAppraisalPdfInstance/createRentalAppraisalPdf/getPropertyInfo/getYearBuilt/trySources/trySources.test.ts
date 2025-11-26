import { Effect } from "effect";
import * as O from "effect/Option";
import { describe, expect, test } from "bun:test";
import { trySources } from "./trySources";
import { Address } from "../../../../../../../../shared/types";
import { CacheStore } from "../../utils/createReportCache/types";
import { Fetcher } from "../../utils/types/scraper";

// Mock types for testing
type TestData = number | null;

// Test address
const testAddress: Address = {
  addressLine: "123 Test Street",
  suburb: "Testville",
  state: "VIC",
  postcode: "3000",
};

// Mock cache store (not used in these tests but required by type signature)
const mockCache: CacheStore = {
  get: async () => undefined,
  set: async () => {},
  has: async () => false,
  clear: async () => {},
  clearExpired: async () => {},
} as any;

describe("trySources", () => {
  describe("basic functionality", () => {
    test("should return Some with data from first successful fetcher", async () => {
      const fetcher1: Fetcher<TestData> = () => Effect.succeed(O.some(2015));
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.some(2016));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });

    test("should return Some with data from second fetcher if first returns null", async () => {
      const fetcher1: Fetcher<TestData> = () => Effect.succeed(O.none());
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.some(2016));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2016);
      }
    });

    test("should return Some with data from second fetcher if first returns undefined", async () => {
      const fetcher1: Fetcher<TestData> = () =>
        Effect.succeed(O.none());
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.some(2016));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2016);
      }
    });

    test("should return Some with data from second fetcher if first throws error", async () => {
      const fetcher1: Fetcher<TestData> = () =>
        Effect.fail(new Error("Fetcher 1 failed"));
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.some(2016));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2016);
      }
    });

    test("should return None when all fetchers return null", async () => {
      const fetcher1: Fetcher<TestData> = () => Effect.succeed(O.none());
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.none());
      const fetcher3: Fetcher<TestData> = () => Effect.succeed(O.none());

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      expect(O.isNone(result)).toBe(true);
    });

    test("should return None when all fetchers fail", async () => {
      const fetcher1: Fetcher<TestData> = () =>
        Effect.fail(new Error("Error 1"));
      const fetcher2: Fetcher<TestData> = () =>
        Effect.fail(new Error("Error 2"));
      const fetcher3: Fetcher<TestData> = () =>
        Effect.fail(new Error("Error 3"));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      expect(O.isNone(result)).toBe(true);
    });

    test("should return None when fetchers array is empty", async () => {
      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [])
      );

      expect(O.isNone(result)).toBe(true);
    });
  });

  describe("sequential execution", () => {
    test("should try fetchers in order and stop at first success", async () => {
      const executionOrder: number[] = [];

      const fetcher1: Fetcher<TestData> = () => {
        executionOrder.push(1);
        return Effect.succeed(O.none());
      };
      const fetcher2: Fetcher<TestData> = () => {
        executionOrder.push(2);
        return Effect.succeed(O.some(2016));
      };
      const fetcher3: Fetcher<TestData> = () => {
        executionOrder.push(3);
        return Effect.succeed(O.some(2017));
      };

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      // Should only execute fetcher1 and fetcher2, not fetcher3
      expect(executionOrder).toEqual([1, 2]);
      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2016);
      }
    });

    test("should try all fetchers if all return null", async () => {
      const executionOrder: number[] = [];

      const fetcher1: Fetcher<TestData> = () => {
        executionOrder.push(1);
        return Effect.succeed(O.none());
      };
      const fetcher2: Fetcher<TestData> = () => {
        executionOrder.push(2);
        return Effect.succeed(O.none());
      };
      const fetcher3: Fetcher<TestData> = () => {
        executionOrder.push(3);
        return Effect.succeed(O.none());
      };

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      expect(executionOrder).toEqual([1, 2, 3]);
      expect(O.isNone(result)).toBe(true);
    });

    test("should try all fetchers if all fail with errors", async () => {
      const executionOrder: number[] = [];

      const fetcher1: Fetcher<TestData> = () => {
        executionOrder.push(1);
        return Effect.fail(new Error("Error 1"));
      };
      const fetcher2: Fetcher<TestData> = () => {
        executionOrder.push(2);
        return Effect.fail(new Error("Error 2"));
      };
      const fetcher3: Fetcher<TestData> = () => {
        executionOrder.push(3);
        return Effect.fail(new Error("Error 3"));
      };

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      expect(executionOrder).toEqual([1, 2, 3]);
      expect(O.isNone(result)).toBe(true);
    });
  });

  describe("mixed scenarios", () => {
    test("should handle mix of errors, nulls, and success", async () => {
      const fetcher1: Fetcher<TestData> = () =>
        Effect.fail(new Error("Network error"));
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.none());
      const fetcher3: Fetcher<TestData> = () => Effect.succeed(O.some(2017));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [
          fetcher1,
          fetcher2,
          fetcher3,
        ])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2017);
      }
    });

    test("should return first valid data even if it's 0", async () => {
      const fetcher1: Fetcher<TestData> = () => Effect.succeed(O.some(0));
      const fetcher2: Fetcher<TestData> = () => Effect.succeed(O.some(2016));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      // 0 is a valid value, should not skip it
      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(0);
      }
    });

    test("should handle empty string as valid data", async () => {
      type StringData = string | null;
      const fetcher1: Fetcher<StringData> = () => Effect.succeed(O.some(""));
      const fetcher2: Fetcher<StringData> = () => Effect.succeed(O.some("data"));

      const result = await Effect.runPromise(
        trySources<StringData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      // Empty string is valid data, should not skip it
      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe("");
      }
    });

    test("should handle false as valid data", async () => {
      type BoolData = boolean | null;
      const fetcher1: Fetcher<BoolData> = () => Effect.succeed(O.some(false));
      const fetcher2: Fetcher<BoolData> = () => Effect.succeed(O.some(true));

      const result = await Effect.runPromise(
        trySources<BoolData>(mockCache, testAddress, [fetcher1, fetcher2])
      );

      // false is valid data, should not skip it
      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(false);
      }
    });
  });

  describe("type safety with different data types", () => {
    test("should work with number type", async () => {
      type NumberData = number | null;
      const fetcher: Fetcher<NumberData> = () => Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<NumberData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(typeof result.value).toBe("number");
        expect(result.value).toBe(2015);
      }
    });

    test("should work with string type", async () => {
      type StringData = string | null;
      const fetcher: Fetcher<StringData> = () =>
        Effect.succeed(O.some("test data"));

      const result = await Effect.runPromise(
        trySources<StringData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(typeof result.value).toBe("string");
        expect(result.value).toBe("test data");
      }
    });

    test("should work with object type", async () => {
      type ObjectData = { value: number; unit: string } | null;
      const fetcher: Fetcher<ObjectData> = () =>
        Effect.succeed(O.some({ value: 650, unit: "sqm" }));

      const result = await Effect.runPromise(
        trySources<ObjectData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toEqual({ value: 650, unit: "sqm" });
      }
    });

    test("should work with array type", async () => {
      type ArrayData = number[] | null;
      const fetcher: Fetcher<ArrayData> = () =>
        Effect.succeed(O.some([1, 2, 3, 4]));

      const result = await Effect.runPromise(
        trySources<ArrayData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(Array.isArray(result.value)).toBe(true);
        expect(result.value).toEqual([1, 2, 3, 4]);
      }
    });
  });

  describe("options parameter", () => {
    test("should use custom dataName in logs", async () => {
      // This test verifies the option is accepted, actual log testing would require mocking console
      const fetcher: Fetcher<TestData> = () => Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher], {
          dataName: "year built",
        })
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });

    test("should work without options parameter", async () => {
      const fetcher: Fetcher<TestData> = () => Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });

    test("should work with empty options object", async () => {
      const fetcher: Fetcher<TestData> = () => Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher], {})
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });
  });

  describe("edge cases", () => {
    test("should handle single fetcher that succeeds", async () => {
      const fetcher: Fetcher<TestData> = () => Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });

    test("should handle single fetcher that fails", async () => {
      const fetcher: Fetcher<TestData> = () =>
        Effect.fail(new Error("Failed"));

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isNone(result)).toBe(true);
    });

    test("should handle single fetcher that returns null", async () => {
      const fetcher: Fetcher<TestData> = () => Effect.succeed(O.none());

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(O.isNone(result)).toBe(true);
    });

    test("should pass correct cacheStore to fetchers", async () => {
      let receivedCache: CacheStore | undefined;

      const fetcher: Fetcher<TestData> = ({ cacheStore }) => {
        receivedCache = cacheStore;
        return Effect.succeed(O.some(2015));
      };

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(receivedCache).toBe(mockCache);
      expect(O.isSome(result)).toBe(true);
    });

    test("should pass correct address to fetchers", async () => {
      let receivedAddress: Address | undefined;

      const fetcher: Fetcher<TestData> = ({ address }) => {
        receivedAddress = address;
        return Effect.succeed(O.some(2015));
      };

      const result = await Effect.runPromise(
        trySources<TestData>(mockCache, testAddress, [fetcher])
      );

      expect(receivedAddress).toEqual(testAddress);
      expect(O.isSome(result)).toBe(true);
    });
  });

  describe("real-world scenarios", () => {
    test("should simulate realistic year built fetching scenario", async () => {
      // Simulate: propertyvalue.com fails, domain.com returns null, realestate.com succeeds
      const getPropertyValueYearBuilt: Fetcher<TestData> = () =>
        Effect.fail(new Error("HTTP 404: Page not found"));

      const getDomainYearBuilt: Fetcher<TestData> = () =>
        Effect.succeed(O.none()); // Year not listed

      const getRealEstateYearBuilt: Fetcher<TestData> = () =>
        Effect.succeed(O.some(2015));

      const result = await Effect.runPromise(
        trySources<TestData>(
          mockCache,
          testAddress,
          [
            getPropertyValueYearBuilt,
            getDomainYearBuilt,
            getRealEstateYearBuilt,
          ],
          { dataName: "year built" }
        )
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
    });

    test("should simulate all sources failing scenario", async () => {
      const getPropertyValueYearBuilt: Fetcher<TestData> = () =>
        Effect.fail(new Error("Network timeout"));

      const getDomainYearBuilt: Fetcher<TestData> = () =>
        Effect.fail(new Error("503: Service unavailable"));

      const getRealEstateYearBuilt: Fetcher<TestData> = () =>
        Effect.succeed(O.none());

      const result = await Effect.runPromise(
        trySources<TestData>(
          mockCache,
          testAddress,
          [
            getPropertyValueYearBuilt,
            getDomainYearBuilt,
            getRealEstateYearBuilt,
          ],
          { dataName: "year built" }
        )
      );

      expect(O.isNone(result)).toBe(true);
    });

    test("should simulate first source succeeds immediately", async () => {
      const executionOrder: string[] = [];

      const getPropertyValueYearBuilt: Fetcher<TestData> = () => {
        executionOrder.push("propertyvalue");
        return Effect.succeed(O.some(2015));
      };

      const getDomainYearBuilt: Fetcher<TestData> = () => {
        executionOrder.push("domain");
        return Effect.succeed(O.some(2016));
      };

      const result = await Effect.runPromise(
        trySources<TestData>(
          mockCache,
          testAddress,
          [getPropertyValueYearBuilt, getDomainYearBuilt],
          { dataName: "year built" }
        )
      );

      expect(O.isSome(result)).toBe(true);
      if (O.isSome(result)) {
        expect(result.value).toBe(2015);
      }
      expect(executionOrder).toEqual(["propertyvalue"]); // Should not try domain
    });
  });
});
