import { PropertyScraper } from "../types";
import { PropertyMetadata } from "../../cache/schemas";
import { scrapePropertyCom } from "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapePropertyCom/scrapePropertyCom";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

/**
 * Property.com scraper adapter
 *
 * Wraps the existing scrapePropertyCom function to match the PropertyScraper interface
 * Note: scrapePropertyCom requires a propertyId parameter
 */
export class PropertyComScraper implements PropertyScraper {
  name = "Property.com";

  supportedFields: Array<keyof PropertyMetadata> = [
    "propertyType",
    "yearBuilt",
    "landArea",
    "floorArea",
    "estimatedValueRange",
  ];

  /**
   * Property ID for scrapePropertyCom
   * This should be set before calling scrape, or we'll skip this scraper
   */
  private propertyId?: string;

  constructor(propertyId?: string) {
    this.propertyId = propertyId;
  }

  async scrape(addressString: string): Promise<Partial<PropertyMetadata>> {
    console.log(`🌐 ${this.name}: Scraping for "${addressString}"...`);

    // Property.com requires a propertyId - if we don't have one, skip
    if (!this.propertyId) {
      console.log(`⚠️  ${this.name}: No propertyId provided, skipping...`);
      return {};
    }

    // Parse address string back to Address object
    const addressParts = addressString.split(",").map((p) => p.trim());
    const address = {
      addressLine: addressParts[0] || "",
      suburb: addressParts[1] || "",
      state: (addressParts[2] || "").split(" ")[0] || "VIC",
      postcode: (addressParts[2] || "").split(" ")[1] || "",
    };

    try {
      // Call existing scraper (saves HTML to file)
      await scrapePropertyCom(address, this.propertyId);

      // Read the saved HTML
      const htmlPath = path.join(
        __dirname,
        "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapePropertyCom/propertyPagePropertyCom.html"
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
   * Parse Property.com HTML to extract property data
   *
   * Uses multiple selector strategies to find data in Property.com's HTML
   */
  private parseHtml(html: string): Partial<PropertyMetadata> {
    const $ = cheerio.load(html);
    const data: Partial<PropertyMetadata> = {};

    try {
      // Property type - look for common patterns
      const propertyTypePatterns = [
        '[data-testid*="property-type"]',
        '.property-type',
        'dt:contains("Property Type") + dd',
        'th:contains("Type") + td',
        '.listing-details__type',
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
        '[data-testid*="year"]',
        'dt:contains("Year Built") + dd',
        'dt:contains("Built") + dd',
        'th:contains("Year") + td',
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
        '.land-size',
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
        'dt:contains("Building Area") + dd',
        'th:contains("Floor") + td',
        '.floor-area',
      ];
      for (const selector of floorAreaPatterns) {
        const text = $(selector).first().text().trim();
        const areaMatch = text.match(/\d+[\d,]*\s*m²?/i);
        if (areaMatch) {
          data.floorArea = areaMatch[0];
          break;
        }
      }

      // Estimated value - Property.com often shows price estimates
      const pricePatterns = [
        '.price-estimate',
        '[data-testid*="estimate"]',
        '.estimated-value',
        'dt:contains("Estimated Value") + dd',
      ];
      for (const selector of pricePatterns) {
        const text = $(selector).first().text().trim();
        // Look for price ranges like "$1.2M - $1.4M" or "$1,200,000 - $1,400,000"
        const rangeMatch = text.match(/\$?([\d,]+(?:\.\d+)?)\s*([MKmk])?\s*[-–]\s*\$?([\d,]+(?:\.\d+)?)\s*([MKmk])?/);
        if (rangeMatch) {
          const parseAmount = (amount: string, suffix?: string) => {
            let num = parseFloat(amount.replace(/,/g, ''));
            if (suffix?.toUpperCase() === 'M') num *= 1_000_000;
            if (suffix?.toUpperCase() === 'K') num *= 1_000;
            return num;
          };

          const min = parseAmount(rangeMatch[1], rangeMatch[2]);
          const max = parseAmount(rangeMatch[3], rangeMatch[4]);

          data.estimatedValueRange = {
            min,
            max,
            currency: "AUD",
          };
          break;
        }
      }

      console.log(`   📊 Extracted from Property.com:`, Object.keys(data));
    } catch (error) {
      console.warn(`⚠️  ${this.name}: Error parsing some fields:`, error);
    }

    return data;
  }
}
