import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseDistanceFromCBD", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain distance from CBD", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const distanceElement = $("h3.distanceFromCityCenter");
      expect(distanceElement.length).toBeGreaterThan(0);
      expect(distanceElement.text()).toBe("7 km");
    });

    test("parseDistanceFromCBD would find distance using selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const selectors = ["h3.distanceFromCityCenter", ".distanceFromCityCenter"];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("7 km");
    });

    test("parseDistanceFromCBD would return null for missing distance", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = ["h3.distanceFromCityCenter", ".distanceFromCityCenter"];

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
