# parseFromHtml - HTML Parsing with Strategies

A flexible, schema-validated HTML parser that uses configurable strategies to extract structured data from HTML content.

## Overview

`parseFromHtml` is designed to solve a common problem: extracting data from HTML when you don't know the exact structure ahead of time. It tries multiple approaches (strategies) in order until it finds the data, then validates the results against a Zod schema.

## Core Concepts

### 1. Strategies

A **strategy** defines one way to locate and extract data from HTML. Each strategy consists of:

- **Name**: A descriptive label for debugging
- **Selectors**: CSS selectors to try (in order)
- **Sibling Element** (optional): Extract from a sibling instead of the matched element
- **Custom Extract Function** (optional): Custom text extraction logic

### 2. Field Configuration

Each field you want to extract has its own configuration:

```typescript
{
  strategies: ParseStrategy[],      // List of strategies to try
  extractValue: (text) => any,      // Function to parse/validate the text
  fallbackPatterns?: RegExp[]       // Regex patterns as last resort
}
```

### 3. Parse Options

Maps schema keys to their field configurations, ensuring type safety:

```typescript
type ParseOptions<T> = {
  [K in keyof T]: FieldParseConfig;
};
```

## How Strategy Selection Works

The parser follows this algorithm for each field:

```
For each field in the schema:
  1. Try each strategy in order
     For each strategy:
       For each CSS selector:
         a. Find element(s) matching the selector
         b. Extract text (from element or sibling)
         c. Run extractValue() on the text
         d. If valid (not null/undefined), RETURN this value ✓

  2. If all strategies failed, try fallback patterns
     For each regex pattern:
       a. Search entire body text
       b. Extract captured group
       c. Run extractValue() on the text
       d. If valid, RETURN this value ✓

  3. If everything failed, set field to null

Finally: Validate all fields against Zod schema
```

## Strategy Types

### 1. Direct Element Selection

The simplest strategy - select an element and extract its text.

```typescript
{
  name: "year-built",
  selectors: ['[data-testid="year-built"]', '.year', '.property-year']
}
```

**How it works:**
1. Tries `[data-testid="year-built"]` first
2. If not found, tries `.year`
3. If not found, tries `.property-year`
4. First match wins

**Example HTML:**
```html
<div data-testid="year-built">2015</div>
```

---

### 2. Sibling Element Selection (dt/dd, th/td patterns)

Extract data from a sibling element after matching a label.

```typescript
{
  name: "definition-list",
  selectors: ['dt:contains("Year Built")'],
  siblingElement: "dd"
}
```

**How it works:**
1. Finds `<dt>` containing "Year Built"
2. Looks at the next `<dd>` sibling
3. Extracts text from that `<dd>`

**Example HTML:**
```html
<dl>
  <dt>Year Built</dt>
  <dd>2015</dd>
</dl>
```

This is perfect for definition lists, table rows, or any label→value pattern.

---

### 3. Custom Text Extraction

Use a custom function to extract text from the matched element.

```typescript
{
  name: "price",
  selectors: ['.price'],
  extractText: ($el) => $el.text().replace(/[$,]/g, "")
}
```

**How it works:**
1. Finds element matching `.price`
2. Runs custom function to extract/clean text
3. Returns cleaned text for parsing

**Example HTML:**
```html
<div class="price">$1,500,000</div>
<!-- extractText returns: "1500000" -->
```

---

### 4. Fallback Regex Patterns

When all strategies fail, search the entire page with regex.

```typescript
{
  strategies: [...],
  extractValue: textExtractors.year,
  fallbackPatterns: [/built\s+in\s+(\d{4})/i, /constructed:\s*(\d{4})/i]
}
```

**How it works:**
1. Grabs all body text
2. Tries first regex pattern
3. If match found, extracts captured group
4. Runs extractValue() on captured text

**Example HTML:**
```html
<p>This beautiful home was built in 2015 in the heart of the city.</p>
<!-- Pattern /built\s+in\s+(\d{4})/i captures: "2015" -->
```

## Complete Example

Here's a real-world example parsing property data:

```typescript
import { z } from "zod";
import { parseFromHtml, textExtractors } from "./parseFromHtml";

// Define your schema
const PropertySchema = z.object({
  yearBuilt: z.number().min(1800),
  landSize: z.number().positive(),
  bedrooms: z.number().int().positive(),
  council: z.string().nullable(),
});

// Configure parsing strategies for each field
const result = parseFromHtml(html, PropertySchema, {
  yearBuilt: {
    strategies: [
      // Try data attributes first
      {
        name: "data-attribute",
        selectors: ['[data-testid*="year"]', '[data-year]'],
      },
      // Try definition list pattern
      {
        name: "definition-list",
        selectors: ['dt:contains("Year Built")', 'dt:contains("Built")'],
        siblingElement: "dd",
      },
      // Try common class names
      {
        name: "class-names",
        selectors: ['.year-built', '.property-year', '.year'],
      },
    ],
    extractValue: textExtractors.year,
    fallbackPatterns: [/built\s+(?:in\s+)?(\d{4})/i],
  },

  landSize: {
    strategies: [
      {
        name: "primary",
        selectors: ['[data-testid*="land"]', '.land-size'],
      },
      {
        name: "dl-pattern",
        selectors: ['dt:contains("Land Size")', 'dt:contains("Land")'],
        siblingElement: "dd",
      },
    ],
    extractValue: textExtractors.area,
  },

  bedrooms: {
    strategies: [
      {
        name: "primary",
        selectors: ['[data-testid*="bed"]', '.bedrooms'],
      },
    ],
    extractValue: textExtractors.number,
    fallbackPatterns: [/(\d+)\s+bed(?:room)?s?/i],
  },

  council: {
    strategies: [
      {
        name: "council",
        selectors: ['.council-name', '[data-council]'],
      },
    ],
    extractValue: textExtractors.text,
  },
});

// Result is Either<PropertyData, Error>
if (E.isRight(result)) {
  console.log(result.right);
  // { yearBuilt: 2015, landSize: 650, bedrooms: 4, council: "Boroondara" }
} else {
  console.error(result.left.message);
  // "Schema validation failed: ..."
}
```

## Strategy Order Matters

Strategies are tried **in the order you define them**. Put the most specific/reliable strategies first:

```typescript
strategies: [
  // ✓ GOOD: Specific data attributes (most reliable)
  { name: "data-attr", selectors: ['[data-testid="year-built"]'] },

  // ✓ GOOD: Semantic patterns (reliable)
  { name: "dl", selectors: ['dt:contains("Year")'], siblingElement: "dd" },

  // ⚠️  OK: Common class names (less reliable, may change)
  { name: "classes", selectors: ['.year-built', '.year'] },

  // ❌ LAST RESORT: Generic classes (high false positive rate)
  { name: "generic", selectors: ['.value', '.data'] },
]
```

## Text Extractors

The `extractValue` function converts text to the desired type. Common extractors are provided:

### `textExtractors.year`
```typescript
textExtractors.year("Built in 2015") // → 2015
textExtractors.year("1799")          // → null (too old)
textExtractors.year("abc")           // → null
```

### `textExtractors.number`
```typescript
textExtractors.number("42")       // → 42
textExtractors.number("1,500")    // → 1500
textExtractors.number("abc")      // → null
```

### `textExtractors.area`
```typescript
textExtractors.area("650 m²")              // → 650
textExtractors.area("500 sqm")             // → 500
textExtractors.area("1,200 square meters") // → 1200
```

### `textExtractors.text`
```typescript
textExtractors.text("  Hello  ")  // → "Hello"
textExtractors.text("")           // → null
```

### Custom Extractors

Create your own for domain-specific parsing:

```typescript
const extractPrice = (text: string): number | null => {
  const match = text.match(/\$?([\d,]+(?:\.\d{2})?)/);
  if (!match) return null;

  const price = parseFloat(match[1].replace(/,/g, ""));
  return isNaN(price) ? null : price;
};

// Usage
{
  strategies: [...],
  extractValue: extractPrice  // "$1,500,000.00" → 1500000
}
```

## Schema Validation

After parsing, all fields are validated against the Zod schema:

```typescript
const schema = z.object({
  yearBuilt: z.number().min(1800).max(2030),  // Must be reasonable year
  landSize: z.number().positive(),             // Must be positive
  bedrooms: z.number().int().min(1),          // Must be integer ≥ 1
  council: z.string().nullable(),             // Optional string
});
```

If validation fails, you get a descriptive error:

```typescript
if (E.isLeft(result)) {
  console.log(result.left.message);
  // "Schema validation failed: [
  //   { code: 'too_small', minimum: 1800, path: ['yearBuilt'] }
  // ]"
}
```

## Curried Parser

For repeated parsing with the same schema/options, create a curried parser:

```typescript
const parseProperty = createSchemaParser(PropertySchema, parseOptions);

// Reuse for multiple HTML documents
const result1 = parseProperty(html1);
const result2 = parseProperty(html2);
const result3 = parseProperty(html3);
```

## Debugging

The parser logs which strategy/selector found each field:

```
✓ Found via strategy: data-attribute ([data-testid="year-built"])
✓ Found via strategy: dl-pattern (dt:contains("Land Size"))
✓ Found via fallback pattern: /(\d+)\s+bedrooms?/i
```

This helps you:
- Understand which strategies are working
- Identify when fallbacks are being used
- Optimize strategy order for performance

## Best Practices

### 1. Order Strategies by Reliability

```typescript
strategies: [
  { name: "data-testid", selectors: ['[data-testid="year"]'] },    // Most reliable
  { name: "semantic", selectors: ['dt:contains("Year")'], siblingElement: "dd" },
  { name: "classes", selectors: ['.year-built', '.year'] },        // Less reliable
]
```

### 2. Use Specific Selectors First

```typescript
// ✓ GOOD
selectors: [
  '[data-testid="land-size"]',
  '.property-land-size',
  '.land-size'
]

// ❌ BAD (too generic, high false positives)
selectors: [
  '.value',
  '.data',
  'span'
]
```

### 3. Provide Fallback Patterns for Critical Fields

```typescript
yearBuilt: {
  strategies: [...],
  extractValue: textExtractors.year,
  fallbackPatterns: [
    /built\s+(?:in\s+)?(\d{4})/i,
    /constructed\s+(?:in\s+)?(\d{4})/i,
    /year\s*:\s*(\d{4})/i
  ]
}
```

### 4. Make Optional Fields Nullable in Schema

```typescript
const schema = z.object({
  yearBuilt: z.number(),           // Required
  council: z.string().nullable(),  // Optional - returns null if not found
});
```

### 5. Validate Extracted Values

Always validate in your `extractValue` function:

```typescript
const extractYear = (text: string): number | null => {
  const year = parseInt(text);
  if (isNaN(year)) return null;
  if (year < 1800 || year > 2030) return null;  // Reasonable range
  return year;
};
```

## Error Handling

The parser returns an `Either<Data, Error>`:

```typescript
const result = parseFromHtml(html, schema, options);

if (E.isRight(result)) {
  // ✓ Success - data is typed and validated
  const data = result.right;
  console.log(`Year: ${data.yearBuilt}`);
} else {
  // ❌ Validation failed
  console.error(result.left.message);
  // Handle error (log, retry, use defaults, etc.)
}
```

## Performance Tips

1. **Order matters**: Put fastest strategies first
2. **Avoid excessive selectors**: 3-5 per strategy is usually enough
3. **Cache parsed schemas**: Reuse `createSchemaParser` for the same document type
4. **Limit fallback patterns**: They search the entire body text (slow)

## Type Safety

The parser is fully typed with TypeScript:

```typescript
// Schema shape determines required options
const schema = z.object({
  yearBuilt: z.number(),
  landSize: z.number(),
});

// ✓ Type-safe: must provide configs for ALL fields
const options: ParseOptions<typeof schema.shape> = {
  yearBuilt: { ... },
  landSize: { ... },
};

// ❌ Compile error: missing 'landSize'
const badOptions: ParseOptions<typeof schema.shape> = {
  yearBuilt: { ... },
};
```

## Testing

See `parseFromHtml.test.ts` for comprehensive test examples covering:
- Basic field parsing
- Strategy selection
- Sibling elements
- Custom extractors
- Fallback patterns
- Schema validation
- Error handling

## Summary

`parseFromHtml` provides a robust, flexible way to extract structured data from HTML:

- ✅ **Multiple strategies** - Try different approaches until one works
- ✅ **Type-safe** - Full TypeScript support with Zod schemas
- ✅ **Validated** - Automatic schema validation with descriptive errors
- ✅ **Flexible** - Custom extractors, sibling elements, regex fallbacks
- ✅ **Debuggable** - Logs show which strategy found each field
- ✅ **Composable** - Reusable text extractors and curried parsers
