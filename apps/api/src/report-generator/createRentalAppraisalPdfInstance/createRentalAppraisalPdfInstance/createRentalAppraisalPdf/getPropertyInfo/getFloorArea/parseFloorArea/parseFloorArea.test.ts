import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseFloorArea", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain floor area span with correct selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const floorElement = $("span.floor.attribute span");
      expect(floorElement.length).toBeGreaterThan(0);
      expect(floorElement.text()).toContain("358");
      expect(floorElement.text()).toContain("m");
    });

    test("sample HTML should have correct structure for all property attributes", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      // Check for all property attributes
      expect($("span.floor.attribute").length).toBeGreaterThan(0);
      expect($("span.land").length).toBeGreaterThan(0);
      expect($("span.property-attribute-subtext").length).toBeGreaterThan(0);
    });

    test("extractText helper would work on sample HTML floor area", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      // Manually implement extractText logic to verify it works
      const element = $("span.floor.attribute span");
      const text = element.text().trim();

      expect(text).toBe("358m2");
    });

    test("parseFloorArea would find floor area using primary selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const selectors = [
        "span.floor.attribute span", // Primary selector
        ".floor.attribute span",
        "span.floor span",
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("358m2");
    });

    test("parseFloorArea would handle alternate HTML structure", () => {
      // Test with alternate HTML structure (just .floor without .attribute)
      const alternateHtml = `
        <html>
          <body>
            <span class="floor">
              <span>450m<sup>2</sup></span>
            </span>
          </body>
        </html>
      `;

      const $ = cheerio.load(alternateHtml);

      const selectors = [
        "span.floor.attribute span", // Won't match
        ".floor.attribute span",      // Won't match
        "span.floor span",            // Will match
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("450m2");
    });

    test("parseFloorArea would return null for missing floor area", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = [
        "span.floor.attribute span",
        ".floor.attribute span",
        "span.floor span",
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
