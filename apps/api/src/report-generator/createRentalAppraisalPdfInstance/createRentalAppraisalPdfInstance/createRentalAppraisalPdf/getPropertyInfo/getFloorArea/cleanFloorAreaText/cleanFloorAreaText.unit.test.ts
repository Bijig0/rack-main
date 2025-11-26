import { describe, expect, it } from "bun:test";
import { FloorAreaSchema } from "../types";
import { cleanFloorAreaText } from "./cleanFloorAreaText";

describe("cleanFloorAreaText", () => {
  it("parses simple floor area text like '358m2'", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: "358m2",
    });
    expect(result).toEqual({ value: 358, unit: "m²" });
    expect(FloorAreaSchema.safeParse(result).success).toBe(true);
  });

  it("parses text with a space and superscript unit", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: "512.5 m²",
    });
    expect(result).toEqual({ value: 512.5, unit: "m²" });
  });

  it("handles quoted strings gracefully", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: '"420m2"',
    });
    expect(result).toEqual({ value: 420, unit: "m²" });
  });

  it("returns 'not found' for invalid strings", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: "abc",
    });
    expect(result).toBe(null);
  });

  it("returns 'not found' for null input", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: null,
    });
    expect(result).toBe(null);
  });

  it("returns 'not found' for malformed numeric formats", () => {
    const { cleanedFloorArea: result } = cleanFloorAreaText({
      floorAreaText: "35 8m2",
    });
    expect(result).toBe(null);
  });
});
