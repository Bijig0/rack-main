# convertSectionsToTemplateAndInputs

This function serves as an intermediary converter between our section-based structure and the pdfme library's expected format.

## Purpose

The `@pdfme/generator` library's `generate` function expects:
- `template`: A single template object with `schemas` (2D array) and `basePdf`
- `inputs`: A single array of input objects

However, for better usability and maintainability, we organize our PDF content into **sections**. Each section represents a logical part of the report (e.g., cover page, executive summary, property info).

This function bridges the gap by converting our section-based structure into the format required by pdfme.

## Function Signature

```typescript
type Args = {
  sections: Sections;
};

type Return = {
  template: Template;
  inputs: Inputs;
};

const convertSectionsToTemplateAndInputs = ({ sections }: Args): Return
```

## How It Works

### Input: Sections Array

Each section contains:
- `template`: Its own template with schemas and basePdf
- `inputs`: Its own inputs array

```typescript
const sections: Sections = [
  {
    template: {
      schemas: [
        {
          title: { type: "text", position: { x: 10, y: 10 }, ... },
        },
      ],
      basePdf: "",
    },
    inputs: [
      { title: "Cover Page Title" }
    ],
  },
  {
    template: {
      schemas: [
        {
          summary: { type: "text", position: { x: 10, y: 20 }, ... },
        },
      ],
      basePdf: "",
    },
    inputs: [
      { summary: "Executive Summary" }
    ],
  },
];
```

### Output: Single Template + Inputs

The function merges all sections:
- Combines all schemas into a single 2D array
- Combines all inputs into a single array
- Uses the basePdf from the first section

```typescript
{
  template: {
    schemas: [
      { title: { ... } },      // from section 1
      { summary: { ... } },    // from section 2
    ],
    basePdf: "",
  },
  inputs: [
    { title: "Cover Page Title" },     // from section 1
    { summary: "Executive Summary" },  // from section 2
  ],
}
```

## Why Sections?

### Benefits of Section-Based Structure:

1. **Modularity**: Each section is self-contained and can be developed independently
2. **Reusability**: Sections can be easily included or excluded based on available data
3. **Maintainability**: Changes to one section don't affect others
4. **Testability**: Each section can be tested in isolation
5. **Developer Experience**: Easier to understand and work with logical sections

### Example Use Case:

```typescript
const sections: Sections = [];

// Always include cover page
sections.push(await createCoverPageSection({ ... }));

// Conditionally include planning zoning
if (data.planningZoning) {
  sections.push(await createPlanningZoningSection({ ... }));
}

// Conditionally include floor plan
if (data.floorPlanImage) {
  sections.push(await createFloorPlanSection({ ... }));
}

// Convert to pdfme format
const { template, inputs } = convertSectionsToTemplateAndInputs({ sections });

// Generate PDF
const pdf = await generate({ template, inputs });
```

## Algorithm

1. Initialize empty arrays for combined schemas and inputs
2. Extract basePdf from the first section (or use empty string)
3. Iterate through each section:
   - Spread the section's schemas into the combined schemas array
   - Spread the section's inputs into the combined inputs array
4. Return the merged template and inputs

## Edge Cases Handled

- **Empty sections array**: Returns empty schemas/inputs with empty basePdf
- **Multiple pages per section**: Each section can have multiple schemas (pages)
- **Multiple inputs per section**: Each section can have multiple input objects
- **Missing or undefined schemas/inputs**: Safely checks for arrays before spreading

## Testing

The function includes comprehensive unit tests covering:
- Single section conversion
- Multiple section merging
- Multi-page sections
- Empty sections
- Multiple inputs per section
- Schema property preservation
- Optional fields
- Order preservation
- Real-world property report structure

Run tests with:
```bash
npm test -- convertSectionsToTemplateAndInputs.test.ts
```

## Integration

This function is called in `createRentalAppraisalPdfInstance.ts`:

```typescript
const pdfSections = await createRentalAppraisalPDF({ data });

const { template, inputs } = convertSectionsToTemplateAndInputs({
  sections: pdfSections,
});

const pdf = await generate({ template, inputs });
```

## Type Definitions

```typescript
// From types.ts
export type Template = Parameters<typeof generate>[0]["template"];
export type Inputs = Parameters<typeof generate>[0]["inputs"];

export type Section = {
  template: Template;
  inputs: Inputs;
};

export type Sections = Section[];
```
