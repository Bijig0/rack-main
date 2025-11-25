# Complete Programmatic Workflow

This guide shows you how to programmatically read and update Figma fields using code.

## Overview

```
┌─────────────────┐
│  1. Design      │  Create template in Figma with {fieldName} naming
└────────┬────────┘
         │
┌────────▼────────┐
│  2. Scrape      │  Extract field IDs and structure via API
└────────┬────────┘
         │
┌────────▼────────┐
│  3. Map Data    │  Your app maps data to field names
└────────┬────────┘
         │
┌────────▼────────┐
│  4. Generate    │  Create JSON for plugin
└────────┬────────┘
         │
┌────────▼────────┐
│  5. Update      │  Plugin applies changes in Figma
└────────┬────────┘
         │
┌────────▼────────┐
│  6. Export      │  Screenshot/PDF/PNG
└─────────────────┘
```

## Step 1: Design Your Figma Template

In Figma, name your text nodes using the `{fieldName}` convention:

```
Text nodes:
├─ {customerName}      → Will be replaced with actual customer name
├─ {invoiceNumber}     → Will be replaced with invoice number
├─ {invoiceDate}       → Will be replaced with date
├─ {totalAmount}       → Will be replaced with amount
└─ {address}           → Will be replaced with address

Frames (for lists):
└─ LineItem[]
   ├─ {description}
   ├─ {quantity}
   └─ {price}
```

**Example Figma Design:**
```
┌─────────────────────────────┐
│   Invoice                   │
│   Customer: {customerName}  │
│   Invoice #: {invoiceNumber}│
│   Date: {invoiceDate}       │
│   Total: {totalAmount}      │
└─────────────────────────────┘
```

## Step 2: Run the Programmatic Script

```bash
cd src/figma-scrape

# Generate update JSON
bun programmatic-update.ts

# Or use npm script
npm run generate-updates
```

**What it does:**
1. Scrapes your Figma file via API
2. Finds all `{fieldName}` text nodes
3. Maps your data to these fields
4. Generates JSON for the plugin
5. Displays copy-paste instructions

**Output:**
```json
[
  {
    "nodeId": "123:456",
    "newValue": "Jane Doe"
  },
  {
    "nodeId": "123:457",
    "newValue": "INV-2024-12345"
  }
]
```

## Step 3: Apply Updates in Figma

1. **Open the plugin** in Figma:
   - Plugins > Development > Figma Scraper Bridge

2. **Paste the JSON**:
   - Scroll to "Batch Update (JSON)"
   - Paste the output from step 2
   - Click "Apply Batch Updates"

3. **Done!** All fields are updated ✅

## Customizing for Your Data

Edit `programmatic-update.ts` to match your data structure:

```typescript
// Your data interface
interface YourData {
  fieldName1: string;
  fieldName2: string;
  // ... add your fields
}

// Your actual data
const yourData: YourData = {
  fieldName1: "Value 1",
  fieldName2: "Value 2",
};

// Map function
function mapDataToFields(data: YourData, dynamicFields: any[]) {
  const updates = [];

  dynamicFields.forEach((field) => {
    const fieldName = field.name.slice(1, -1); // Remove { }

    // Your mapping logic
    if (fieldName in data) {
      updates.push({
        nodeId: field.id,
        newValue: data[fieldName],
      });
    }
  });

  return updates;
}
```

## Advanced: Full Automation

### Option A: Copy to Clipboard (Requires clipboardy)

```bash
# Install clipboardy
bun add clipboardy

# In programmatic-update.ts, uncomment:
const clipboardy = await import('clipboardy');
await clipboardy.default.write(pluginJSON);
```

Then just paste in Figma plugin!

### Option B: Save to File

```typescript
import { writeFileSync } from 'fs';

// Save updates to file
writeFileSync('updates.json', pluginJSON);
console.log('✅ Updates saved to updates.json');
```

Then drag-and-drop into plugin textarea.

### Option C: HTTP Endpoint (Future)

Create a local server that the plugin polls:

```typescript
// Server
import { serve } from 'bun';

serve({
  port: 3000,
  fetch(req) {
    if (req.url.endsWith('/updates')) {
      return new Response(JSON.stringify(updates));
    }
    return new Response('Not found', { status: 404 });
  }
});

// Plugin (future enhancement)
// Fetch updates from localhost:3000/updates
```

## Real-World Example

### Scenario: Generate personalized invoices

```typescript
// 1. Your customer data
const customers = [
  { name: 'Alice', amount: 1500, invoice: 'INV-001' },
  { name: 'Bob', amount: 2500, invoice: 'INV-002' },
];

// 2. For each customer
for (const customer of customers) {
  // Scrape template
  const { dynamicFields } = await scrapeDynamicFields(templateUrl);

  // Map data
  const updates = mapDataToFields({
    customerName: customer.name,
    totalAmount: `$${customer.amount}`,
    invoiceNumber: customer.invoice,
  }, dynamicFields);

  // Generate JSON
  const json = generatePluginJSON(updates);

  // Save to file
  writeFileSync(`invoice-${customer.invoice}.json`, json);
}

// 3. In Figma:
//    - Load invoice-INV-001.json
//    - Apply updates
//    - Export as PDF
//    - Repeat for each customer
```

## API Reference

### `scrapeDynamicFields(fileUrl: string)`

Scrapes Figma file and extracts dynamic fields.

```typescript
const { result, dynamicFields, listFrames } = await scrapeDynamicFields(
  'https://figma.com/file/abc123'
);

// dynamicFields = [
//   {
//     id: '123:456',
//     name: '{customerName}',
//     text: 'John Doe',
//     path: 'Page 1 > Invoice > {customerName}'
//   }
// ]
```

### `mapDataToFields(data, dynamicFields)`

Maps your data to Figma field names.

```typescript
const updates = mapDataToFields(
  { customerName: 'Jane', invoiceNumber: '001' },
  dynamicFields
);

// updates = [
//   { nodeId: '123:456', newValue: 'Jane', fieldName: 'customerName' },
//   { nodeId: '123:457', newValue: '001', fieldName: 'invoiceNumber' }
// ]
```

### `generatePluginJSON(updates)`

Formats updates for the Figma plugin.

```typescript
const json = generatePluginJSON(updates);
// JSON string ready to paste into plugin
```

## Troubleshooting

**No fields found:**
- Make sure text nodes are named `{fieldName}` (with curly braces)
- Check that fields are not hidden
- Verify you're using the correct file URL

**Update not working:**
- Verify node IDs are correct (re-scrape if needed)
- Check that font is available in Figma
- Make sure plugin is running

**Performance:**
- Scraping is fast (~1-2 seconds)
- Plugin updates are instant
- Batch updates are more efficient than single updates

## Next Steps

Now that you have the full workflow:

1. **Set up your template** in Figma with `{fieldName}` naming
2. **Run the script** to test
3. **Customize mapping** for your data structure
4. **Automate** with your backend/app
5. **Export** results as needed

Happy automating! 🚀
