# Get Electricity Data

This module fetches electricity infrastructure data for a given address using WFS (Web Feature Service) from Victorian government data sources.

## Structure

```
getElectricityData/
├── createElectricityResponseSchema/
│   ├── inferRawElectricityData/
│   │   └── inferRawElectricityData.ts    # Transforms raw WFS data to typed data
│   ├── getElectricityVicmapResponseSchema.ts  # Zod schema for WFS response
│   └── types.ts                          # TypeScript types and Zod schemas
├── getElectricityData.ts                 # Main function to fetch electricity data
├── getElectricityData.unit.test.ts      # Unit tests
└── README.md                             # This file
```

## Usage

```typescript
import { getElectricityData } from "./getElectricityData";

const { electricityData } = await getElectricityData({
  address: {
    addressLine: "123 Main Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
});

console.log(electricityData);
// [
//   {
//     assetId: "ELEC001",
//     featureType: "Substation",
//     featureSubType: "Distribution",
//     voltage: "22kV",
//     capacity: "500kVA",
//     owner: "AusNet Services",
//     status: "Active",
//     distance: 0.5, // km from property
//     coordinates: { lat: -37.813, lon: 144.963 }
//   }
// ]
```

## Data Sources

### TODO: Find Correct WFS Layer

The current implementation uses a placeholder typeName:
```typescript
typeName: "open-data-platform:electricity_infrastructure"
```

You need to find the correct layer name from Victorian government data sources:

1. **Check DataVic**: https://discover.data.vic.gov.au/
   - Search for "electricity", "power", "transmission", "distribution"
   - Look for WFS-enabled datasets

2. **Possible Layer Names**:
   - `open-data-platform:electricity_transmission`
   - `open-data-platform:electricity_distribution`
   - `open-data-platform:power_substations`
   - `open-data-platform:powerlines`
   - Check utility provider open data (AusNet Services, Jemena, etc.)

3. **Test the Layer**:
   ```bash
   bun src/report-generator/.../getElectricityData/getElectricityData.ts
   ```

## Configuration

### Buffer Distance

Current buffer: **0.01 degrees** (~1km)

Adjust in `getElectricityData.ts`:
```typescript
buffer: 0.01, // Change this value
```

### Timeout

Current timeout: **15000ms** (15 seconds)

Adjust in `getElectricityData.ts`:
```typescript
timeout: 15000, // Change this value
```

## Data Returned

Each electricity infrastructure item includes:

- **assetId**: Unique identifier for the asset
- **featureType**: Type of infrastructure (e.g., "Substation", "Transformer", "Powerline")
- **featureSubType**: More specific type
- **voltage**: Operating voltage (e.g., "22kV", "66kV")
- **capacity**: Capacity rating if available
- **owner**: Infrastructure owner/operator
- **status**: Operational status (e.g., "Active", "Inactive")
- **distance**: Distance from property in kilometers
- **coordinates**: Lat/lon of the infrastructure

## Testing

Run unit tests:
```bash
bun test getElectricityData.unit.test.ts
```

Run the main file to test with real API:
```bash
bun src/report-generator/.../getElectricityData/getElectricityData.ts
```

## Integration with getInfrastructureData

To integrate this into the main infrastructure data function:

```typescript
// In getInfrastructureData.ts
import { getElectricityData } from "./getElectricityData/getElectricityData";

const getInfrastructureData = async ({ address }: Args): Promise<Return> => {
  // Fetch electricity data
  const { electricityData } = await getElectricityData({ address });

  // Determine if electricity is available (e.g., within 1km)
  const electricityAvailable = electricityData.some(
    item => item.distance !== undefined && item.distance < 1.0
  );

  return {
    infrastructureData: {
      electricity: electricityAvailable,
      // ... other infrastructure
    }
  };
};
```

## Notes

- The module follows the same pattern as environmental data modules (getHeritageData, getEasementsData, etc.)
- Uses geocoding to convert address to lat/lon coordinates
- Queries WFS API with BBOX around the property
- Parses and validates response with Zod schemas
- Calculates distances from property to each infrastructure item
- Includes comprehensive unit tests with mocked responses
