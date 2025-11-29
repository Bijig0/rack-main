import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseLandArea", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain land area span with correct selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const landElement = $("span.land span");
      expect(landElement.length).toBeGreaterThan(0);
      expect(landElement.text()).toContain("537");
      expect(landElement.text()).toContain("m");
    });

    test("parseLandArea would find land area using primary selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const selectors = ["span.land span", ".land span", "span.land"];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("537m2");
    });

    test("parseLandArea would handle alternate HTML structure", () => {
      const alternateHtml = `
        <html>
          <body>
            <span class="land">
              <span>650m<sup>2</sup></span>
            </span>
          </body>
        </html>
      `;

      const $ = cheerio.load(alternateHtml);

      const selectors = ["span.land span", ".land span", "span.land"];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("650m2");
    });

    test("parseLandArea would return null for missing land area", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = ["span.land span", ".land span", "span.land"];

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
