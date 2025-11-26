import { describe, expect, test } from "bun:test";
import { z } from "zod";
import * as E from "effect/Either";
import {
  parseFromHtml,
  createSchemaParser,
  textExtractors,
  type ParseOptions,
} from "./parseFromHtml";

describe("parseFromHtml", () => {
  describe("Basic field parsing", () => {
    test("should parse a single field with simple selector", () => {
      const html = `
        <html>
          <body>
            <div data-testid="year-built">2015</div>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number().min(1800),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "year-built",
              selectors: ['[data-testid="year-built"]'],
            },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
      }
    });

    test("should parse multiple fields", () => {
      const html = `
        <html>
          <body>
            <div data-testid="year-built">2015</div>
            <div data-testid="land-size">650 m²</div>
            <div data-testid="bedrooms">4</div>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number().min(1800),
        landSize: z.object({ value: z.number().positive(), unit: z.literal("m²") }),
        bedrooms: z.number().int().positive(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            { name: "year", selectors: ['[data-testid="year-built"]'] },
          ],
          extractValue: textExtractors.year,
        },
        landSize: {
          strategies: [
            { name: "land", selectors: ['[data-testid="land-size"]'] },
          ],
          extractValue: textExtractors.area,
        },
        bedrooms: {
          strategies: [
            { name: "bed", selectors: ['[data-testid="bedrooms"]'] },
          ],
          extractValue: textExtractors.number,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
        expect(result.right.landSize).toEqual({ value: 650, unit: "m²" });
        expect(result.right.bedrooms).toBe(4);
      }
    });

    test("should try multiple selectors in order", () => {
      const html = `
        <html>
          <body>
            <span class="property-year">2020</span>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "primary",
              selectors: [
                '[data-testid="year"]',
                ".year-built",
                ".property-year",
              ],
            },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2020);
      }
    });
  });

  describe("Strategy parsing", () => {
    test("should parse using sibling element (dt/dd pattern)", () => {
      const html = `
        <html>
          <body>
            <dl>
              <dt>Year Built</dt>
              <dd>2015</dd>
            </dl>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "definition-list",
              selectors: ['dt:contains("Year Built")'],
              siblingElement: "dd",
            },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
      }
    });

    test("should use custom extractText function", () => {
      const html = `
        <html>
          <body>
            <div class="price">$1,500,000</div>
          </body>
        </html>
      `;

      const schema = z.object({
        price: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        price: {
          strategies: [
            {
              name: "price",
              selectors: [".price"],
              extractText: ($el) => {
                const text = $el.text();
                return text.replace(/[$,]/g, "");
              },
            },
          ],
          extractValue: (text) => {
            const num = parseInt(text, 10);
            return isNaN(num) ? null : num;
          },
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.price).toBe(1500000);
      }
    });

    test("should try multiple strategies", () => {
      const html = `
        <html>
          <body>
            <span class="year">2018</span>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "primary",
              selectors: ['[data-testid="year"]'],
            },
            {
              name: "fallback",
              selectors: [".year-built", ".year"],
            },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2018);
      }
    });
  });

  describe("Fallback patterns", () => {
    test("should use regex fallback when selectors fail", () => {
      const html = `
        <html>
          <body>
            <p>This property was built in 2015 and has been well maintained.</p>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "primary",
              selectors: ['[data-testid="year"]'],
            },
          ],
          extractValue: textExtractors.year,
          fallbackPatterns: [/built\s+in\s+(\d{4})/i],
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
      }
    });

    test("should try multiple fallback patterns", () => {
      const html = `
        <html>
          <body>
            <p>Constructed: 1995</p>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "primary",
              selectors: ['[data-testid="year"]'],
            },
          ],
          extractValue: textExtractors.year,
          fallbackPatterns: [
            /built\s+in\s+(\d{4})/i,
            /constructed:\s*(\d{4})/i,
          ],
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(1995);
      }
    });
  });

  describe("Validation and error handling", () => {
    test("should return Left when schema validation fails", () => {
      const html = `
        <html>
          <body>
            <div data-testid="year-built">1500</div>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number().min(1800),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            { name: "year", selectors: ['[data-testid="year-built"]'] },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isLeft(result)).toBe(true);
      if (E.isLeft(result)) {
        expect(result.left.message).toContain("Schema validation failed");
      }
    });

    test("should return null for missing fields and fail validation if required", () => {
      const html = `
        <html>
          <body>
            <div>No year data here</div>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            { name: "year", selectors: ['[data-testid="year-built"]'] },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isLeft(result)).toBe(true);
    });

    test("should handle optional fields with nullable schema", () => {
      const html = `
        <html>
          <body>
            <div data-testid="bedrooms">3</div>
          </body>
        </html>
      `;

      const schema = z.object({
        bedrooms: z.number(),
        yearBuilt: z.number().nullable(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        bedrooms: {
          strategies: [
            { name: "bed", selectors: ['[data-testid="bedrooms"]'] },
          ],
          extractValue: textExtractors.number,
        },
        yearBuilt: {
          strategies: [
            { name: "year", selectors: ['[data-testid="year-built"]'] },
          ],
          extractValue: textExtractors.year,
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.bedrooms).toBe(3);
        expect(result.right.yearBuilt).toBe(null);
      }
    });
  });

  describe("Text extractors", () => {
    describe("year extractor", () => {
      test("should extract 4-digit year", () => {
        expect(textExtractors.year("2015")).toBe(2015);
        expect(textExtractors.year("Built in 1995")).toBe(1995);
        expect(textExtractors.year("Year: 2020")).toBe(2020);
      });

      test("should validate year range", () => {
        expect(textExtractors.year("1799")).toBe(null);
        const futureYear = new Date().getFullYear() + 10;
        expect(textExtractors.year(futureYear.toString())).toBe(null);
      });

      test("should return null for invalid input", () => {
        expect(textExtractors.year("")).toBe(null);
        expect(textExtractors.year("abc")).toBe(null);
        expect(textExtractors.year("123")).toBe(null);
      });
    });

    describe("number extractor", () => {
      test("should extract numbers", () => {
        expect(textExtractors.number("42")).toBe(42);
        expect(textExtractors.number("1,500")).toBe(1500);
        expect(textExtractors.number("Bedrooms: 3")).toBe(3);
      });

      test("should return null for invalid input", () => {
        expect(textExtractors.number("")).toBe(null);
        expect(textExtractors.number("abc")).toBe(null);
      });
    });

    describe("area extractor", () => {
      test("should extract area in square meters", () => {
        expect(textExtractors.area("650 m²")).toEqual({ value: 650, unit: "m²" });
        expect(textExtractors.area("500 m2")).toEqual({ value: 500, unit: "m²" });
        expect(textExtractors.area("1,200 sqm")).toEqual({ value: 1200, unit: "m²" });
        expect(textExtractors.area("800 square meters")).toEqual({ value: 800, unit: "m²" });
      });

      test("should return null for invalid input", () => {
        expect(textExtractors.area("")).toBe(null);
        expect(textExtractors.area("large")).toBe(null);
        expect(textExtractors.area("0 m²")).toBe(null);
      });
    });

    describe("text extractor", () => {
      test("should return trimmed text", () => {
        expect(textExtractors.text("  Hello  ")).toBe("Hello");
        expect(textExtractors.text("Test")).toBe("Test");
      });

      test("should return null for empty strings", () => {
        expect(textExtractors.text("")).toBe(null);
        expect(textExtractors.text("   ")).toBe(null);
      });
    });
  });

  describe("createSchemaParser", () => {
    test("should create a curried parser function", () => {
      const schema = z.object({
        yearBuilt: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            { name: "year", selectors: ['[data-testid="year"]'] },
          ],
          extractValue: textExtractors.year,
        },
      };

      const parser = createSchemaParser(schema, options);

      const html = `
        <html>
          <body>
            <div data-testid="year">2015</div>
          </body>
        </html>
      `;

      const result = parser(html);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
      }
    });

    test("should reuse the same parser for multiple HTML inputs", () => {
      const schema = z.object({
        bedrooms: z.number(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        bedrooms: {
          strategies: [
            { name: "bed", selectors: [".bedrooms"] },
          ],
          extractValue: textExtractors.number,
        },
      };

      const parser = createSchemaParser(schema, options);

      const html1 = '<div class="bedrooms">3</div>';
      const html2 = '<div class="bedrooms">4</div>';

      const result1 = parser(html1);
      const result2 = parser(html2);

      expect(E.isRight(result1)).toBe(true);
      expect(E.isRight(result2)).toBe(true);

      if (E.isRight(result1) && E.isRight(result2)) {
        expect(result1.right.bedrooms).toBe(3);
        expect(result2.right.bedrooms).toBe(4);
      }
    });
  });

  describe("Complex real-world scenarios", () => {
    test("should parse property data with mixed strategies", () => {
      const html = `
        <html>
          <body>
            <div class="property-details">
              <dl>
                <dt>Year Built</dt>
                <dd>2015</dd>
                <dt>Land Size</dt>
                <dd>650 m²</dd>
              </dl>
              <div data-testid="bedrooms">4</div>
              <p>This house has 2 bathrooms and a double garage.</p>
            </div>
          </body>
        </html>
      `;

      const schema = z.object({
        yearBuilt: z.number().min(1800),
        landSize: z.object({ value: z.number().positive(), unit: z.literal("m²") }),
        bedrooms: z.number().int().positive(),
        bathrooms: z.number().int().positive(),
      });

      const options: ParseOptions<typeof schema.shape> = {
        yearBuilt: {
          strategies: [
            {
              name: "dl",
              selectors: ['dt:contains("Year Built")'],
              siblingElement: "dd",
            },
          ],
          extractValue: textExtractors.year,
        },
        landSize: {
          strategies: [
            {
              name: "dl",
              selectors: ['dt:contains("Land Size")'],
              siblingElement: "dd",
            },
          ],
          extractValue: textExtractors.area,
        },
        bedrooms: {
          strategies: [
            { name: "testid", selectors: ['[data-testid="bedrooms"]'] },
          ],
          extractValue: textExtractors.number,
        },
        bathrooms: {
          strategies: [
            { name: "selector", selectors: [".bathrooms"] },
          ],
          extractValue: textExtractors.number,
          fallbackPatterns: [/(\d+)\s+bathrooms?/i],
        },
      };

      const result = parseFromHtml(html, schema, options);

      expect(E.isRight(result)).toBe(true);
      if (E.isRight(result)) {
        expect(result.right.yearBuilt).toBe(2015);
        expect(result.right.landSize).toEqual({ value: 650, unit: "m²" });
        expect(result.right.bedrooms).toBe(4);
        expect(result.right.bathrooms).toBe(2);
      }
    });
  });
});
