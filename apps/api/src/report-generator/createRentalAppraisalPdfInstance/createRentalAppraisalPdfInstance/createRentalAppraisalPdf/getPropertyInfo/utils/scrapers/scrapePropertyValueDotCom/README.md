# PropertyValue.com.au Scraper

This scraper extracts property data from PropertyValue.com.au by searching for the address.

## Approach

Instead of trying to construct URLs directly, this scraper:

1. **Navigates to PropertyValue.com.au homepage**
2. **Closes cookie consent modal** if present
3. **Searches for the address** using the search bar
4. **Clicks the first matching result**
5. **Extracts the property page HTML**

This approach automatically handles the property ID requirement since the search results contain the correct URLs.

## Implementation

The `searchAndNavigate` function:
1. Navigates to PropertyValue.com.au
2. Looks for and closes any cookie consent modals
3. Finds the search input field
4. Types the full address
5. Waits for search results to appear
6. Clicks the first property link
7. Waits for the property page to load

### Workflow

```typescript
// Step 1: Search and navigate to property page
await searchAndNavigate({ address, page });

// Step 2: Close any remaining popups
await closePopupModal(page);

// Step 3: Extract HTML
const html = await page.content();
```

## Testing

To test the search and navigate flow:

```bash
bun run src/report-generator/.../searchAndNavigate/testSearchAndNavigate.ts
```

This will:
- Launch a real browser
- Navigate to PropertyValue.com.au
- Search for "7 English Place, Kew VIC 3101"
- Click the first result
- Take a screenshot of the property page

## URL Structure

PropertyValue.com.au uses URLs like:
```
https://www.propertyvalue.com.au/property/7-english-place-kew-vic-3101/16062963
```

The property ID (e.g., `16062963`) is discovered through search, not constructed.

## Notes

- Cookie consent modals are handled automatically
- The scraper tries multiple selectors to find the search input
- Falls back to pressing Enter if clicking search results fails
- Uses human-like typing delays to avoid detection
