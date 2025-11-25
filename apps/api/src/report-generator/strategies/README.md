# PDF Generation Strategies

This directory contains the **Strategy Pattern** implementation for PDF generation. The pattern allows swapping PDF generation algorithms at runtime without changing client code.

## Architecture

```
┌─────────────────────────────────────┐
│  createRentalAppraisalPdfInstance   │
│  (Context/Client)                   │
└──────────────┬──────────────────────┘
               │
               │ uses
               ▼
┌──────────────────────────────────────┐
│  PdfGenerationStrategy (Interface)   │
├──────────────────────────────────────┤
│  + generate(context): Promise<PDF>  │
│  + getName(): string                 │
└──────────────┬───────────────────────┘
               │
               │ implemented by
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Figma      │  │    pdfme     │
│  Strategy    │  │  Strategy    │
└──────────────┘  └──────────────┘
```

## Benefits

1. **Decoupling**: PDF generation logic is separated from data fetching
2. **Flexibility**: Easy to add new PDF generation methods
3. **Testability**: Each strategy can be tested independently
4. **Runtime Selection**: Choose strategy based on configuration or requirements
5. **Single Responsibility**: Each strategy has one job

## Available Strategies

### 1. FigmaPdfGenerationStrategy (Default)

Uses Figma templates and pdf-lib to generate PDFs.

**Workflow:**
```typescript
Figma Template → Fill Data → Convert to pdf-lib → PDF Bytes
```

**Usage:**
```typescript
import { FigmaPdfGenerationStrategy } from "./strategies";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";

const pdf = await createRentalAppraisalPDFInstance({
  address,
  strategy: new FigmaPdfGenerationStrategy(),
});
```

**Configuration:**
```typescript
const strategy = new FigmaPdfGenerationStrategy({
  figmaAccessToken: "custom-token",
  figmaPdfDesignFileUrl: "https://figma.com/...",
});
```

### 2. PdfmePdfGenerationStrategy

Uses pdfme library with section-based templates.

**Workflow:**
```typescript
Data → Create Sections → Merge Templates → pdfme.generate() → PDF Bytes
```

**Usage:**
```typescript
import { PdfmePdfGenerationStrategy } from "./strategies";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";

// Define section creation function
const createSections = async (context) => {
  // Create pdfme sections from context.rentalAppraisalData
  return sections;
};

const strategy = new PdfmePdfGenerationStrategy(createSections);

const pdf = await createRentalAppraisalPDFInstance({
  address,
  strategy,
});
```

## Creating a Custom Strategy

To add a new PDF generation strategy:

### Step 1: Implement the Interface

```typescript
import type {
  PdfGenerationStrategy,
  PdfGenerationContext,
  PdfGenerationResult,
} from "./types";

export class CustomPdfGenerationStrategy implements PdfGenerationStrategy {
  getName(): string {
    return "CustomPdfGenerationStrategy";
  }

  async generate(
    context: PdfGenerationContext
  ): Promise<PdfGenerationResult> {
    const { rentalAppraisalData } = context;

    // Your PDF generation logic here
    const pdfBytes = await yourPdfLibrary.generate(rentalAppraisalData);

    return {
      pdfBytes,
      metadata: {
        pageCount: 10,
        fileSize: pdfBytes.length,
        generatedAt: new Date(),
      },
    };
  }
}
```

### Step 2: Export from index.ts

```typescript
// strategies/index.ts
export { CustomPdfGenerationStrategy } from "./CustomPdfGenerationStrategy";
```

### Step 3: Use Your Strategy

```typescript
import { CustomPdfGenerationStrategy } from "./strategies";
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";

const pdf = await createRentalAppraisalPDFInstance({
  address,
  strategy: new CustomPdfGenerationStrategy(),
});
```

## Examples

### Example 1: Using Default Strategy

```typescript
import createRentalAppraisalPDFInstance from "./createRentalAppraisalPdfInstance";

// Uses FigmaPdfGenerationStrategy by default
const pdf = await createRentalAppraisalPDFInstance({
  address: {
    addressLine: "123 Main St",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
});

fs.writeFileSync("output.pdf", pdf);
```

### Example 2: Using generatePdf Directly

```typescript
import generatePdf from "./generatePdf";
import { FigmaPdfGenerationStrategy } from "./strategies";
import createRentalAppraisalPDF from "./createRentalAppraisalPdf";

// Fetch data
const rentalAppraisalData = await createRentalAppraisalPDF({ address });

// Generate PDF with custom strategy
const strategy = new FigmaPdfGenerationStrategy();
const result = await generatePdf({
  context: { rentalAppraisalData },
  strategy,
});

console.log(`Generated ${result.metadata?.pageCount} pages`);
fs.writeFileSync("output.pdf", result.pdfBytes);
```

### Example 3: Strategy Selection Based on Config

```typescript
import {
  FigmaPdfGenerationStrategy,
  PdfmePdfGenerationStrategy,
} from "./strategies";

function getStrategy(type: "figma" | "pdfme") {
  switch (type) {
    case "figma":
      return new FigmaPdfGenerationStrategy();
    case "pdfme":
      return new PdfmePdfGenerationStrategy(createSections);
    default:
      throw new Error(`Unknown strategy: ${type}`);
  }
}

const strategy = getStrategy(process.env.PDF_STRATEGY || "figma");
const pdf = await createRentalAppraisalPDFInstance({ address, strategy });
```

## File Structure

```
strategies/
├── index.ts                           # Exports all strategies
├── types.ts                           # Strategy interface and types
├── FigmaPdfGenerationStrategy.ts      # Figma-based implementation
├── PdfmePdfGenerationStrategy.ts      # pdfme-based implementation
└── README.md                          # This file
```

## Migration Guide

### Before (Tightly Coupled)

```typescript
// createRentalAppraisalPdfInstance.ts - OLD
import { generate } from "@pdfme/generator";

const pdf = await generate({ template, inputs, options: { font } });
```

### After (Strategy Pattern)

```typescript
// createRentalAppraisalPdfInstance.ts - NEW
import { FigmaPdfGenerationStrategy } from "./strategies";

const strategy = new FigmaPdfGenerationStrategy();
const result = await strategy.generate({ rentalAppraisalData });
const pdf = result.pdfBytes;
```

## Testing

Each strategy can be tested independently:

```typescript
import { FigmaPdfGenerationStrategy } from "./strategies";

describe("FigmaPdfGenerationStrategy", () => {
  it("should generate PDF from rental appraisal data", async () => {
    const strategy = new FigmaPdfGenerationStrategy();
    const result = await strategy.generate({
      rentalAppraisalData: mockData,
    });

    expect(result.pdfBytes).toBeInstanceOf(Uint8Array);
    expect(result.metadata?.pageCount).toBeGreaterThan(0);
  });
});
```

## Design Decisions

1. **Why Strategy over Adapter?**
   - We're selecting between different algorithms, not adapting an interface
   - Each strategy has fundamentally different logic
   - Runtime selection is a key requirement

2. **Why inject strategy at runtime?**
   - Allows configuration-based selection
   - Easier testing with mock strategies
   - Supports A/B testing different approaches

3. **Why include metadata in result?**
   - Useful for logging and debugging
   - Allows strategies to provide implementation-specific info
   - Optional, so simple strategies can omit it
