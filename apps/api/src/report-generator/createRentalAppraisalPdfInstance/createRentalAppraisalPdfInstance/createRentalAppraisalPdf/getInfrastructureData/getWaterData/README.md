# getWaterData Module

Comprehensive water infrastructure data module for rental appraisal reports.

## Overview

This module analyzes water infrastructure availability and connectivity for properties in Victoria, Australia. It queries water authority WFS endpoints, analyzes proximity to water mains and fire hydrants, and generates detailed descriptions and recommendations.

## Features

- **Multi-Provider Support**: Handles Yarra Valley Water, South East Water, City West Water, and regional authorities
- **WFS Integration**: Queries Yarra Valley Water WFS endpoint for real-time infrastructure data
- **Distance Analysis**: Calculates precise distances to water mains and fire hydrants
- **Pressure Zone Detection**: Identifies water pressure zones using polygon analysis
- **Smart Recommendations**: Generates context-aware recommendations based on infrastructure availability
- **Comprehensive Testing**: 40+ unit tests and integration tests

## Module Structure

```
getWaterData/
├── types.ts                                    # Zod schemas for all data types
├── getWaterData.ts                             # Main function
├── getWaterData.integration.test.ts            # Integration tests
├── checkWaterServiceArea/                      # Service area detection
│   ├── checkWaterServiceArea.ts
│   └── checkWaterServiceArea.unit.test.ts
├── queryYVWWater/                              # YVW WFS queries
│   ├── queryYVWWater.ts
│   └── queryYVWWater.unit.test.ts
└── analyzeWaterAccess/                         # Infrastructure analysis
    ├── analyzeWaterAccess.ts
    └── analyzeWaterAccess.unit.test.ts
```

## Usage

### Basic Usage

```typescript
import { getWaterData } from "./getWaterData";

const result = await getWaterData({
  address: {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101"
  },
  bufferMeters: 500 // Optional, defaults to 500m
});

console.log(result.waterData);
```

### Output Format

```typescript
{
  waterData: {
    hasWaterConnection: boolean,
    nearestWaterMain: {
      distance: number,          // meters
      diameter: number | null,   // mm
      material: string | null,   // e.g., "PVC", "Cast Iron"
      type: string | null,       // e.g., "Water Main"
      assetId: string,
      serviceStatus: string | null,
      pressureZone: string | null,
      closestPoint: {
        lat: number,
        lon: number
      }
    } | undefined,
    nearestHydrant: {
      distance: number,          // meters
      type: string | null,       // e.g., "Pillar", "Standpipe"
      serviceStatus: string | null,
      location: string | null,
      assetId: string,
      coordinates: {
        lat: number,
        lon: number
      }
    } | undefined,
    waterPressureZone: string | null,
    waterServiceProvider: string,
    description: string,
    recommendations: string[]
  }
}
```

## Data Sources

### Primary: Yarra Valley Water WFS

- **Endpoint**: `https://webmap.yvw.com.au/YVWAssets/service.svc/get`
- **Coverage**: Northern, Eastern, and Inner Melbourne suburbs
- **Layers**:
  - `yvw:WATERPIPES` - Water mains and pipelines
  - `yvw:WATERHYDRANTS` - Fire hydrants
  - `yvw:WDZ_SHAPES` - Water distribution zones

**Note**: The YVW WFS endpoint may have access restrictions. The module gracefully handles API failures and provides fallback information based on service area detection.

### Secondary: Vicmap Hydro (Future)

- **Endpoint**: `https://opendata.maps.vic.gov.au/geoserver/wfs`
- **Coverage**: Statewide Victoria
- **Status**: Planned for future implementation as fallback

## Service Areas

### Yarra Valley Water
- Northern suburbs: Epping, Bundoora, Reservoir, Preston
- Eastern suburbs: Doncaster, Kew, Richmond, Hawthorn
- Inner city: Melbourne CBD, Carlton, Fitzroy
- Coverage: 190+ suburbs, 80+ postcodes

### South East Water
- South Eastern suburbs: Dandenong, Frankston, Glen Waverley
- Bayside: Brighton, Sandringham, Cheltenham
- Mornington Peninsula: Mornington, Rosebud, Sorrento

### City West Water
- Western suburbs: Footscray, Werribee, Sunshine
- Outer west: Melton, Sunbury, Caroline Springs

## Algorithms

### Distance Calculation

The module uses the **Haversine formula** to calculate accurate distances between coordinates:

```typescript
// Converts lat/lon coordinates to distance in kilometers
const distance = haversine(lat1, lon1, lat2, lon2);
```

### Line String Proximity

For water pipes (represented as LineStrings), the module:
1. Breaks the line into segments
2. Finds the closest point on each segment to the property
3. Uses parametric line equations to calculate precise perpendicular distances
4. Returns the minimum distance across all segments

### Polygon Containment

For pressure zones (represented as Polygons), the module uses the **ray casting algorithm**:
1. Casts a ray from the point to infinity
2. Counts intersections with polygon edges
3. Odd count = inside, even count = outside

## Connection Threshold

A property is considered to have a water connection if:
- The nearest water main is within **50 meters**
- This threshold is based on typical connection requirements

## Testing

### Run Unit Tests

```bash
npx bun test src/.../getWaterData/checkWaterServiceArea/checkWaterServiceArea.unit.test.ts
npx bun test src/.../getWaterData/queryYVWWater/queryYVWWater.unit.test.ts
npx bun test src/.../getWaterData/analyzeWaterAccess/analyzeWaterAccess.unit.test.ts
```

### Run Integration Tests

```bash
npx bun test src/.../getWaterData/getWaterData.integration.test.ts
```

### Manual Testing

```bash
npx bun run src/.../getWaterData/getWaterData.ts
```

## Test Coverage

- **checkWaterServiceArea**: 17 unit tests
  - YVW service area detection
  - South East Water detection
  - City West Water detection
  - Regional area handling
  - Case insensitivity
  - Non-Victorian addresses

- **queryYVWWater**: 13 unit tests
  - Successful queries
  - Failed requests
  - Network errors
  - Invalid data handling
  - Buffer calculations

- **analyzeWaterAccess**: 15 unit tests
  - Water main analysis
  - Hydrant analysis
  - Pressure zone detection
  - Distance calculations
  - Connection threshold logic

- **getWaterData**: 10 integration tests
  - Multiple service areas
  - Data structure validation
  - Buffer parameter handling
  - Edge cases

**Total: 55+ tests**

## Error Handling

The module implements robust error handling:

1. **Network Failures**: Returns null data with informative messages
2. **Invalid JSON**: Catches parse errors and continues gracefully
3. **Schema Validation**: Uses Zod to validate all API responses
4. **Missing Data**: Provides sensible defaults and clear messaging
5. **API Restrictions**: Handles blocked/restricted endpoints gracefully

## Recommendations Logic

The module generates context-aware recommendations based on:

### Water Connection Available (< 50m)
- Verify connection status with water authority
- Review water pressure and flow rates

### No Water Connection (> 50m)
- Contact authority for connection costs
- Budget for main extension
- Consider alternative water supply (rainwater tanks)

### Fire Hydrant Proximity
- Within 200m: Favorable for insurance
- Beyond 200m: Consider fire safety measures

### Pressure Zone
- Provides zone information if available
- Recommends verifying suitability for intended use

## Future Enhancements

1. **Vicmap Integration**: Add fallback to Vicmap Hydro for non-YVW areas
2. **Water Quality Data**: Integrate water quality information
3. **Historical Data**: Include connection history and upgrades
4. **Cost Estimation**: Provide connection cost estimates
5. **Flow Rate Analysis**: Include expected water flow rates
6. **Bushfire Overlay**: Cross-reference with fire risk zones

## Dependencies

- `zod`: Schema validation
- `geocodeAddress`: Address to coordinates conversion
- Standard fetch API for WFS queries

## API Limitations

The Yarra Valley Water WFS endpoint may have:
- Rate limiting
- Access restrictions
- IP filtering
- CORS requirements for browser-based access

For production use, consider:
- API authentication (if available)
- Request caching
- Fallback data sources
- Service-level agreements with water authorities

## Contributing

When extending this module:

1. Add comprehensive JSDoc comments
2. Include unit tests for all helper functions
3. Add integration tests for new data sources
4. Update type schemas for new data fields
5. Maintain the Args/Return pattern
6. Follow existing error handling patterns

## License

Part of the Appraisal PDF Generator Script project.
