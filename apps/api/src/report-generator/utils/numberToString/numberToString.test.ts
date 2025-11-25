import { describe, expect, it } from "bun:test";
import { numberToString } from "./numberToString";

describe("numberToString schema", () => {
  it("should parse a number into a string", () => {
    const result = numberToString.parse(123);
    expect(result).toBe("123");
  });

  it("should parse a string into the same string", () => {
    const result = numberToString.parse("hello");
    expect(result).toBe("hello");
  });

  it("should parse a boolean into a string", () => {
    const resultTrue = numberToString.parse(true);
    const resultFalse = numberToString.parse(false);
    expect(resultTrue).toBe("true");
    expect(resultFalse).toBe("false");
  });
});
