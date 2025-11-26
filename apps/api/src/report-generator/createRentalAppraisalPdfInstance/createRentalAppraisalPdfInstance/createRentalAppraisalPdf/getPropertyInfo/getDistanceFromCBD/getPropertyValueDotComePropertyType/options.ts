import { FieldParseConfig } from "../../utils/parseFromHtml/parseFromHtml";

export const distanceFromCBDParseOptions = {
  strategies: [
    {
      name: "number-big-km",
      selectors: [".number-big"],
      extractText: ($element) => {
        const text = $element.text().trim();
        if (text.toLowerCase().includes("km")) {
          return text;
        }
        return "";
      },
    },
    {
      name: "table-cell-distance-cbd",
      selectors: [
        'td:contains("Distance from CBD")',
        'td:contains("Distance to CBD")',
        'td:contains("CBD Distance")',
        'td:contains("Distance from City")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "table-row-th",
      selectors: [
        'th:contains("Distance from CBD")',
        'th:contains("Distance to CBD")',
        'th:contains("CBD Distance")',
      ],
      siblingElement: "td" as const,
    },
    {
      name: "data-testid-distance",
      selectors: [
        '[data-testid*="distance-cbd"]',
        '[data-testid*="distanceCBD"]',
        '[data-testid*="cbd-distance"]',
        '[data-testid*="cbdDistance"]',
      ],
    },
    {
      name: "definition-list",
      selectors: [
        'dt:contains("Distance from CBD")',
        'dt:contains("Distance to CBD")',
        'dt:contains("CBD Distance")',
      ],
      siblingElement: "dd" as const,
    },
  ],
  extractValue: (text: string): { value: number; unit: "km" } | null => {
    if (!text) return null;

    const kmMatch = text.match(/(\d+(?:\.\d+)?)\s*km/i);
    if (kmMatch) {
      const distance = parseFloat(kmMatch[1]);
      if (!isNaN(distance) && distance >= 0) {
        return {
          value: distance,
          unit: "km",
        };
      }
    }

    return null;
  },
  fallbackPatterns: [
    /distance\s+(?:from|to)\s+cbd[:\s]+(\d+(?:\.\d+)?)\s*km/i,
    /cbd\s+distance[:\s]+(\d+(?:\.\d+)?)\s*km/i,
    /(\d+(?:\.\d+)?)\s*km\s+(?:from|to)\s+cbd/i,
  ],
} satisfies FieldParseConfig;
