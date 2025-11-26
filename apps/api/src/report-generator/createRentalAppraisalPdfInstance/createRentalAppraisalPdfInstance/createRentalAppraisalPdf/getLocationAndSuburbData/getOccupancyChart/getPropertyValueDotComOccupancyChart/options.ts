import { FieldParseConfig } from "../../../createPropertyInfoSection/getPropertyInfo/utils/parseFromHtml/parseFromHtml";
import { OccupancyChart } from "../types";

export const occupancyChartParseOptions = {
  strategies: [
    // Look for Highcharts SVG containing household/occupancy data
    // The chart typically has legend items like "Childless Couples", "Couples with Children", etc.
    {
      name: "highcharts-household-svg",
      selectors: ["svg"],
      extractText: ($element) => {
        // Get the outer HTML of the SVG
        const svgHtml = $element.toString();

        // Skip empty or tiny SVGs (placeholder/utility SVGs)
        const widthMatch = svgHtml.match(/width="(\d+)/);
        const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
        if (width < 100) return "";

        // Check if this SVG contains household/occupancy related content
        const hasHouseholdData =
          svgHtml.includes("Childless Couples") ||
          svgHtml.includes("Couples with Children") ||
          svgHtml.includes("Single Parents") ||
          svgHtml.includes("Family Composition") ||
          svgHtml.includes("Household") ||
          svgHtml.includes("Occupancy");

        // Also check for Highcharts pie chart indicators
        const isHighchartsPie =
          svgHtml.includes("highcharts-series") &&
          svgHtml.includes("highcharts-legend");

        if (hasHouseholdData && isHighchartsPie) {
          return svgHtml;
        }

        return "";
      },
    },

    // Alternative: Look for SVG inside a container with household-related class/id
    {
      name: "household-container-svg",
      selectors: [
        ".household-chart svg",
        ".occupancy-chart svg",
        ".family-composition svg",
        '[data-chart-type="household"] svg',
        '[data-chart-type="occupancy"] svg',
      ],
      extractText: ($element) => $element.toString() || "",
    },

    // Highcharts container pattern
    {
      name: "highcharts-container-svg",
      selectors: [".highcharts-container svg", '[id^="highcharts-"] svg'],
      extractText: ($element) => {
        const svgHtml = $element.toString();
        // Only return if it looks like a pie chart with legend
        if (
          svgHtml.includes("highcharts-legend") &&
          svgHtml.includes("highcharts-series")
        ) {
          return svgHtml;
        }
        return "";
      },
    },
  ],

  // Extract the SVG data
  extractValue: (text: string): OccupancyChart | null => {
    if (!text || !text.includes("<svg")) return null;

    // Find the main SVG (the one with actual dimensions, not 0x0)
    // Sometimes multiple SVGs are concatenated
    const svgMatches = text.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi);
    if (!svgMatches) return null;

    // Find the SVG with the largest dimensions (the actual chart)
    let bestSvg = "";
    let maxSize = 0;

    for (const svg of svgMatches) {
      const widthMatch = svg.match(/width="(\d+)/);
      const heightMatch = svg.match(/height="(\d+)/);
      const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
      const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;
      const size = width * height;

      if (size > maxSize) {
        maxSize = size;
        bestSvg = svg;
      }
    }

    if (!bestSvg) return null;

    // Extract width and height from the best SVG
    const widthMatch = bestSvg.match(/width="(\d+)/);
    const heightMatch = bestSvg.match(/height="(\d+)/);

    const width = widthMatch ? parseInt(widthMatch[1], 10) : undefined;
    const height = heightMatch ? parseInt(heightMatch[1], 10) : undefined;

    return {
      svg: bestSvg,
      width,
      height,
    };
  },

  fallbackPatterns: [
    // Match SVG elements that contain household-related text
    /<svg[^>]*width="\d{3,}"[^>]*>[\s\S]*?(Childless Couples|Couples with Children|Single Parents)[\s\S]*?<\/svg>/i,
  ],
} satisfies FieldParseConfig;
