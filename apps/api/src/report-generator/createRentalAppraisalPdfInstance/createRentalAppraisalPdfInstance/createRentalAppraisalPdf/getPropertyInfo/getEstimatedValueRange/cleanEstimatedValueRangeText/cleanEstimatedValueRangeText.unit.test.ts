import { describe, expect, test } from "bun:test";
import { cleanEstimatedValueRangeText } from "./cleanEstimatedValueRangeText";

describe("cleanEstimatedValueRangeText", () => {
  test("parses values with 'm' suffix correctly", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "4.04m",
      midText: "4.59m",
      highText: "5.14m",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 4040000,
      mid: 4590000,
      high: 5140000,
      currency: "AUD",
    });
  });

  test("parses values with $ and m suffix", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "$4.04m",
      midText: "$4.59m",
      highText: "$5.14m",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 4040000,
      mid: 4590000,
      high: 5140000,
      currency: "AUD",
    });
  });

  test("parses values with k suffix", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "450k",
      midText: "500k",
      highText: "550k",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 450000,
      mid: 500000,
      high: 550000,
      currency: "AUD",
    });
  });

  test("parses plain number values", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "450000",
      midText: "500000",
      highText: "550000",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 450000,
      mid: 500000,
      high: 550000,
      currency: "AUD",
    });
  });

  test("handles values with commas", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "$4,040,000",
      midText: "$4,590,000",
      highText: "$5,140,000",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 4040000,
      mid: 4590000,
      high: 5140000,
      currency: "AUD",
    });
  });

  test("returns null when any value is null", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "4.04m",
      midText: null,
      highText: "5.14m",
    });

    expect(result.cleanedEstimatedValueRange).toBeNull();
  });

  test("returns null when all values are null", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: null,
      midText: null,
      highText: null,
    });

    expect(result.cleanedEstimatedValueRange).toBeNull();
  });

  test("handles decimal values correctly", () => {
    const result = cleanEstimatedValueRangeText({
      lowText: "1.5m",
      midText: "2.75m",
      highText: "3.9m",
    });

    expect(result.cleanedEstimatedValueRange).toEqual({
      low: 1500000,
      mid: 2750000,
      high: 3900000,
      currency: "AUD",
    });
  });
});
