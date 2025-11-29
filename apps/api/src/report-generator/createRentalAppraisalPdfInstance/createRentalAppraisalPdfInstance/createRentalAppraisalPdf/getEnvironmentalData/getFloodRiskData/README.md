# Flood Risk Data - Victorian Government Sources

## Overview

This module fetches and analyzes flood risk data for Victorian properties using multiple government data sources to provide comprehensive flood risk assessment.

## Data Sources

### 1. Victorian Flood History October 2022 Event (Historical Data)

**Dataset**: Victorian Flood History October 2022 Event Public
**Source**: Emergency Management Victoria
**URL**: https://discover.data.vic.gov.au/dataset/victorian-flood-history-october-2022-event-public
**Layer Name**: `vic_flood_history_public`
**Type**: Historical/Observed flood extents

**Description**:
Contains polygon features representing the observed, derived or estimated inundation extent for the October 2022 floods in Victoria. Data sources include:
- Aerial photography
- Satellite imagery (electro-optical and SAR)
- GPS surveys
- Ground-based observations
- Linescans

**Note**: This layer represents a point-in-time snapshot and may not capture peak flood extent or flash flooding events.

**Status**: ⚠️ **Currently Unavailable**
- Layer exists in Victorian Government Data Directory
- NOT present in `opendata.maps.vic.gov.au/geoserver/wfs` GetCapabilities
- May require different WFS endpoint or access method
- Module gracefully handles unavailability

### 2. 1 in 100 Year Flood Extent (Statistical/Modelled Data)

**Dataset**: Victoria - 1 in 100 Year Flood Extent
**Source**: Department of Energy, Environment and Climate Action (DEECA)
**URL**: https://discover.data.vic.gov.au/dataset/1-in-100-year-flood-extent
**Layer Name**: `EXTENT_100Y_ARI` or similar
**Type**: Statistical model (1% Annual Exceedance Probability)

**Description**:
Polygon data delineating modelled statistical flood extent with 100-year Average Recurrence Interval (ARI). Used for:
- Land Subject to Inundation Overlay (LSIO) in planning schemes
- Development planning and risk assessment
- Insurance and property assessment

Derived using:
- Hydrological models
- Historic flood data
- Topographical analysis

**Status**: ⚠️ **Not Yet Implemented**
- Typename not yet verified in WFS GetCapabilities
- Implementation ready but commented out
- Will be enabled once correct typename is identified

## WFS Service Endpoints

### Primary Endpoint
**URL**: `https://opendata.maps.vic.gov.au/geoserver/wfs`
**Status**: Active, but flood layers not available

### Alternative Endpoints (To Investigate)
- `http://services.land.vic.gov.au/catalogue/publicproxy/guest/dv_geoserver/wfs` (requires auth)
- Digital Twin Victoria platform
- Vicmap as a Service (beta)

## Risk Classification

The module classifies flood risk into 5 levels:

| Level | Description | Criteria |
|-------|-------------|----------|
| **VERY_HIGH** | Property affected by historical flood | Within 2022 October flood extent |
| **HIGH** | Property in 100-year flood zone | Within 1% AEP modelled extent |
| **MODERATE** | Near flood zones | < 100m from flood extent |
| **LOW** | In proximity to flood zones | 100m - 500m from flood extent |
| **MINIMAL** | No identified hazards | > 500m or no data available |

## Current Implementation Status

### ✅ Implemented
- Complete type system with Zod validation
- Geocoding integration
- Distance calculation using Turf.js (point-in-polygon, nearest point)
- Risk level classification algorithm
- Planning recommendations generation
- Graceful error handling and fallback
- Integration with environmental data module

### ⚠️ Data Unavailable
- 2022 October flood history (layer not in WFS)
- 100-year flood extent (typename not verified)

### Current Behavior
When flood data is unavailable, the module:
1. Logs warnings about unavailable data
2. Returns `MINIMAL` flood risk classification
3. Provides generic recommendations
4. Allows PDF generation to continue

## Future Enhancements

### Short Term
1. **Contact Emergency Management Victoria** to obtain correct WFS endpoints for flood data
2. **Investigate alternative access methods**:
   - REST API instead of WFS
   - Downloaded shapefiles converted to local database
   - Digital Twin Victoria platform integration
3. **Enable 100-year flood extent** once typename is verified

### Medium Term
1. Add additional flood data sources:
   - 1 in 10 year, 1 in 20 year extents
   - Floodway overlays
   - Flood Planning Scheme overlays
2. Historical flood events beyond 2022
3. Real-time flood warnings integration

### Long Term
1. Climate change projections
2. Sea level rise modeling for coastal properties
3. Storm surge analysis
4. Dam break modeling awareness

## Usage

```typescript
import { getFloodRiskData } from "./getFloodRiskData/getFloodRiskData";

const { floodRiskData } = await getFloodRiskData({
  address: {
    addressLine: "7 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  },
});

// Returns null if geocoding fails
// Returns FloodRiskData with MINIMAL risk if no flood data available
// Returns comprehensive analysis when data is available
```

## Testing

Run the function directly for testing:

```bash
bun run src/.../getFloodRiskData.ts
```

## References

- [Victorian Flood Data and Mapping Guidelines](https://www.water.vic.gov.au/__data/assets/pdf_file/0036/661788/victorian-flood-data-and-mapping-guidelines.pdf)
- [Victorian Government Data Directory](https://discover.data.vic.gov.au)
- [Land Subject to Inundation Overlay](https://www.planning.vic.gov.au/guides-and-resources/guides/all-guides/land-subject-to-inundation-overlay)
- [FloodZoom Contact](mailto:floodzoom@deeca.vic.gov.au)

## License

Data is provided under Creative Commons Attribution 4.0 International License by the Victorian Government.
