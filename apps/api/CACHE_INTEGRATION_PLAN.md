# HTML Cache Integration Plan

## Summary

Your cache system is now ready! Here's what's been completed and what needs to be done.

## ✅ Completed

1. **Created `ReportCache` class** in `createReportCache.ts` with explicit methods:
   - `retrieve(key)` - Get from cache (returns `undefined` if not cached)
   - `fetchNew(key, fetcher)` - Fetch and cache new HTML
   - `fetchOrRetrieve(key, fetcher)` - Convenience method (try cache first, fetch if needed)
   - `has(key)` - Check if cached
   - `set(key, value)` - Manually set cache
   - `clear()` - Clear all caches

2. **Updated `getPropertyInfo.ts`** to instantiate `ReportCache` and pass it to all `get*` functions

## 🔨 Next Steps: Update Each get* Function

Each `get*` function needs to:
1. Add `htmlCache` to its `Args` type
2. Use the cache to get HTML instead of calling `parseYearBuilt()` etc directly

### Pattern to Follow

**Before:**
```typescript
type Args = {
  address: Address;
};

const getYearBuilt = async ({ address }: Args): Promise<Return> => {
  const { yearBuiltText } = await parseYearBuilt();  // ❌ Old way
  // ... rest of function
};
```

**After:**
```typescript
import { ReportCache } from "../utils/createReportCache";

type Args = {
  address: Address;
  htmlCache: ReportCache;  // ✅ Add cache as class instance
};

const getYearBuilt = async ({ address, htmlCache }: Args): Promise<Return> => {
  // ✅ Option 1: Use convenience method
  const html = await htmlCache.fetchOrRetrieve(
    "corelogic",  // or whichever source this function uses
    async () => {
      // Fetch HTML (run scraper if needed)
      await runSeleniumLogin(address);
      return fs.readFileSync(path.join(__dirname, "../utils/propertyPage.html"), "utf-8");
    }
  );

  // Parse from the cached HTML
  const { yearBuiltText } = parseYearBuiltFromHtml(html);
  // ... rest of function
};
```

### Alternative: Explicit retrieve/fetchNew Pattern

If you prefer more explicit control over cache operations:

```typescript
const getYearBuilt = async ({ address, htmlCache }: Args): Promise<Return> => {
  // Try to retrieve from cache first (explicit)
  let html = htmlCache.retrieve("corelogic");

  // If not cached, fetch new (explicit)
  if (html === undefined) {
    html = await htmlCache.fetchNew("corelogic", async () => {
      await runSeleniumLogin(address);
      return fs.readFileSync(path.join(__dirname, "../utils/propertyPage.html"), "utf-8");
    });
  }

  // Parse from HTML
  const { yearBuiltText } = parseYearBuiltFromHtml(html);
  // ... rest
};
```

## Files That Need Updates

### 1. getYearBuilt/getYearBuilt.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parseYearBuilt()`
- Needs: Update to accept `htmlCache` and use it

### 2. getLandArea/getLandArea.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parseLandArea()`
- Needs: Update to accept `htmlCache` and use it

### 3. getFloorArea/getFloorArea.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parseFloorArea()`
- Needs: Update to accept `htmlCache` and use it

### 4. getPropertyType/getPropertyType.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parsePropertyType()`
- Needs: Update to accept `htmlCache` and use it

### 5. getCouncil/getCouncil.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parseCouncil()`
- Needs: Update to accept `htmlCache` and use it

### 6. getDistanceFromCBD/getDistanceFromCBD.ts
- Source: `"corelogic"` (PropertyHub)
- Current parser: `parseDistanceFromCBD()`
- Needs: Update to accept `htmlCache` and use it

### 7. getNearbySchools/getNearbySchools.ts
- Source: `"corelogic"` (PropertyHub) or possibly `"microburbs.com"`
- Current parser: `parseNearbySchools()`
- Needs: Update to accept `htmlCache` and use it

## Cache Sources Available

From `propertyInfoSourcesSchema`:
- `"domain.com"` - Domain.com scraper
- `"realestate.com"` - RealEstate.com scraper
- `"microburbs.com"` - MicroBurbs scraper
- `"corelogic"` - PropertyHub/CoreLogic scraper
- `"property.com"` - Property.com scraper

## Expected Behavior After Integration

**First `get*` function called:**
```
getYearBuilt() calls htmlCache.fetchOrRetrieve("corelogic")
→ ❌ Cache MISS: corelogic
→ 🌐 Fetching NEW: corelogic - Running scraper...
→ [Scraper runs, HTML saved]
→ ✅ Cached: corelogic
```

**Subsequent `get*` functions:**
```
getLandArea() calls htmlCache.fetchOrRetrieve("corelogic")
→ 📦 Cache HIT: corelogic
→ [Returns cached HTML instantly, no scraping]

getFloorArea() calls htmlCache.fetchOrRetrieve("corelogic")
→ 📦 Cache HIT: corelogic
→ [Returns cached HTML instantly, no scraping]
```

**Result:** PropertyHub is scraped only ONCE per report, saving ~3-5 seconds per report!

## Class Usage Summary

**In `getPropertyInfo.ts`:**
```typescript
import { ReportCache } from "./utils/createReportCache";

const getPropertyInfo = async ({ address }: Args): Promise<Return> => {
  const htmlCache = new ReportCache();  // ✅ Instantiate class

  try {
    await getYearBuilt({ address, htmlCache });  // Pass instance
    await getLandArea({ address, htmlCache });
    // ... etc
  } finally {
    htmlCache.clear();  // Cleanup
  }
};
```

**In each `get*` function:**
```typescript
import { ReportCache } from "../utils/createReportCache";

type Args = {
  address: Address;
  htmlCache: ReportCache;  // ✅ Receive class instance
};

const getYearBuilt = async ({ address, htmlCache }: Args): Promise<Return> => {
  // Use instance methods
  const html = await htmlCache.fetchOrRetrieve("corelogic", fetcher);
  // OR
  const html = htmlCache.retrieve("corelogic");
  // OR
  const html = await htmlCache.fetchNew("corelogic", fetcher);
};
```

## Implementation Notes

- The cache is a **class instance**, not a function closure
- Each report gets a **new instance** via `new ReportCache()`
- All `get*` functions receive the **same instance** for that report
- Cache is **automatically garbage collected** after report completion
- You can call `htmlCache.clear()` explicitly in `finally` block if desired
