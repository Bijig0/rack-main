import * as cheerio from "cheerio";
import { z } from "zod";
import * as E from "effect/Either";

/**
 * Strategy for parsing HTML content
 */
export type ParseStrategy = {
  /** Name of the strategy for debugging */
  name: string;
  /** CSS selectors to try */
  selectors: string[];
  /** Optional: Extract value from sibling element (for dt/dd, th/td patterns) */
  siblingElement?: "dd" | "td";
  /** Optional: Custom text extraction function */
  extractText?: ($element: cheerio.Cheerio<any>) => string;
};

/**
 * Field-specific parsing configuration
 */
export type FieldParseConfig = {
  /** List of parsing strategies to try in order */
  strategies: ParseStrategy[];
  /** Function to extract and validate the final value from text */
  extractValue: (text: string) => any;
  /** Optional: Regex patterns to search in body text as fallback */
  fallbackPatterns?: RegExp[];
};

/**
 * Parse options that map schema keys to their parsing strategies
 * This type ensures that every key in the schema has a corresponding parse config
 */
export type ParseOptions<T extends z.ZodRawShape> = {
  [K in keyof T]: FieldParseConfig;
};

/**
 * Parse a single field from HTML using the provided strategies
 */
const parseField = (html: string, config: FieldParseConfig): any => {
  const $ = cheerio.load(html);

  // Try each strategy in order
  for (const strategy of config.strategies) {
    for (const selector of strategy.selectors) {
      try {
        const $element = $(selector);

        if ($element.length === 0) continue;

        let text: string;

        // If we need to look at a sibling element (e.g., dt -> dd)
        if (strategy.siblingElement) {
          const $sibling = $element.next(strategy.siblingElement);
          text = strategy.extractText
            ? strategy.extractText($sibling)
            : $sibling.text().trim();
        } else {
          text = strategy.extractText
            ? strategy.extractText($element)
            : $element.text().trim();
        }

        if (!text) continue;

        // Try to extract the value
        const value = config.extractValue(text);
        if (value !== null && value !== undefined) {
          console.log(
            `   ✓ Found via strategy: ${strategy.name} (${selector})`
          );
          return value;
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }
  }

  // Fallback: Try regex patterns on body text
  if (config.fallbackPatterns) {
    const bodyText = $("body").text();

    for (const pattern of config.fallbackPatterns) {
      const match = bodyText.match(pattern);
      if (match) {
        const capturedText = match[1] || match[0];
        const value = config.extractValue(capturedText);
        if (value !== null && value !== undefined) {
          console.log(`   ✓ Found via fallback pattern: ${pattern}`);
          return value;
        }
      }
    }
  }

  return null;
};

/**
 * Parse HTML and validate against Zod schema
 *
 * @param html - The HTML content to parse
 * @param schema - Zod schema to validate against
 * @param options - Parse configurations for each field in the schema
 * @returns Either with validation errors or parsed data
 *
 * @example
 * const PropertySchema = z.object({
 *   yearBuilt: z.number().min(1800),
 *   landSize: z.number().positive(),
 *   bedrooms: z.number().int().positive(),
 * });
 *
 * const result = parseFromHtml(html, PropertySchema, {
 *   yearBuilt: {
 *     strategies: [{ name: 'year', selectors: ['[data-testid*="year"]'] }],
 *     extractValue: textExtractors.year,
 *   },
 *   landSize: {
 *     strategies: [{ name: 'land', selectors: ['[data-testid*="land"]'] }],
 *     extractValue: textExtractors.area,
 *   },
 *   bedrooms: {
 *     strategies: [{ name: 'bed', selectors: ['[data-testid*="bed"]'] }],
 *     extractValue: textExtractors.number,
 *   },
 * });
 */
export const parseFromHtml = <T extends z.ZodRawShape>(
  html: string,
  schema: z.ZodObject<T>,
  options: ParseOptions<T>
): E.Either<z.infer<z.ZodObject<T>>, Error> => {
  const rawData: Record<string, any> = {};

  // Parse each field according to its configuration
  for (const [fieldName, fieldConfig] of Object.entries(options)) {
    const value = parseField(html, fieldConfig as FieldParseConfig);
    rawData[fieldName] = value;
  }

  // Validate against Zod schema
  const result = schema.safeParse(rawData);

  if (result.success) {
    return E.right(result.data);
  } else {
    return E.left(
      new Error(`Schema validation failed: ${result.error.message}`)
    );
  }
};

/**
 * Create a curried parser with pre-configured schema and options
 */
export const createSchemaParser = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  options: ParseOptions<T>
) => {
  return (html: string): E.Either<z.infer<z.ZodObject<T>>, Error> => {
    return parseFromHtml(html, schema, options);
  };
};

/**
 * Common text extractors for reuse
 */
export const textExtractors = {
  /**
   * Extract a 4-digit year from text
   */
  year: (text: string): number | null => {
    if (!text) return null;

    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      const currentYear = new Date().getFullYear();
      // Validate year is reasonable (1800 to current year + 5)
      if (year >= 1800 && year <= currentYear + 5) {
        return year;
      }
    }
    return null;
  },

  /**
   * Extract a number (with optional commas) from text
   */
  number: (text: string): number | null => {
    if (!text) return null;

    const numberMatch = text.match(/[\d,]+/);
    if (numberMatch) {
      const number = parseInt(numberMatch[0].replace(/,/g, ""), 10);
      if (!isNaN(number)) {
        return number;
      }
    }
    return null;
  },

  /**
   * Extract area with m² or sqm (returns object with value and unit)
   */
  area: (text: string): { value: number; unit: "m²" } | null => {
    if (!text) return null;

    const areaMatch = text.match(
      /(\d+[\d,]*)\s*(?:m²|m2|sqm|square\s*meters?)/i
    );
    if (areaMatch) {
      const area = parseInt(areaMatch[1].replace(/,/g, ""), 10);
      if (!isNaN(area) && area > 0) {
        return { value: area, unit: "m²" };
      }
    }
    return null;
  },

  /**
   * Extract plain text (no transformation)
   */
  text: (text: string): string | null => {
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed : null;
  },
};
