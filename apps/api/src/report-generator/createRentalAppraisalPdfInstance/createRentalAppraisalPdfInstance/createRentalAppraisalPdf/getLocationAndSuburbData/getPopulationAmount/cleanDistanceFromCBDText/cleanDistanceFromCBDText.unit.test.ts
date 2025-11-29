import { describe, expect, it } from "bun:test";
import { DistanceFromCBDSchema } from "../types";
import { cleanDistanceFromCBDText } from "./cleanDistanceFromCBDText";

describe("cleanDistanceFromCBDText", () => {
  it("parses simple distance text like '7 km'", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: "7 km",
    });
    expect(result).toEqual({ value: 7, unit: "km" });
    expect(DistanceFromCBDSchema.safeParse(result).success).toBe(true);
  });

  it("parses decimal distances", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: "5.5 km",
    });
    expect(result).toEqual({ value: 5.5, unit: "km" });
  });

  it("handles text with extra whitespace", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: "  12 km  ",
    });
    expect(result).toEqual({ value: 12, unit: "km" });
  });

  it("returns null for null input", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for invalid format", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: "abc",
    });
    expect(result).toBe(null);
  });

  it("returns null for missing unit", () => {
    const { cleanedDistanceFromCBD: result } = cleanDistanceFromCBDText({
      distanceFromCBDText: "7",
    });
    expect(result).toBe(null);
  });
});
