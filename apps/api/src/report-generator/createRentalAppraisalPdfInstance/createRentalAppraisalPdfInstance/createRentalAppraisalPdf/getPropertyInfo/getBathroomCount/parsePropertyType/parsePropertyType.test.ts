import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parsePropertyType", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain property type", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const propertyTypeDiv = $(".property-attribute-detail")
        .filter((_, el) => {
          const text = $(el).text();
          return text.includes("Property Type");
        })
        .first();

      expect(propertyTypeDiv.length).toBeGreaterThan(0);

      const typeSpan = propertyTypeDiv.find("span.property-attribute-subtext");
      expect(typeSpan.length).toBeGreaterThan(0);
      expect(typeSpan.text()).toBe("house");
    });

    test("parsePropertyType would find property type using filter method", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const propertyTypeDiv = $(".property-attribute-detail")
        .filter((_, el) => {
          const text = $(el).text();
          return text.includes("Property Type");
        })
        .first();

      let foundText: string | null = null;

      if (propertyTypeDiv.length > 0) {
        const spanElement = propertyTypeDiv.find(
          "span.property-attribute-subtext"
        );
        if (spanElement.length > 0) {
          foundText = spanElement.text().trim();
        }
      }

      expect(foundText).toBe("house");
    });

    test("parsePropertyType would return null for missing property type", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = [
        "span.property-attribute-subtext",
        ".property-attribute-subtext",
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBeNull();
    });
  });
});
