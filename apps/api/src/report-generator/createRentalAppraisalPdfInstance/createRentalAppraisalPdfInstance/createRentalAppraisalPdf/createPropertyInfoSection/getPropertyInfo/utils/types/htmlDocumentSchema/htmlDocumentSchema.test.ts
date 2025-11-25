import { describe, expect, test } from "bun:test";
import { htmlDocumentSchema } from "./htmlDocumentSchema";

describe("htmlDocumentSchema", () => {
  test("should validate simple valid HTML", async () => {
    const validHtml = "<div><p>Hello</p></div>";
    const result = await htmlDocumentSchema.safeParseAsync(validHtml);
    expect(result.success).toBe(true);
  });

  test("should reject invalid HTML with unclosed tags", async () => {
    const invalidHtml = "<div><p>Hello</div>";
    const result = await htmlDocumentSchema.safeParseAsync(invalidHtml);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Must be valid HTML");
    }
  });

  test("should reject malformed HTML", async () => {
    const invalidHtml = "<div><p>Hello<//p></div>";
    const result = await htmlDocumentSchema.safeParseAsync(invalidHtml);
    expect(result.success).toBe(false);
  });

  test("should validate HTML with nested elements", async () => {
    const validHtml = "<div><ul><li>Item 1</li><li>Item 2</li></ul></div>";
    const result = await htmlDocumentSchema.safeParseAsync(validHtml);
    expect(result.success).toBe(true);
  });

  test("should validate empty string as valid HTML", async () => {
    const emptyHtml = "";
    const result = await htmlDocumentSchema.safeParseAsync(emptyHtml);
    expect(result.success).toBe(true);
  });
});
