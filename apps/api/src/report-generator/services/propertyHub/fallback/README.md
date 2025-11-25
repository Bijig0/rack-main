# Fallback Scraper System

Provides a waterfall strategy for filling missing property data fields when PropertyHub doesn't have all the information.

## Architecture

```
PropertyHub (primary)
    ↓ (missing fields?)
Domain.com (fallback 1)
    ↓ (still missing?)
MicroBurbs.com (fallback 2)
    ↓ (still missing?)
Property.com (fallback 3)
```

## Features

- **Selective field filling**: Only scrapes for missing fields, never overwrites existing data
- **Early stopping**: Stops trying fallbacks once all fields are filled
- **Smart routing**: Skips scrapers that can't provide the missing fields
- **Graceful degradation**: Continues to next scraper if one fails
- **Field-specific scrapers**: Each scraper declares which fields it can provide

## Supported Fields by Scraper

| Field | PropertyHub | Domain.com | MicroBurbs | Property.com |
|-------|-------------|------------|------------|--------------|
| `yearBuilt` | ✅ | ✅ | ❌ | ✅ |
| `floorArea` | ✅ | ✅ | ❌ | ✅ |
| `landArea` | ✅ | ✅ | ❌ | ✅ |
| `propertyType` | ✅ | ✅ | ❌ | ✅ |
| `council` | ✅ | ❌ | ❌ | ❌ |
| `distanceFromCBD` | ✅ | ❌ | ❌ | ❌ |
| `nearbySchools` | ❌ | ❌ | ✅ | ❌ |
| `appraisalSummary` | ❌ | ❌ | ✅ | ❌ |
| `estimatedValueRange` | ❌ | ❌ | ❌ | ✅ |

## Usage

### Basic Usage (Automatic)

The fallback system is automatically initialized in `getPropertyInfo.ts`:

```typescript
import { PropertyHubService } from './services/propertyHub';

const data = await PropertyHubService.getPropertyData(address);
// Fallbacks are automatically used if initialized
```

### Manual Initialization

```typescript
import { PropertyHubService, initializeFallbackScrapers } from './services/propertyHub';

// Initialize once at app startup
initializeFallbackScrapers({
  propertyId: '12345', // Optional: for Property.com
});

// Fetch with fallbacks enabled (default)
const data = await PropertyHubService.getPropertyData(address, {
  enableFallbacks: true,
  maxFallbacks: 3,
});
```

### Disable Fallbacks

```typescript
const data = await PropertyHubService.getPropertyData(address, {
  enableFallbacks: false,
});
```

### Limit Fallback Attempts

```typescript
const data = await PropertyHubService.getPropertyData(address, {
  maxFallbacks: 1, // Only try first fallback (Domain.com)
});
```

### Only Use Fallbacks for Specific Fields

```typescript
const data = await PropertyHubService.getPropertyData(address, {
  onlyFallbackForFields: ['yearBuilt', 'landArea'],
});
```

## Adding New Scrapers

1. Create adapter class implementing `PropertyScraper`:

```typescript
import { PropertyScraper } from "../types";
import { PropertyMetadata } from "../../cache/schemas";

export class MyCustomScraper implements PropertyScraper {
  name = "MyCustomScraper";

  supportedFields: Array<keyof PropertyMetadata> = [
    "yearBuilt",
    "landArea",
  ];

  async scrape(address: string): Promise<Partial<PropertyMetadata>> {
    // Your scraping logic here
    return {
      yearBuilt: "2020",
      landArea: "500 m²",
    };
  }
}
```

2. Register in `initializeFallbackScrapers.ts`:

```typescript
import { MyCustomScraper } from "./adapters/MyCustomScraper";

fallbackScraperRegistry.register(new MyCustomScraper());
```

## Testing

Run the test script to verify fallback integration:

```bash
bun run src/report-generator/services/propertyHub/test-fallback.ts
```

## Implementation Details

### FallbackScraperRegistry

Central registry that manages the waterfall strategy:

- `register(scraper)`: Add a scraper to the registry
- `fillMissingFields(data, address, options)`: Main waterfall logic
- `getMissingFields(data)`: Identify null/undefined fields

### PropertyScraper Interface

```typescript
interface PropertyScraper {
  name: string;
  supportedFields: Array<keyof PropertyMetadata>;
  scrape(address: string): Promise<Partial<PropertyMetadata>>;
}
```

### Adapter Pattern

Each adapter wraps an existing scraper function:

1. Parses address string to `Address` object
2. Calls existing scraper (e.g., `scrapeDomainCom()`)
3. Reads saved HTML file
4. Parses HTML to extract fields
5. Returns `Partial<PropertyMetadata>`

## Troubleshooting

### Scraper not being called

- Check if scraper is registered: `fallbackScraperRegistry.getScrapers()`
- Check if field is in `supportedFields`
- Check if field is already filled (fallbacks only fill missing fields)

### Property.com not working

Property.com requires a `propertyId`:

```typescript
initializeFallbackScrapers({ propertyId: '12345' });
```

### All fallbacks failing

Check console logs for specific errors. Common issues:

- Bot detection (scrapers use Playwright with anti-bot settings)
- Network issues
- HTML structure changed (update CSS selectors)
