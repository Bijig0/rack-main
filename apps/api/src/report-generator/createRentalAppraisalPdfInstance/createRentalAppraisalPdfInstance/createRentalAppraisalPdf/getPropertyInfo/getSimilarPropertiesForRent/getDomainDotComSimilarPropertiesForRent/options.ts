import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const similarPropertiesForRentParseOptions = {
  strategies: [
    {
      name: "for-rent-nearby-section",
      selectors: [
        "div:has(> div > h3#for-rent)",
        "div.css-rd9b71:has(h3#for-rent)",
        'div:has(h3:contains("For rent nearby"))',
      ],
      extractText: ($element) => {
        const properties: string[] = [];
        const $links = $element.find('a[id="similar-properties-link"]');

        for (let i = 0; i < $links.length; i++) {
          const $property = $links.eq(i);

          const href = $property.attr("href") || "";
          const price = $property.find('[data-testid="price"]').text().trim();
          const addressLine1 = $property
            .find('[data-testid="address-line1"]')
            .text()
            .trim();
          const addressLine2 = $property
            .find('[data-testid="address-line2"]')
            .text()
            .trim();
          const address = `${addressLine1}${addressLine2}`.trim();
          const image = $property.find("img").attr("src") || "";

          const features: Record<string, string> = {};
          const $features = $property.find('[data-testid="property-features-feature"]');

          for (let j = 0; j < $features.length; j++) {
            const $feature = $features.eq(j);
            const text = $feature
              .find('[data-testid="property-features-text-container"]')
              .text()
              .trim();
            const match = text.match(/(\d+)\s*(\w+)/);
            if (match) {
              features[match[2].toLowerCase()] = match[1];
            }
          }

          if (address || price) {
            properties.push(
              JSON.stringify({ href, price, address, image, features })
            );
          }
        }
        return properties.join("|||");
      },
    },
    {
      name: "data-testid-for-rent",
      selectors: [
        '[data-testid*="for-rent-nearby"]',
        '[data-testid*="forRentNearby"]',
        '[data-testid*="rental-listings"]',
      ],
      extractText: ($element) => {
        const properties: string[] = [];
        const $links = $element.find("a");

        for (let i = 0; i < $links.length; i++) {
          const $property = $links.eq(i);
          const href = $property.attr("href") || "";
          const price = $property.find('[data-testid="price"]').text().trim();
          const address = $property
            .find('[data-testid="address-wrapper"]')
            .text()
            .trim();
          if (address || price) {
            properties.push(JSON.stringify({ href, price, address }));
          }
        }
        return properties.join("|||");
      },
    },
  ],
  extractValue: (
    text: string
  ): Array<{
    address: string;
    pricePerWeek: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    propertyType: string;
  }> | null => {
    if (!text) return null;

    // Handle JSON-encoded properties from extractText
    let rawProperties: any[] = [];

    if (text.includes("|||")) {
      rawProperties = text
        .split("|||")
        .map((propStr) => {
          try {
            return JSON.parse(propStr);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } else {
      // Handle single property
      try {
        const parsed = JSON.parse(text);
        rawProperties = [parsed];
      } catch {
        return null;
      }
    }

    if (rawProperties.length === 0) return null;

    // Transform raw properties to match schema
    const transformedProperties = rawProperties
      .map((prop) => {
        // Parse price - format is "$1300 per week" or "$1,300 per week"
        const priceStr = (prop.price || "").replace(/[,$]/g, "");
        const priceMatch = priceStr.match(/(\d+)/);
        const pricePerWeek = priceMatch ? parseInt(priceMatch[1], 10) : 0;
        if (pricePerWeek <= 0) return null;

        // Parse features
        const features = prop.features || {};
        const bedrooms = parseInt(features.beds || features.bedrooms || "0", 10);
        const bathrooms = parseInt(features.baths || features.bathrooms || "0", 10);
        const parking = parseInt(features.parking || "0", 10);

        // Determine property type from URL or default to "House"
        const href = prop.href || "";
        let propertyType = "House";
        if (href.includes("apartment") || href.includes("unit")) {
          propertyType = "Apartment";
        } else if (href.includes("townhouse")) {
          propertyType = "Townhouse";
        }

        const address = (prop.address || "").trim();
        if (!address) return null;

        return {
          address,
          pricePerWeek,
          bedrooms,
          bathrooms,
          parking,
          propertyType,
        };
      })
      .filter((prop): prop is NonNullable<typeof prop> => prop !== null);

    return transformedProperties.length > 0 ? transformedProperties : null;
  },
  fallbackPatterns: [/for\s+rent[:\s]+([^\n]+)/gi],
} satisfies FieldParseConfig;
