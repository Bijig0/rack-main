import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  landAreaText: string | null;
};

/**
 * Parses the land area from propertyPage.html
 *
 * The HTML structure is:
 * <span class="land"><span>537m<sup>2</sup></span></span>
 *
 * @returns Land area text or null if not found
 */
export async function parseLandArea(): Promise<Return> {
  // Load and parse the HTML
  const $ = await parsePropertyPageHtml();

  // Try multiple selectors to find land area
  const selectors = [
    "span.land span", // Primary selector
    ".land span",
    "span.land",
  ];

  for (const selector of selectors) {
    const landAreaText = extractText($, selector);

    if (landAreaText) {
      console.log(
        `Found land area text: "${landAreaText}" using selector: ${selector}`
      );

      if (landAreaText !== null) {
        console.log(`Parsed land area: ${landAreaText} m²`);
        return { landAreaText };
      }
    }
  }

  console.warn("⚠️  Could not find land area in HTML");
  return { landAreaText: null };
}
