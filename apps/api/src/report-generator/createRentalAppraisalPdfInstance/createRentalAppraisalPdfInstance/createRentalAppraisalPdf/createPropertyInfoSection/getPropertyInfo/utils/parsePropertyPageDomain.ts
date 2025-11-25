import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

/**
 * Loads and parses the propertyPageDomain.html file
 * @returns Cheerio instance with loaded HTML
 */
export async function parsePropertyPageDomain(): Promise<cheerio.CheerioAPI> {
  const htmlPath = path.join(
    __dirname,
    "../getPropertyImage/createGoogleStreetViewUrl/scrapeDomainCom/propertyPageDomain.html"
  );

  if (!fs.existsSync(htmlPath)) {
    throw new Error(
      `propertyPageDomain.html not found at ${htmlPath}. Please run scrapeDomainCom first.`
    );
  }

  const htmlContent = fs.readFileSync(htmlPath, "utf-8");
  return cheerio.load(htmlContent);
}
