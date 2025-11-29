# Odour Level Data

Comprehensive odour level assessment using multiple data sources.

## Overview

This module provides a complete odour level analysis by combining three data sources:

1. **Landfills** - Victorian Landfill Register (VLR) data
2. **Wastewater Treatment Plants** - Geoscience Australia facilities
3. **Industrial Facilities** - EPA Victoria licensed premises (odour-emitting activities)

The data is analyzed to provide an overall odour level rating (MINIMAL, LOW, MODERATE, HIGH, VERY_HIGH) based on proximity to odour-emitting sources, with detailed source information and considerations.

## Structure

```
getOdoursData/
├── getOdourData.ts                     # Main orchestrator
├── getLandfillData.ts                  # Fetches landfill data
├── getWastewaterTreatmentPlants.ts    # Fetches wastewater facilities
├── getIndustrialFacilities.ts         # Fetches EPA licensed premises
├── getEpaLicensedPremises.ts          # EPA Victoria odour-emitting facilities
├── analyzeOdourLevels.ts              # Comprehensive odour level analysis
├── createWastewaterResponseSchema/    # Schemas for wastewater data
├── getOdoursVicmapResponseSchema.ts   # Schemas for landfill data
└── README.md                          # This file
```

## Usage

```typescript
import { getOdourData } from "./getOdourData";

const result = await getOdourData({
  address: {
    addressLine: "123 Main Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
});

console.log(`Odour Level: ${result.odourLevelAnalysis.overallLevel}`);
console.log(`Summary: ${result.odourLevelAnalysis.summary}`);
console.log(`Landfills: ${result.landfills.length}`);
console.log(`Wastewater Plants: ${result.wastewaterPlants.length}`);
```

## Output Structure

```typescript
{
  // Landfills within 50km (sorted by distance)
  landfills: InferredOdoursData[],

  // Wastewater treatment plants within 20km (sorted by distance)
  wastewaterPlants: InferredWastewaterData[],

  // EPA licensed industrial facilities within 10km (filtered for odour-emitting activities)
  industrialFacilities: InferredEpaLicenceData[],

  // Comprehensive odour level analysis
  odourLevelAnalysis: {
    overallLevel: "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH",
    odourSources: {
      closestLandfill?: {
        distance: { measurement: number, unit: string },
        name: string,
        status: string
      },
      closestWastewaterPlant?: {
        distance: { measurement: number, unit: string },
        name: string,
        operator?: string
      },
      closestIndustrialFacility?: {
        distance: { measurement: number, unit: string },
        name: string,
        activity: string
      },
      landfillsWithin10km: number,
      wastewaterPlantsWithin10km: number,
      industrialFacilitiesWithin5km: number
    },
    summary: string,
    considerations: string[]
  }
}
```

## Odour Level Analysis

### Odour Levels

- **MINIMAL**: Odour sources are distant - minimal odour impact expected
- **LOW**: No significant odour sources nearby - low odour levels
- **MODERATE**: Some odour sources present - moderate odour levels, occasional odour possible
- **HIGH**: Close proximity to odour sources - high odour levels, odour likely under certain conditions
- **VERY_HIGH**: Very close to major odour sources - very high odour levels, frequent odour expected

### Odour Intensity Score Calculation

The odour intensity score is calculated based on:

**Landfills:**
- Within 2km: +5 points (strong odour likely)
- Within 5km: +3 points (odour probable)
- Within 10km: +2 points (occasional odour)
- Within 50km: +1 point (minimal odour impact)

**Wastewater Plants:**
- Within 2km: +4 points (odour likely)
- Within 5km: +2 points (moderate distance)
- Within 10km: +1 point (some distance)

**Industrial Facilities:**
- Within 5km: Included in overall count

**Multiple Sources:**
- +0.5 points per additional landfill (max +2)
- +0.5 points per additional wastewater plant (max +2)
- +1 point per industrial facility within 5km

Final scores:
- 0: MINIMAL
- 1-2: LOW
- 3-4: MODERATE
- 5-6: HIGH
- 7+: VERY_HIGH

### Odour Factors

Odour intensity depends on:
- **Distance**: Closer sources have higher impact
- **Wind direction**: Prevailing winds can carry odours
- **Weather**: Hot, still days intensify odours
- **Season**: Summer months typically have stronger odours
- **Facility operations**: Active landfilling vs closed areas

### Considerations

Considerations are tailored based on odour level and include:
- Property inspection timing (hot days, different times)
- Neighbor consultations
- EPA Victoria records review
- Wind direction considerations
- Air conditioning installation
- Odour management plan reviews

## Data Sources

### Landfills
- **WFS Layer**: `open-data-platform:vlr_point`
- **Source**: Victorian Landfill Register (VLR)
- **Coverage**: All registered landfills in Victoria
- **Buffer**: 50km (odour can travel long distances)

### Wastewater Treatment Plants
- **WFS Service**: https://services.ga.gov.au/gis/services/Wastewater_Treatment_Facilities/MapServer/WFSServer
- **Source**: Geoscience Australia
- **Coverage**: Wastewater treatment facilities across Australia
- **Buffer**: 20km

### Industrial Facilities
- **WFS Layer**: `open-data-platform:epa_licence_point`
- **Source**: EPA Victoria Licensed Premises
- **Coverage**: Licensed facilities across Victoria
- **Buffer**: 10km
- **Filtering**: Automatically filters for odour-related activities including:
  - Food processing plants
  - Waste and recycling facilities
  - Chemical manufacturing
  - Composting/organic waste processing facilities
  - Wastewater treatment
  - Other odour-emitting industrial activities

## Testing

Run individual components:

```bash
# Test landfill data
bun src/.../getLandfillData.ts

# Test wastewater plants
bun src/.../getWastewaterTreatmentPlants.ts

# Test EPA licensed premises (industrial facilities)
bun src/.../getEpaLicensedPremises.ts

# Test full analysis
bun src/.../getOdourData.ts
```

## Limitations

1. **Odour is subjective**: Individual sensitivity varies
2. **Wind patterns**: Not currently analyzed (could be added with BOM data)
3. **Seasonal variations**: Analysis is based on proximity only
4. **EPA filtering**: Industrial facilities filtered by keywords - may miss some sources or include non-odour sources
5. **Temporary sources**: Construction sites, agricultural activities not included

## Future Enhancements

- [ ] Add prevailing wind direction analysis (Bureau of Meteorology)
- [ ] Include seasonal odour intensity factors
- [ ] Add EPA complaint history if available via API
- [ ] Consider adding odour buffer zones from EPA guidelines
- [ ] Add Digital Elevation Model (DEM) for topography-based dispersion modeling
- [ ] Improve industrial facility filtering with more sophisticated keyword matching
- [ ] Add unit tests
