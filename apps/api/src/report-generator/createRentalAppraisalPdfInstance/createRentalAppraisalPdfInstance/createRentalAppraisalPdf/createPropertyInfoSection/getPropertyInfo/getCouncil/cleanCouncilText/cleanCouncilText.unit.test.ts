import { describe, expect, it } from "bun:test";
import { CouncilSchema } from "../types";
import { cleanCouncilText } from "./cleanCouncilText";

describe("cleanCouncilText", () => {
  it("parses simple council text like 'Boroondara Council'", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: "Boroondara Council",
    });
    expect(result).toBe("Boroondara Council");
    expect(CouncilSchema.safeParse(result).success).toBe(true);
  });

  it("parses different council names", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: "Melbourne Council",
    });
    expect(result).toBe("Melbourne Council");
  });

  it("handles text with extra whitespace", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: "  Yarra Council  ",
    });
    expect(result).toBe("Yarra Council");
  });

  it("returns null for null input", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: null,
    });
    expect(result).toBe(null);
  });

  it("returns null for empty string", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: "",
    });
    expect(result).toBe(null);
  });

  it("returns null for whitespace-only string", () => {
    const { cleanedCouncil: result } = cleanCouncilText({
      councilText: "   ",
    });
    expect(result).toBe(null);
  });
});
