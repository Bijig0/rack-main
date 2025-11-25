import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const propertyImageParseOptions = {
  strategies: [
    {
      name: "table-image-medium",
      selectors: ['img[id^="tableImageMedium"]', 'img[id*="tableImage"]'],
      extractText: ($element) => $element.attr("src") || "",
    },
    {
      name: "data-testid-property-image",
      selectors: [
        '[data-testid*="property-image"] img',
        '[data-testid*="propertyImage"] img',
        '[data-testid*="property_image"] img',
        '[data-testid*="hero-image"] img',
        '[data-testid*="main-image"] img',
        '[data-testid*="listing-image"] img',
      ],
      extractText: ($element) => $element.attr("src") || "",
    },
    {
      name: "class-property-image",
      selectors: [
        ".property-image img",
        ".property_image img",
        ".hero-image img",
        ".main-image img",
        ".listing-image img",
        ".property-photo img",
        ".gallery-main img",
      ],
      extractText: ($element) => $element.attr("src") || "",
    },
    {
      name: "og-image-meta",
      selectors: [
        'meta[property="og:image"]',
        'meta[name="og:image"]',
        'meta[property="twitter:image"]',
      ],
      extractText: ($element) => $element.attr("content") || "",
    },
    {
      name: "figure-image",
      selectors: [
        "figure.property-image img",
        "figure.hero img",
        "figure.main-photo img",
        "article img",
      ],
      extractText: ($element) => $element.attr("src") || "",
    },
  ],
  extractValue: (text: string): string | null => {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (
      trimmed.startsWith("http") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/")
    ) {
      return trimmed;
    }
    return null;
  },
  fallbackPatterns: [
    /["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i,
    /src=["'](\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i,
  ],
} satisfies FieldParseConfig;
