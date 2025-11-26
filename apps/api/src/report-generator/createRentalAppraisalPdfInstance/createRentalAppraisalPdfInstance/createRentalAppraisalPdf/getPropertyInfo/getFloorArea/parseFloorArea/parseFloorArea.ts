import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  floorAreaText: string | null;
};

/**
 * Parses the floor area from propertyPage.html
 *
 * The HTML structure is:
 * <span class="floor attribute"><span>358m<sup>2</sup></span></span>
 *
 * @returns Floor area in square meters, or null if not found
 */
export async function parseFloorArea(): Promise<Return> {
  // Load and parse the HTML
  const $ = await parsePropertyPageHtml();

  // Try multiple selectors to find floor area
  const selectors = [
    "span.floor.attribute span", // Primary selector
    ".floor.attribute span",
    "span.floor span",
  ];

  for (const selector of selectors) {
    const floorAreaText = extractText($, selector);

    if (floorAreaText) {
      console.log(
        `Found floor area text: "${floorAreaText}" using selector: ${selector}`
      );

      // Extract number from text (handles "358m²", "358 sqm", etc.)

      if (floorAreaText !== null) {
        console.log(`Parsed floor area: ${floorAreaText} m²`);
        return { floorAreaText };
      }
    }
  }

  console.warn("⚠️  Could not find floor area in HTML");
  return { floorAreaText: null };
}
