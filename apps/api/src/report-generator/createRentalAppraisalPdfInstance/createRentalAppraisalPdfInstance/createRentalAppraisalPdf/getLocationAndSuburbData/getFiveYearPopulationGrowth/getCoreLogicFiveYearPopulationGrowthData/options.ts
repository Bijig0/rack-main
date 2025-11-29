import { FieldParseConfig } from "../../../createPropertyInfoSection/getPropertyInfo/utils/parseFromHtml/parseFromHtml";

export const populationParseOptions = {
  strategies: [
    // CoreLogic PropertyHub pattern: div.col-md-4 containing "5 year population change" text
    // Structure: <div class="col-md-4"><h3>0.4%</h3>5 year population change</div>
    {
      name: "corelogic-col-md-4-contextual",
      selectors: [".col-md-4"],
      extractText: ($element) => {
        // Check if this div contains "5 year population change" text
        const fullText = $element.text().toLowerCase();
        if (
          fullText.includes("5 year population") ||
          fullText.includes("population change") ||
          fullText.includes("population growth")
        ) {
          // The H3 inside contains the percentage value
          const h3Text = $element.find("h3").first().text().trim();
          if (h3Text && h3Text.includes("%")) {
            return h3Text;
          }
        }
        return "";
      },
    },

    // Alternative: Look for any container with population change text
    {
      name: "population-change-contextual",
      selectors: [".col-details div", ".stat-card", ".metric-card"],
      extractText: ($element) => {
        const fullText = $element.text().toLowerCase();
        if (
          fullText.includes("5 year population") ||
          fullText.includes("population change")
        ) {
          const h3Text = $element.find("h3").first().text().trim();
          return h3Text || "";
        }
        return "";
      },
    },

    // Table-based selectors
    {
      name: "table-cell-population-growth",
      selectors: [
        'td:contains("Population Growth")',
        'td:contains("5 Year Growth")',
        'td:contains("5-Year Growth")',
        'th:contains("Population Growth")',
      ],
      siblingElement: "td" as const,
    },

    // Data attribute selectors
    {
      name: "data-testid-growth",
      selectors: [
        '[data-testid*="population-growth"]',
        '[data-testid*="populationGrowth"]',
        '[data-testid*="5-year-growth"]',
        '[data-testid*="fiveYearGrowth"]',
      ],
    },
  ],

  // Convert text → percentage number (e.g., "0.4%" → 0.4, "+3.5%" → 3.5)
  extractValue: (text: string): number | null => {
    if (!text) return null;

    // Normalise: remove spaces
    const normalized = text.trim();

    // Handle percentage formats: "0.4%", "+5.2%", "-2.1%", "5.2 %"
    const percentMatch = normalized.match(/([+-]?\d+(?:\.\d+)?)\s*%/);
    if (percentMatch) {
      const num = parseFloat(percentMatch[1]);
      if (!isNaN(num)) {
        return num;
      }
    }

    // Handle plain decimal that looks like a percentage (e.g., "5.2" when context says growth)
    const plainNumMatch = normalized.match(/^([+-]?\d+(?:\.\d+)?)$/);
    if (plainNumMatch) {
      const num = parseFloat(plainNumMatch[1]);
      // Only accept reasonable percentage values (between -50 and +100)
      if (!isNaN(num) && num >= -50 && num <= 100) {
        return num;
      }
    }

    return null;
  },

  fallbackPatterns: [
    // Pattern: "0.4%5 year population change" (text concatenated without space)
    /([+-]?\d+(?:\.\d+)?)\s*%\s*5\s*year\s*population/i,
    // Standard patterns
    /population\s+(?:change|growth)[:\s]+([+-]?\d+(?:\.\d+)?)\s*%?/i,
    /5\s*year\s+(?:population\s+)?(?:change|growth)[:\s]+([+-]?\d+(?:\.\d+)?)\s*%?/i,
    /([+-]?\d+(?:\.\d+)?)\s*%\s+(?:population\s+)?(?:change|growth)/i,
  ],
} satisfies FieldParseConfig;
