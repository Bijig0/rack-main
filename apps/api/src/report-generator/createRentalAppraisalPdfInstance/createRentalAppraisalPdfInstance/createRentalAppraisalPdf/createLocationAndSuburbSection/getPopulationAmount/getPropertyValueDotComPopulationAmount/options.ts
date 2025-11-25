import { FieldParseConfig } from "../../../createPropertyInfoSection/getPropertyInfo/utils/parseFromHtml/parseFromHtml";

export const populationParseOptions = {
  strategies: [
    {
      name: "population-number-big-contextual",
      selectors: [".graph"],

      extractText: ($element) => {
        // 1. Confirm this `.graph` block is for "Population"
        const heading = $element.find("h3").text().trim().toLowerCase();
        if (!heading.includes("population")) return "";

        // 2. Extract the `.number-big` value ONLY within this block
        const numberText = $element.find(".number-big").first().text().trim();
        return numberText || "";
      },
    },

    // Backup selector if structure changes but still near the heading
    {
      name: "population-heading-sibling",
      selectors: ['h3:contains("Population")', 'h3:contains("population")'],
      extractText: ($element) => {
        // Go up to parent block and find .number-big
        const container = $element.closest(".graph");
        const text = container.find(".number-big").first().text().trim();
        return text || "";
      },
    },

    // Very broad fallbacks (last resort)
    {
      name: "population-loose-fallback",
      selectors: ['[data-testid*="population"]', ".population-value"],
    },
  ],

  // Convert text → number (e.g., "24k" → 24000, "2.5m" → 2500000)
  extractValue: (text: string): number | null => {
    if (!text) return null;

    // Normalise: remove spaces, commas
    const normalized = text.replace(/,/g, "").trim().toLowerCase();

    // Handle formats like:
    // 24k, 2.5k, 1.2m
    const suffixMatch = normalized.match(/^(\d+(?:\.\d+)?)(k|m)$/);
    if (suffixMatch) {
      const num = parseFloat(suffixMatch[1]);
      const suffix = suffixMatch[2];

      const factor = suffix === "k" ? 1000 : 1_000_000;

      return Math.round(num * factor);
    }

    // Plain number
    const numMatch = normalized.match(/^\d+$/);
    if (numMatch) {
      return parseInt(numMatch[0], 10);
    }

    return null;
  },

  fallbackPatterns: [
    /population[:\s]+(\d+(?:\.\d+)?)(k|m)?/i,
    /(\d+(?:\.\d+)?)(k|m)\s+population/i,
  ],
} satisfies FieldParseConfig;
