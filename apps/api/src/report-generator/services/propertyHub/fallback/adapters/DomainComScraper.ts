import { PropertyScraper } from "../types";
import { PropertyMetadata } from "../../cache/schemas";
import { scrapeDomainCom } from "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapeDomainCom/scrapeDomainCom";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

/**
 * Domain.com scraper adapter
 *
 * Wraps the existing scrapeDomainCom function to match the PropertyScraper interface
 */
export class DomainComScraper implements PropertyScraper {
  name = "Domain.com";

  supportedFields: Array<keyof PropertyMetadata> = [
    "propertyType",
    "yearBuilt",
    "landArea",
    "floorArea",
    // Domain has these fields but may vary by listing
  ];

  async scrape(addressString: string): Promise<Partial<PropertyMetadata>> {
    console.log(`🌐 ${this.name}: Scraping for "${addressString}"...`);

    // Parse address string back to Address object
    // This is a simple parser - you may need to make it more robust
    const addressParts = addressString.split(",").map((p) => p.trim());
    const address = {
      addressLine: addressParts[0] || "",
      suburb: addressParts[1] || "",
      state: (addressParts[2] || "").split(" ")[0] || "VIC",
      postcode: (addressParts[2] || "").split(" ")[1] || "",
    };

    try {
      // Call existing scraper (saves HTML to file)
      await scrapeDomainCom(address);

      // Read the saved HTML
      const htmlPath = path.join(
        __dirname,
        "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapeDomainCom/propertyPageDomain.html"
      );

      if (!fs.existsSync(htmlPath)) {
        console.log(`❌ ${this.name}: HTML file not found after scraping`);
        return {};
      }

      const html = fs.readFileSync(htmlPath, "utf-8");

      // Parse HTML to extract fields
      const data = this.parseHtml(html);

      console.log(`✅ ${this.name}: Extracted ${Object.keys(data).length} fields`);
      return data;
    } catch (error) {
      console.error(`❌ ${this.name} scraping failed:`, error);
      return {};
    }
  }

  /**
   * Parse Domain.com HTML to extract property data
   *
   * Uses multiple selector strategies to find data in Domain.com's HTML
   */
  private parseHtml(html: string): Partial<PropertyMetadata> {
    const $ = cheerio.load(html);
    const data: Partial<PropertyMetadata> = {};

    try {
      // Strategy: Search for text patterns in the HTML
      // Domain.com often displays data in key-value pairs or specific sections

      // Property type - look for common patterns
      const propertyTypePatterns = [
        '[data-testid*="property-type"]',
        '.property-type',
        'dt:contains("Property Type") + dd',
        'th:contains("Property Type") + td',
      ];
      for (const selector of propertyTypePatterns) {
        const text = $(selector).first().text().trim();
        if (text) {
          data.propertyType = text;
          break;
        }
      }

      // Year built - look for patterns
      const yearBuiltPatterns = [
        '[data-testid*="year-built"]',
        'dt:contains("Year Built") + dd',
        'th:contains("Year Built") + td',
        'span:contains("Built"):parent',
      ];
      for (const selector of yearBuiltPatterns) {
        const text = $(selector).first().text().trim();
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          data.yearBuilt = yearMatch[0];
          break;
        }
      }

      // Land area - look for patterns
      const landAreaPatterns = [
        '[data-testid*="land"]',
        'dt:contains("Land Size") + dd',
        'dt:contains("Land Area") + dd',
        'th:contains("Land") + td',
      ];
      for (const selector of landAreaPatterns) {
        const text = $(selector).first().text().trim();
        const areaMatch = text.match(/\d+[\d,]*\s*m²?/i);
        if (areaMatch) {
          data.landArea = areaMatch[0];
          break;
        }
      }

      // Floor area - look for patterns
      const floorAreaPatterns = [
        '[data-testid*="floor"]',
        '[data-testid*="building"]',
        'dt:contains("Floor Area") + dd',
        'dt:contains("Building Size") + dd',
        'th:contains("Floor") + td',
      ];
      for (const selector of floorAreaPatterns) {
        const text = $(selector).first().text().trim();
        const areaMatch = text.match(/\d+[\d,]*\s*m²?/i);
        if (areaMatch) {
          data.floorArea = areaMatch[0];
          break;
        }
      }

      console.log(`   📊 Extracted from Domain.com:`, Object.keys(data));
    } catch (error) {
      console.warn(`⚠️  ${this.name}: Error parsing some fields:`, error);
    }

    return data;
  }
}
