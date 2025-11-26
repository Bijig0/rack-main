import { describe, expect, it } from "bun:test";
import { LandAreaSchema } from "../types";
import { cleanLandAreaText } from "./cleanLandAreaText";

describe("cleanLandAreaText", () => {
  it("parses simple land area text like '537m2'", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: "537m2",
    });
    expect(result).toEqual({ value: 537, unit: "m²" });
    expect(LandAreaSchema.safeParse(result).success).toBe(true);
  });

  it("parses text with a space and superscript unit", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: "650.5 m²",
    });
    expect(result).toEqual({ value: 650.5, unit: "m²" });
  });

  it("handles quoted strings gracefully", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: '"420m2"',
    });
    expect(result).toEqual({ value: 420, unit: "m²" });
  });

  it("returns null for invalid strings", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: "abc",
    });
    expect(result).toBe(null);
  });

  it("returns null for null input", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for malformed numeric formats", () => {
    const { cleanedLandArea: result } = cleanLandAreaText({
      landAreaText: "53 7m2",
    });
    expect(result).toBe(null);
  });
});
