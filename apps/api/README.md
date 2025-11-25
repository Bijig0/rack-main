# Rental Appraisal PDF Generator

A TypeScript-based tool that generates professional rental appraisal PDFs with intelligent rent calculations. Built with Bun, Zod schema validation, and pdfme library.

## Features

- ✅ **Type-safe schema validation** with Zod
- 🧮 **Intelligent rent calculation** based on property features, amenities, and market data
- 📄 **Professional PDF generation** using pdfme
- 📊 **Detailed adjustments tracking** showing how each feature affects rent
- 📈 **Market analysis** comparing proposed rent to market averages
- ⚡ **Fast execution** with Bun runtime

## Prerequisites

- [Bun](https://bun.sh/) installed on your system

```bash
# Install Bun (macOS/Linux)
curl -fsSL https://bun.sh/install | bash

# Or with npm
npm install -g bun
```

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd rental-appraisal-pdf-generator

# Install dependencies (automatically extracts large data files)
npm install
```

> **Note:** This project includes large GeoJSON data files (512 MB total) that are automatically compressed for git. The `npm install` command will automatically extract these files. See [DATA_FILES.md](DATA_FILES.md) for more information.

## Quick Start

Run the example to generate a sample PDF:

```bash
bun start
```

This will generate a PDF in the `./output` directory with a complete rental appraisal report.

## Project Structure

```
rental-appraisal-pdf-generator/
├── src/
│   ├── index.ts          # Main entry point with example usage
│   ├── schema.ts         # Zod schema for rental unit validation
│   ├── calculator.ts     # Appraisal calculation logic
│   └── pdfGenerator.ts   # PDF generation using pdfme
├── output/               # Generated PDFs (created automatically)
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

### Basic Example

```typescript
import { validateRentalUnit, generateRentalAppraisalPDF } from './src/index';

const rentalUnit = {
  address: '123 Main Street',
  unitNumber: '4B',
  propertyType: 'apartment',
  
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1200,
  
  hasParking: true,
  parkingSpaces: 1,
  hasBalcony: true,
  hasAirConditioning: true,
  hasHeating: true,
  hasLaundry: true,
  petsAllowed: false,
  
  yearBuilt: 2015,
  condition: 'good',
  hasRenovations: false,
  
  floorNumber: 4,
  
  proposedRent: 2400,
  marketRentLow: 2200,
  marketRentHigh: 2600,
  averageRentInArea: 2350,
  
  appraiserName: 'John Smith',
};

// Validate and generate PDF
const validatedUnit = validateRentalUnit(rentalUnit);
const pdfPath = await generateRentalAppraisalPDF(validatedUnit);
console.log(`PDF generated: ${pdfPath}`);
```

### Using the Calculator Only

```typescript
import { validateRentalUnit, calculateAppraisal } from './src/index';

const rentalUnit = { /* your data */ };
const validatedUnit = validateRentalUnit(rentalUnit);
const appraisal = calculateAppraisal(validatedUnit);

console.log(`Recommended Rent: $${appraisal.recommendedRent}`);
console.log(`Confidence: ${appraisal.confidenceLevel}`);
console.log('Adjustments:', appraisal.adjustments);
```

## Schema Fields

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `address` | string | Property street address |
| `propertyType` | enum | 'apartment', 'house', 'townhouse', 'studio', or 'condo' |
| `bedrooms` | number | Number of bedrooms (0-10) |
| `bathrooms` | number | Number of bathrooms (0-10) |
| `squareFeet` | number | Total square footage |
| `yearBuilt` | number | Year the property was built |
| `condition` | enum | 'excellent', 'good', 'fair', or 'poor' |
| `proposedRent` | number | Your proposed monthly rent |
| `marketRentLow` | number | Low end of market rent range |
| `marketRentHigh` | number | High end of market rent range |
| `averageRentInArea` | number | Average rent for similar properties |
| `appraiserName` | string | Name of the appraiser |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `unitNumber` | string | - | Unit/apartment number |
| `hasParking` | boolean | false | Has parking available |
| `parkingSpaces` | number | 0 | Number of parking spaces |
| `hasBalcony` | boolean | false | Has a balcony |
| `hasAirConditioning` | boolean | false | Has A/C |
| `hasHeating` | boolean | false | Has heating |
| `hasLaundry` | boolean | false | In-unit laundry |
| `petsAllowed` | boolean | false | Pets allowed |
| `hasRenovations` | boolean | false | Recently renovated |
| `renovationYear` | number | - | Year of last renovation |
| `floorNumber` | number | - | Floor level of the unit |
| `distanceToTransit` | number | - | Distance to public transit (miles) |
| `walkScore` | number | - | Walk score (0-100) |
| `notes` | string | - | Additional notes |
| `appraisalDate` | string | now | ISO date string |

## How It Works

### 1. Schema Validation (Zod)
All input data is validated using Zod schemas to ensure:
- Type safety
- Required fields are present
- Values are within acceptable ranges
- Data integrity before processing

### 2. Intelligent Rent Calculation

The calculator applies smart adjustments based on:

| Factor | Adjustment | Details |
|--------|------------|---------|
| **Bedrooms** | ±$150 per BR | From 2BR baseline |
| **Bathrooms** | ±$100 per BA | From 1BA baseline |
| **Square Footage** | ±$50 per 100 sq ft | From 1000 sq ft baseline |
| **Parking** | +$75 per space | Per parking space |
| **Balcony** | +$50 | Private balcony |
| **Air Conditioning** | +$75 | Central A/C |
| **In-Unit Laundry** | +$100 | Washer/dryer in unit |
| **Condition** | ×0.85-1.1 | Multiplier based on condition |
| **Building Age** | -$50 | Buildings 30+ years without renovations |
| **Recent Renovation** | +$150 | Renovated within 5 years |
| **Floor Level** | +$25 per floor | Above 3rd floor |

### 3. Confidence Scoring

The system assigns a confidence level based on:
- **HIGH**: Recommended rent within market range and narrow market variance
- **MEDIUM**: Recommended rent within market range OR close to market average
- **LOW**: Recommended rent significantly outside market range

### 4. PDF Generation

Creates a professional appraisal report including:
- Property details and specifications
- Market analysis with rent ranges
- Recommended rent with confidence level
- Detailed breakdown of all adjustments
- Market positioning analysis

## PDF Output Example

```
═══════════════════════════════════════════════════════════
               RENTAL APPRAISAL REPORT
                Generated on October 19, 2025
═══════════════════════════════════════════════════════════

Property Information
────────────────────────────────────────────────────────────
123 Main Street #4B
Type: Apartment
Built: 2015

Unit Specifications
────────────────────────────────────────────────────────────
Bedrooms: 2    Bathrooms: 2    Sq Ft: 1,200
Condition: Good
Amenities: Parking (1 space), Balcony, Air Conditioning, 
           Heating, In-Unit Laundry

Market Analysis
────────────────────────────────────────────────────────────
Market Range: $2,200 - $2,600
Area Average: $2,350
Proposed Rent: $2,400

Appraisal Results
────────────────────────────────────────────────────────────
Recommended Rent: $2,525
Confidence Level: HIGH
Market Position: 7.4% above market average

Rent Adjustments
────────────────────────────────────────────────────────────
• Bathroom Count: +$100 - 1 additional bathroom(s)
• Square Footage: +$100 - 200 sq ft above baseline
• Parking: +$75 - 1 parking space(s)
• Balcony: +$50 - Private balcony
• Air Conditioning: +$75 - Central A/C
• In-Unit Laundry: +$100 - Washer/dryer in unit
• Floor Level: +$25 - Unit on floor 4

────────────────────────────────────────────────────────────
Appraised by: John Smith
This appraisal is for informational purposes only
═══════════════════════════════════════════════════════════
```

## Available Scripts

```bash
# Run the generator
bun start

# Type checking
bun run typecheck

# Run all tests
npm test
# or
npm run test:all

# Run report-generator tests only
npm run test:report-generator

# Run backend tests only

# Run only integration tests (slow browser/external tests)
npm run test:integration

# Run fast tests only (unit tests, excludes integration)
npm run test:fast
npm run test:backend

# Data file management
npm run data:setup    # Extract compressed data files (runs automatically after install)
npm run data:zip      # Compress large data files before committing
npm run data:unzip    # Extract compressed data files
```

For more details on testing, see [TESTING.md](TESTING.md) and [TESTING_CATEGORIES.md](TESTING_CATEGORIES.md).

## Customization

### Adjust Calculation Logic

Edit `src/calculator.ts` to modify:
- Adjustment amounts for various features
- Condition multipliers (currently 0.85-1.1)
- Baseline values (2BR/1BA, 1000 sq ft)
- Confidence level thresholds

Example:
```typescript
// Change parking adjustment from $75 to $100 per space
const parkingAdjustment = unit.parkingSpaces * 100;
```

### Customize PDF Layout

Edit `src/pdfGenerator.ts` to:
- Change colors, fonts, and styling
- Adjust field positions and sizes
- Add or remove sections
- Modify data formatting

Example:
```typescript
// Change title color
{
  name: 'title',
  fontColor: '#0066cc', // Change to blue
  fontSize: 28, // Make it larger
}
```

### Add New Fields

1. Update the Zod schema in `src/schema.ts`:
```typescript
export const RentalUnitSchema = z.object({
  // ... existing fields
  hasGym: z.boolean().default(false),
});
```

2. Add calculation logic in `src/calculator.ts`:
```typescript
if (unit.hasGym) {
  adjustments.push({ name: 'Gym Access', amount: 50, reason: 'Building gym' });
  baseRent += 50;
}
```

3. Update the PDF template in `src/pdfGenerator.ts` to display the new field.

## Error Handling

The generator includes comprehensive error handling:

```typescript
try {
  const validatedUnit = validateRentalUnit(data);
  const pdfPath = await generateRentalAppraisalPDF(validatedUnit);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation failed:', error.errors);
  } else {
    console.error('Error:', error);
  }
}
```

## TypeScript Support

This project is fully typed with TypeScript. Export types for use in your projects:

```typescript
import type { RentalUnit, AppraisalResult } from './src/index';

const myUnit: RentalUnit = { /* ... */ };
const result: AppraisalResult = calculateAppraisal(myUnit);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.

---

Built with ⚡ [Bun](https://bun.sh/) • 📝 [TypeScript](https://www.typescriptlang.org/) • ✅ [Zod](https://zod.dev/) • 📄 [pdfme](https://pdfme.com/)# rack-main
