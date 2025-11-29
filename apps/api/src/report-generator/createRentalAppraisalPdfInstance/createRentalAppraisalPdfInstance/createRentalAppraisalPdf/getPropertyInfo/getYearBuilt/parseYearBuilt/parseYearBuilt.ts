import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  yearBuiltText: string | null;
};

/**
 * Parses the year built from propertyPage.html
 *
 * The HTML structure might be:
 * <div class="year-built">Built: <span>2015</span></div>
 * or similar variations
 *
 * Note: Year built data may not be available in all property pages
 *
 * @returns Year built text or null if not found
 */
export async function parseYearBuilt(): Promise<Return> {
  // Load and parse the HTML
  const $ = await parsePropertyPageHtml();

  // Try multiple selectors to find year built
  // Note: These selectors are based on common patterns, but the actual
  // propertyPage.html may not contain year built data
  const selectors = [
    'span:contains("Built:") + span',
    'div:contains("Year Built") span',
    'div:contains("Built") span',
    '.year-built span',
    '.built-year',
  ];

  for (const selector of selectors) {
    const yearBuiltText = extractText($, selector);

    if (yearBuiltText) {
      console.log(
        `Found year built text: "${yearBuiltText}" using selector: ${selector}`
      );

      return { yearBuiltText };
    }
  }

  console.warn("⚠️  Could not find year built in HTML");
  return { yearBuiltText: null };
}
