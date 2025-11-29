import { parsePropertyPageHtml } from "../../utils/parsePropertyPageHtml";

type Return = {
  propertyTypeText: string | null;
};

/**
 * Parses the property type from propertyPage.html
 *
 * The HTML structure is:
 * <div class="col-md-6 property-attribute-detail">Property Type<br><span class="property-attribute-subtext">house</span></div>
 *
 * @returns Property type text or null if not found
 */
export async function parsePropertyType(): Promise<Return> {
  // Load and parse the HTML
  const $ = await parsePropertyPageHtml();

  // Find the div that contains "Type" text (preceded by "Property"), then get the span within it
  const propertyTypeDiv = $(".property-attribute-detail")
    .filter((_, el) => {
      const text = $(el).text();
      // Match "Type" or "Property Type" but not "Development Zone" type
      return (
        (text.includes("Property") && text.includes("Type")) ||
        (text.trim().startsWith("Type") && !text.includes("Development"))
      );
    })
    .first();

  if (propertyTypeDiv.length > 0) {
    const spanElement = propertyTypeDiv.find("span.property-attribute-subtext");

    if (spanElement.length > 0) {
      const propertyTypeText = spanElement.text().trim();

      if (propertyTypeText) {
        console.log(
          `Found property type text: "${propertyTypeText}" from Property Type div`
        );
        return { propertyTypeText };
      }
    }
  }

  console.warn("⚠️  Could not find property type in HTML");
  return { propertyTypeText: null };
}
