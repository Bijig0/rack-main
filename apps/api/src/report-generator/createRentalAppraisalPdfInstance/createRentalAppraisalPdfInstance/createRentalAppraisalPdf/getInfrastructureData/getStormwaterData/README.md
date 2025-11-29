# Stormwater Infrastructure Data Module

Comprehensive stormwater infrastructure analysis for property appraisals in Victoria, Australia.

## Overview

This module analyzes stormwater infrastructure and flood risk for a given property by:
1. Identifying the drainage catchment the property belongs to
2. Finding nearby flood retarding basins
3. Assessing stormwater risk based on available infrastructure
4. Providing detailed recommendations for flood mitigation

## Data Sources

### Primary: Melbourne Water ArcGIS
- **Catchments GeoJSON**: Drainage catchment boundaries across Victoria
- **URL**: `https://data-melbournewater.opendata.arcgis.com/api/download/v1/items/15c3c23d7ef140b4a746e7779eae92d7/geojson?layers=1`
- **Features**: 3,409 catchment polygons
- **Data**: Catchment names, waterways, areas

### Secondary: Vicmap Open Data Platform
- **Endpoint**: `https://opendata.maps.vic.gov.au/geoserver/wfs`
- **Layer**: `open-data-platform:public_dam_retarding_basin_points_unrestricted`
- **Features**: 1,538 dams and retarding basins
- **Data**: Basin names, types, capacities, owners, locations

## Module Structure

```
getStormwaterData/
├── getStormwaterData.ts              # Main entry point
├── getStormwaterData.integration.test.ts
├── types.ts                          # Zod schemas and TypeScript types
├── README.md                         # This file
├── getDrainageCatchment/
│   ├── getDrainageCatchment.ts       # Identifies property's catchment
│   └── getDrainageCatchment.unit.test.ts
├── getRetardingBasins/
│   ├── getRetardingBasins.ts         # Finds nearby basins
│   └── getRetardingBasins.unit.test.ts
└── analyzeStormwaterRisk/
    ├── analyzeStormwaterRisk.ts      # Risk assessment logic
    └── analyzeStormwaterRisk.unit.test.ts
```

## Usage

```typescript
import { getStormwaterData } from "./getStormwaterData";

const { stormwaterData } = await getStormwaterData({
  address: {
    addressLine: "1 Flinders Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
  bufferMeters: 3000, // Optional, default: 3000m
});

console.log(stormwaterData.stormwaterRiskLevel); // "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH"
console.log(stormwaterData.drainageCatchment);   // Catchment info if found
console.log(stormwaterData.nearbyRetardingBasins); // Up to 10 nearest basins
console.log(stormwaterData.recommendations);      // Flood mitigation advice
```

## Output Format

```typescript
{
  stormwaterData: {
    drainageCatchment: {
      name: string,          // e.g., "Yarra River"
      area: number,          // hectares
      waterway: string       // e.g., "Yarra River"
    } | undefined,
    nearbyRetardingBasins: Array<{
      name: string,          // e.g., "Gardiners Creek RB"
      distance: number,      // meters from property
      capacity: number,      // megalitres (ML) - optional
      type: string,          // e.g., "Retarding Basin", "Reservoir"
      owner: string          // e.g., "Melbourne Water" - optional
    }>,
    stormwaterRiskLevel: "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH",
    hasStormwaterDrainage: boolean,
    description: string,     // Human-readable risk description
    recommendations: string[] // Actionable flood mitigation advice
  }
}
```

## Risk Classification

### LOW Risk
- Multiple retarding basins within 1km, OR
- At least one basin within 1km with capacity ≥ 50ML
- **Characteristics**: Excellent flood protection, well-managed catchment
- **Recommendations**: Maintain drainage, consider rainwater tanks

### MODERATE Risk
- At least one basin within 2km, OR
- Multiple basins within 3km with capacity ≥ 30ML
- **Characteristics**: Good flood protection, some infrastructure
- **Recommendations**: Ensure adequate drainage, permeable surfaces, check flood maps

### HIGH Risk
- Basin within 3-5km, OR
- Limited basin capacity nearby
- **Characteristics**: Limited flood protection
- **Recommendations**: Flood risk assessment, substantial rainwater systems, raise floor levels

### VERY HIGH Risk
- No basins within 3km, OR
- Very distant basins (> 5km)
- **Characteristics**: Minimal flood protection, high vulnerability
- **Recommendations**: CRITICAL - professional assessment required, comprehensive mitigation, flood insurance

## Testing

### Unit Tests
```bash
# Test individual components
bun test getDrainageCatchment/getDrainageCatchment.unit.test.ts
bun test getRetardingBasins/getRetardingBasins.unit.test.ts
bun test analyzeStormwaterRisk/analyzeStormwaterRisk.unit.test.ts
```

### Integration Tests
```bash
# Test complete module with real API calls
bun test getStormwaterData.integration.test.ts
```

### Manual Testing
```bash
# Run with sample addresses
bun getStormwaterData.ts
```

## Implementation Notes

### Caching
- All API requests are cached using `make-fetch-happen`
- Cache location: `./node_modules/.cache/stormwater-cache`
- Melbourne Water catchments (~15MB) cached for 24 hours
- WFS basin queries cached for faster repeated lookups

### Performance
- Geocoding: ~500ms (cached after first request)
- Catchment data fetch: ~2-5s first time, instant from cache
- Basin search: ~50-200ms per WFS query (cached)
- Total: ~3-7s first run, ~1-2s with cache

### Geospatial Processing
- Uses Turf.js for point-in-polygon calculations
- Haversine distance calculations for basin proximity
- Supports Polygon and MultiPolygon geometries
- Handles large polygons (>5000 points) with simplification

## Data Accuracy

### Drainage Catchments
- Melbourne Water official catchment boundaries
- Updated regularly by Melbourne Water
- Covers entire Melbourne Water service area
- Some properties may be outside defined catchments

### Retarding Basins
- Victorian government official dataset
- 1,538 features across Victoria
- Includes dams, retarding basins, and reservoirs
- May not include all private infrastructure
- Capacity data available for most major basins

## Limitations

1. **Urban vs Rural**: Better coverage in metropolitan Melbourne than regional areas
2. **Private Infrastructure**: May not capture all private stormwater systems
3. **Recent Development**: Very recent infrastructure may not be in dataset
4. **Risk Assessment**: Based on distance to basins; does not account for:
   - Topography and natural drainage
   - Underground stormwater systems
   - Recent flood mitigation works
   - Climate change impacts

## Recommendations for Use

1. **Combine with other data**: Use alongside flood overlay maps, council planning schemes
2. **Professional assessment**: High/Very High risk properties should get professional flood assessment
3. **Council consultation**: Always check local council for flood-related planning overlays
4. **Melbourne Water**: Consult for detailed flood studies and required floor levels
5. **Insurance**: Verify flood insurance availability and coverage for high-risk properties

## Related Modules

- `createEnvironmentalSection/getEnvironmentalData/getWaterwayData/` - Nearby waterways
- `createEnvironmentalSection/getEnvironmentalData/getCoastalHazardData/` - Coastal flooding
- Planning overlays module - Land Subject to Inundation Overlay (LSIO)

## Version History

- **v1.0.0** (2025-11-17): Initial implementation
  - Melbourne Water catchments integration
  - Vicmap retarding basins integration
  - Risk assessment algorithm
  - Comprehensive testing suite
