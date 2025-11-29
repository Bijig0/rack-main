import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  councilText: string | null;
};

/**
 * Parses the council from propertyPage.html
 *
 * The HTML structure is:
 * <p>Part of: <span style="color: rgb(51, 122, 183);">Boroondara Council</span></p>
 *
 * @returns Council text or null if not found
 */
export async function parseCouncil(): Promise<Return> {
  // Load and parse the HTML
  const $ = await parsePropertyPageHtml();

  // Try multiple selectors to find council
  const selectors = [
    'p:contains("Part of:") span[style*="color"]', // Primary selector
    'p:contains("Part of:") span',
  ];

  for (const selector of selectors) {
    const councilText = extractText($, selector);

    if (councilText) {
      console.log(
        `Found council text: "${councilText}" using selector: ${selector}`
      );

      return { councilText };
    }
  }

  console.warn("⚠️  Could not find council in HTML");
  return { councilText: null };
}
