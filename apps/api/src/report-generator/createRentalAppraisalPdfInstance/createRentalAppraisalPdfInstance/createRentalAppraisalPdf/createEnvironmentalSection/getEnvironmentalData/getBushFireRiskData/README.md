# Bushfire Risk Data

Comprehensive bushfire risk assessment using multiple Victorian government data sources.

## Overview

This module provides a complete bushfire risk analysis by combining three data sources:

1. **Bushfire Prone Areas** - Designated areas with bushfire risk
2. **Fire History** - Historical records of fires since 1903
3. **Fire Management Zones** - Fire management zone designations (TODO: Configure layer name)

The data is analyzed to provide an overall risk rating (LOW, MEDIUM, HIGH, EXTREME) with detailed risk factors and recommendations.

## Structure

```
getBushFireRiskData/
├── getBushfireRiskData.ts          # Main orchestrator
├── getBushfireProneAreas.ts        # Fetches bushfire prone areas
├── getFireHistory.ts                # Fetches historical fire records
├── getFireManagementZones.ts       # Fetches fire management zones (TODO)
├── analyzeBushfireRisk.ts          # Risk analysis logic
├── createBushfireRiskResponseSchema/   # Schemas for prone areas
├── createFireHistoryResponseSchema/    # Schemas for fire history
└── README.md                        # This file
```

## Usage

```typescript
import { getBushfireRiskData } from "./getBushfireRiskData";

const result = await getBushfireRiskData({
  address: {
    addressLine: "123 Main Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
});

console.log(`Risk Level: ${result.riskAnalysis.overallRisk}`);
console.log(`Summary: ${result.riskAnalysis.summary}`);
console.log(`Prone Areas: ${result.bushfireProneAreas.length}`);
console.log(`Fire History Records: ${result.fireHistory.length}`);
```

## Output Structure

```typescript
{
  // Bushfire prone areas within 10km
  bushfireProneAreas: InferredBushfireRiskData[],

  // Historical fires within 10km (sorted by distance)
  fireHistory: InferredFireHistoryData[],

  // Fire management zones (TODO)
  fireManagementZones: any[],

  // Comprehensive risk analysis
  riskAnalysis: {
    overallRisk: "LOW" | "MEDIUM" | "HIGH" | "EXTREME",
    riskFactors: {
      inBushfireProneArea: boolean,
      distanceToProneArea?: { measurement: number, unit: string },
      historicalFiresNearby: number,
      recentFiresNearby: number,
      closestHistoricalFire?: {
        distance: { measurement: number, unit: string },
        fireName?: string,
        fireSeason?: string,
        fireType?: string
      }
    },
    summary: string,
    recommendations: string[]
  }
}
```

## Risk Analysis

### Risk Levels

- **LOW**: No bushfire prone areas nearby, minimal fire history
- **MEDIUM**: Some fire history or proximity to prone areas
- **HIGH**: In or near bushfire prone areas with fire history
- **EXTREME**: In bushfire prone area with recent fires nearby

### Risk Score Calculation

The risk score is calculated based on:
- **In bushfire prone area**: +3 points
- **Fires within 5km**: +2 points per fire (max 4)
- **Recent fires (last 10 years)**: +2 points per fire (max 3)
- **Historical fires within 10km**: +0.5 points per fire (max 2)

Final scores:
- 0-2: LOW
- 3-4: MEDIUM
- 5-6: HIGH
- 7+: EXTREME

### Recommendations

Recommendations are tailored based on risk level and include:
- Bushfire survival plan development
- Defendable space requirements
- Building regulations compliance (AS 3959)
- Emergency alert registration
- Evacuation planning

## Data Sources

### Bushfire Prone Areas
- **WFS Layer**: `open-data-platform:bushfire_prone_area`
- **Source**: Victorian Government Open Data Platform
- **Coverage**: Statewide designated bushfire prone areas

### Fire History
- **WFS Layer**: `fire_history_scar`
- **Source**: https://opendata.maps.vic.gov.au/geoserver/wfs
- **Coverage**: Fires since 1903 (bushfires, planned burns, CFA data)
- **Updated**: Monthly during fire season

### Fire Management Zones
- **Status**: TODO - Layer name not yet configured
- **Source**: https://discover.data.vic.gov.au/dataset/fire-management-zones
- **Coverage**: Fire management zones on public land

## Testing

Run individual components:

```bash
# Test bushfire prone areas
bun src/.../getBushfireProneAreas.ts

# Test fire history
bun src/.../getFireHistory.ts

# Test full analysis
bun src/.../getBushfireRiskData.ts
```

## TODO

- [ ] Configure fire management zones WFS layer name
- [ ] Add fire management zones schema and types
- [ ] Incorporate zones data into risk analysis
- [ ] Add unit tests
- [ ] Consider adding fire danger ratings (FDR) if available
