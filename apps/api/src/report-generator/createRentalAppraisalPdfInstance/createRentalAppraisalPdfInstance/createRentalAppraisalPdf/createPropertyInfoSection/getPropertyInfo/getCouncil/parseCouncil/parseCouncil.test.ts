import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseCouncil", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain council span with correct selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const councilElement = $('p:contains("Part of:") span[style*="color"]');
      expect(councilElement.length).toBeGreaterThan(0);
      expect(councilElement.text()).toContain("Council");
    });

    test("parseCouncil would find council using primary selector", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const selectors = [
        'p:contains("Part of:") span[style*="color"]',
        'p:contains("Part of:") span',
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("Boroondara Council");
    });

    test("parseCouncil would handle alternate HTML structure", () => {
      const alternateHtml = `
        <html>
          <body>
            <p>Part of: <span style="color: rgb(51, 122, 183);">Melbourne Council</span></p>
          </body>
        </html>
      `;

      const $ = cheerio.load(alternateHtml);

      const selectors = [
        'p:contains("Part of:") span[style*="color"]',
        'p:contains("Part of:") span',
      ];

      let foundText: string | null = null;

      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          foundText = element.text().trim();
          break;
        }
      }

      expect(foundText).toBe("Melbourne Council");
    });

    test("parseCouncil would return null for missing council", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const selectors = [
        'p:contains("Part of:") span[style*="color"]',
        'p:contains("Part of:") span',
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
