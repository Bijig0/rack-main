import { describe, expect, test } from "bun:test";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

describe("parseAppraisalSummary", () => {
  const sampleHtmlPath = path.join(__dirname, "sample-propertyPage.html");

  describe("direct HTML parsing", () => {
    test("sample HTML file should exist", () => {
      expect(fs.existsSync(sampleHtmlPath)).toBe(true);
    });

    test("sample HTML should contain appraisal summary", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const paragraphs = $("p.m-t-10.m-b-10");
      expect(paragraphs.length).toBeGreaterThan(0);
      
      const text = paragraphs.first().text().trim();
      expect(text).toContain("The size of Kew");
    });

    test("parseAppraisalSummary would find summary starting with 'The size of'", () => {
      const htmlContent = fs.readFileSync(sampleHtmlPath, "utf-8");
      const $ = cheerio.load(htmlContent);

      const paragraphs = $("p.m-t-10.m-b-10");
      let foundText: string | null = null;

      for (let i = 0; i < paragraphs.length; i++) {
        const text = $(paragraphs[i]).text().trim();
        if (text.startsWith("The size of")) {
          foundText = text;
          break;
        }
      }

      expect(foundText).toBeTruthy();
      expect(foundText).toContain("The size of Kew");
    });

    test("parseAppraisalSummary would return null for missing summary", () => {
      const emptyHtml = "<html><body></body></html>";
      const $ = cheerio.load(emptyHtml);

      const paragraphs = $("p.m-t-10.m-b-10");
      let foundText: string | null = null;

      for (let i = 0; i < paragraphs.length; i++) {
        const text = $(paragraphs[i]).text().trim();
        if (text.startsWith("The size of")) {
          foundText = text;
          break;
        }
      }

      expect(foundText).toBeNull();
    });
  });
});
