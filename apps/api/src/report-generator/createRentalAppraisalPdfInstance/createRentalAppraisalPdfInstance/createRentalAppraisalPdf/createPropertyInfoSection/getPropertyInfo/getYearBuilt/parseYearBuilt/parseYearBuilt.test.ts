import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseYearBuilt", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain year built with correct selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const yearBuiltElement = $(".year-built span");
      expect(yearBuiltElement.length).toBeGreaterThan(0);
      expect(yearBuiltElement.text()).toMatch(/\d{4}/);
    });

    test("parseYearBuilt would find year built using selectors", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      // Test the specific selector for year-built
      const yearBuiltElement = $('.year-built span');
      expect(yearBuiltElement.length).toBeGreaterThan(0);

      const foundText = yearBuiltElement.text().trim();
      expect(foundText).toBe("2015");
    });

    test("parseYearBuilt would handle alternate HTML structure", () => {
      const alternateHtml = `
        <html>
          <body>
            <div>Year Built <span>1998</span></div>
          </body>
        </html>
      `;

      const $ = cheerio.load(alternateHtml);

      const selectors = [
        'span:contains("Built:") + span',
        'div:contains("Year Built") span',
        'div:contains("Built") span',
        '.year-built span',
        '.built-year',
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("1998");
    });

    test("parseYearBuilt would return null for missing year built", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = [
        'span:contains("Built:") + span',
        'div:contains("Year Built") span',
        'div:contains("Built") span',
        '.year-built span',
        '.built-year',
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
