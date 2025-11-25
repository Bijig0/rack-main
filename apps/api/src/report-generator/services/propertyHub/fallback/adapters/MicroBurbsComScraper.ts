import { PropertyScraper } from "../types";
import { PropertyMetadata } from "../../cache/schemas";
import { scrapeMicroBurbsCom } from "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapeMicroBurbsCom/scrapeMicroBurbsCom";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

/**
 * MicroBurbs.com scraper adapter
 *
 * Wraps the existing scrapeMicroBurbsCom function to match the PropertyScraper interface
 * Note: MicroBurbs provides suburb-level data, not property-specific data
 */
export class MicroBurbsComScraper implements PropertyScraper {
  name = "MicroBurbs.com";

  supportedFields: Array<keyof PropertyMetadata> = [
    "nearbySchools",
    "appraisalSummary",
    // MicroBurbs has suburb demographics, schools, etc.
  ];

  async scrape(addressString: string): Promise<Partial<PropertyMetadata>> {
    console.log(`🌐 ${this.name}: Scraping for "${addressString}"...`);

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
      await scrapeMicroBurbsCom(address);

      // Read the saved HTML
      const htmlPath = path.join(
        __dirname,
        "../../../../createRentalAppraisalPdfInstance/createRentalAppraisalPdfInstance/createRentalAppraisalPdf/createPropertyInfoSection/getPropertyInfo/getPropertyImage/createGoogleStreetViewUrl/scrapeMicroBurbsCom/propertyPageMicroBurbs.html"
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
   * Parse MicroBurbs.com HTML to extract property data
   *
   * MicroBurbs provides suburb-level insights, demographics, schools
   */
  private parseHtml(html: string): Partial<PropertyMetadata> {
    const $ = cheerio.load(html);
    const data: Partial<PropertyMetadata> = {};

    try {
      // MicroBurbs has suburb reports with schools data
      // Look for schools section
      const schoolsPatterns = [
        '.schools-section',
        '[data-section="schools"]',
        'section:contains("Schools")',
        'div:contains("Nearby Schools")',
      ];

      for (const selector of schoolsPatterns) {
        const schoolsSection = $(selector).first();
        if (schoolsSection.length > 0) {
          // Extract school names
          const schools = schoolsSection
            .find('li, .school-item, .school-name')
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(Boolean);

          if (schools.length > 0) {
            // Convert to PropertyMetadata format
            data.nearbySchools = schools.map((name) => ({
              name,
              distance: null, // MicroBurbs might not provide distance
              type: null,
            }));
            break;
          }
        }
      }

      // Look for suburb summary/appraisal text
      const summaryPatterns = [
        '.suburb-summary',
        '.overview',
        '[data-section="overview"]',
        'section:contains("Overview")',
      ];

      for (const selector of summaryPatterns) {
        const text = $(selector).first().text().trim();
        if (text && text.length > 50) {
          data.appraisalSummary = text;
          break;
        }
      }

      console.log(`   📊 Extracted from MicroBurbs.com:`, Object.keys(data));
    } catch (error) {
      console.warn(`⚠️  ${this.name}: Error parsing some fields:`, error);
    }

    return data;
  }
}
