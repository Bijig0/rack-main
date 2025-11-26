import * as fs from "fs";
import * as cheerio from "cheerio";
import { ensurePropertyPageHtml } from "./ensurePropertyPageHtml";

/**
 * Loads and parses propertyPage.html using Cheerio
 * Ensures the HTML file exists before parsing
 *
 * @returns Cheerio root element for querying
 */
export async function parsePropertyPageHtml(): Promise<cheerio.CheerioAPI> {
  // Ensure the HTML file exists (will scrape if needed)
  const htmlPath = await ensurePropertyPageHtml();

  // Read the HTML file
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // Parse with Cheerio (jQuery-like API for server-side HTML parsing)
  const $ = cheerio.load(htmlContent);

  return $;
}

/**
 * Helper function to extract text from a selector
 * Returns null if not found
 *
 * @param $ - Cheerio instance
 * @param selector - CSS selector
 * @returns Trimmed text content or null
 */
export function extractText(
  $: cheerio.CheerioAPI,
  selector: string
): string | null {
  const element = $(selector);
  if (element.length === 0) {
    return null;
  }
  const text = element.text().trim();
  return text || null;
}

/**
 * Helper function to extract attribute from a selector
 * Returns null if not found
 *
 * @param $ - Cheerio instance
 * @param selector - CSS selector
 * @param attribute - Attribute name
 * @returns Attribute value or null
 */
export function extractAttribute(
  $: cheerio.CheerioAPI,
  selector: string,
  attribute: string
): string | null {
  const element = $(selector);
  if (element.length === 0) {
    return null;
  }
  const value = element.attr(attribute);
  return value || null;
}

/**
 * Helper function to extract number from text
 * Removes common formatting (commas, spaces, units)
 *
 * @param text - Text containing a number
 * @returns Parsed number or null
 */
export function extractNumber(text: string | null): number | null {
  if (!text) {
    return null;
  }

  // Remove common formatting: commas, spaces, m², sqm, etc.
  // First remove the units, then extract only digits and decimal points
  const cleaned = text
    .replace(/,/g, "") // Remove commas
    .replace(/m²/gi, "") // Remove m²
    .replace(/m2/gi, "") // Remove m2
    .replace(/sqm/gi, "") // Remove sqm
    .replace(/sq\.?\s*m/gi, "") // Remove sq m, sq. m, etc.
    .replace(/\s+/g, "") // Remove all whitespace
    .match(/\d+\.?\d*/); // Extract number pattern

  if (!cleaned || !cleaned[0]) {
    return null;
  }

  const number = parseFloat(cleaned[0]);

  return isNaN(number) ? null : number;
}

/**
 * Helper function to extract year from text
 *
 * @param text - Text containing a year
 * @returns 4-digit year or null
 */
export function extractYear(text: string | null): number | null {
  if (!text) {
    return null;
  }

  // Look for 4-digit year (1900-2099)
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);

  if (!yearMatch) {
    return null;
  }

  return parseInt(yearMatch[0], 10);
}
