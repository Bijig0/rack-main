import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  distanceFromCBDText: string | null;
};

/**
 * Parses the distance from CBD from propertyPage.html
 *
 * The HTML structure is:
 * <h3 class="distanceFromCityCenter">7 km</h3>
 *
 * @returns Distance from CBD text or null if not found
 */
export async function parseDistanceFromCBD(): Promise<Return> {
  const $ = await parsePropertyPageHtml();

  const selectors = [
    "h3.distanceFromCityCenter",
    ".distanceFromCityCenter",
  ];

  for (const selector of selectors) {
    const distanceFromCBDText = extractText($, selector);

    if (distanceFromCBDText) {
      console.log(
        `Found distance from CBD text: "${distanceFromCBDText}" using selector: ${selector}`
      );
      return { distanceFromCBDText };
    }
  }

  console.warn("⚠️  Could not find distance from CBD in HTML");
  return { distanceFromCBDText: null };
}
