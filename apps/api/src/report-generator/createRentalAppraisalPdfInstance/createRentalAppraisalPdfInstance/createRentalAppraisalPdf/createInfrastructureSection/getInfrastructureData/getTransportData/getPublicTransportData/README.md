# Get Public Transport Data

Returns all public transport stops and their routes within a specified radius of an address.

## Features

- ✅ Loads data from local GeoJSON files (29,202 stops, 10,700 lines)
- ✅ Finds all stops within a configurable radius (default 5km)
- ✅ Calculates exact distance from address to each stop
- ✅ Matches stops with their routes by analyzing transit line geometries
- ✅ Returns sorted results (closest first)
- ✅ Supports all transport modes (Metro Tram, Regional Train, Metro Train, Bus, etc.)

## Usage

```typescript
import { getPublicTransportData } from "./getPublicTransportData";

const { nearbyStops } = await getPublicTransportData({
  address: {
    addressLine: "123 Collins Street",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "3000",
  },
  radiusKm: 5, // Optional, defaults to 5km
});

console.log(`Found ${nearbyStops.length} stops`);
console.log(`Closest stop: ${nearbyStops[0].stopName}`);
console.log(`Distance: ${nearbyStops[0].distance.measurement.toFixed(2)}km`);
console.log(`Routes: ${nearbyStops[0].routes?.join(", ")}`);
```

## Output Structure

```typescript
{
  nearbyStops: [
    {
      stopId: "22153",
      stopName: "Exhibition St/Collins St #7",
      mode: "METRO TRAM",
      distance: {
        measurement: 0.10455733525370783,
        unit: "km"
      },
      coordinates: {
        lat: -37.81438317,
        lon: 144.97051388
      },
      routes: [
        "Port Melbourne - Box Hill",
        "Victoria Harbour Docklands - West Preston",
        "St Kilda (Fitzroy St) - Victoria Gardens"
      ]
    },
    // ... more stops
  ]
}
```

## Performance

- **Loading time**: ~2 minutes for initial load (large GeoJSON files)
- **Processing time**: Fast after loading (in-memory filtering)
- **Memory usage**: ~400MB for GeoJSON data

## Data Sources

- `public_transport_stops.geojson` - All public transport stops in Victoria
- `public_transport_lines.geojson` - All transit line geometries

## Testing

Run the test directly:

```bash
bun src/.../getPublicTransportData.ts
```

This will:
1. Geocode the test address
2. Load and parse GeoJSON files
3. Find stops within 5km
4. Match routes to stops
5. Display the 10 closest stops
6. Write full results to `nearbyTransportStops.json`
