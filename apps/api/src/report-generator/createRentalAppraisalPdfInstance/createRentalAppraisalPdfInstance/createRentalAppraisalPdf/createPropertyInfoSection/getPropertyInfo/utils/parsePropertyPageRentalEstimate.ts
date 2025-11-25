import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

/**
 * Loads and parses the propertyPageRentalEstimate.html file
 * @returns Cheerio instance with loaded HTML
 */
export async function parsePropertyPageRentalEstimate(): Promise<cheerio.CheerioAPI> {
  const htmlPath = path.join(
    __dirname,
    "../getPropertyImage/createGoogleStreetViewUrl/scrapeRealEstateComPropertyImage/propertyPageRentalEstimate.html"
  );

  if (!fs.existsSync(htmlPath)) {
    throw new Error(
      `propertyPageRentalEstimate.html not found at ${htmlPath}. Please run scrapeRealEstateComPropertyImage first.`
    );
  }

  const htmlContent = fs.readFileSync(htmlPath, "utf-8");
  return cheerio.load(htmlContent);
}
