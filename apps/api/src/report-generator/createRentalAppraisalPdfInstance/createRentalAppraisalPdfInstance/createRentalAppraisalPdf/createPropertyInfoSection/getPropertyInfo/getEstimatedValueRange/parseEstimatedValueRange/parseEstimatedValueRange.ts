import { parsePropertyPageDomain } from "../../utils/parsePropertyPageDomain";

type Return = {
  lowText: string | null;
  midText: string | null;
  highText: string | null;
};

/**
 * Parses estimated value range from propertyPageDomain.html
 *
 * The HTML structure from domain.com looks like:
 * Property value estimate
 * Low: $4.04m
 * Mid: $4.59m
 * High: $5.14m
 *
 * @returns Estimated value range text values or null if not found
 */
export async function parseEstimatedValueRange(): Promise<Return> {
  const $ = await parsePropertyPageDomain();

  let lowText: string | null = null;
  let midText: string | null = null;
  let highText: string | null = null;

  // Try to find the property value estimate section
  // Look for text containing "Property value estimate" or similar
  const selectors = [
    'div:contains("Property value estimate")',
    'div:contains("Estimate")',
    'div:contains("property-value")',
    '.property-value-estimate',
    '[data-testid="property-value"]',
  ];

  for (const selector of selectors) {
    const container = $(selector).first();

    if (container.length > 0) {
      // Try to find Low, Mid, High values
      const containerText = container.text();

      // Look for patterns like "Low $4.04m" or "$4.04m" after "Low"
      const lowMatch = containerText.match(/Low[:\s]*\$?([\d.]+m?)/i);
      const midMatch = containerText.match(/Mid[:\s]*\$?([\d.]+m?)/i);
      const highMatch = containerText.match(/High[:\s]*\$?([\d.]+m?)/i);

      if (lowMatch) lowText = lowMatch[1];
      if (midMatch) midText = midMatch[1];
      if (highMatch) highText = highMatch[1];

      if (lowText || midText || highText) {
        console.log(`Found value estimates using selector: ${selector}`);
        console.log(`Low: ${lowText}, Mid: ${midText}, High: ${highText}`);
        break;
      }
    }
  }

  if (!lowText && !midText && !highText) {
    console.warn("⚠️  Could not find estimated value range in HTML");
  }

  return { lowText, midText, highText };
}
