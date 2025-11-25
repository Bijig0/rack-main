/**
 * Yarra Valley Water Infrastructure Data Fetcher
 * Fetch water, sewer, and stormwater data for properties
 */

interface YVWConfig {
  baseUrl: string;
  latitude: number;
  longitude: number;
  bufferMeters?: number;
}

interface InfrastructureData {
  water?: {
    pipes: any[];
    connections: any[];
    hydrants: any[];
  };
  sewer?: {
    pipes: any[];
    branches: any[];
    structures: any[];
  };
  recycledWater?: {
    pipes: any[];
    connections: any[];
    zones: any[];
  };
}

/**
 * Fetch YVW WFS data
 */
async function fetchYVWData(
  typename: string,
  bbox?: string,
  count: number = 100
): Promise<any> {
  const baseUrl = "https://webmap.yvw.com.au/YVWAssets/service.svc/get";

  const params = new URLSearchParams({
    SERVICE: "WFS",
    VERSION: "2.0.0",
    REQUEST: "GetFeature",
    TYPENAME: typename,
    OUTPUTFORMAT: "application/json",
    SRSNAME: "EPSG:4326",
    COUNT: count.toString(),
  });

  if (bbox) {
    params.append("BBOX", bbox);
  }

  const url = `${baseUrl}?${params.toString()}`;

  console.log(`Fetching: ${typename}...`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${typename}:`, error);
    return null;
  }
}

/**
 * Create a bounding box around a point
 * @param lat - Latitude
 * @param lon - Longitude
 * @param bufferDegrees - Buffer in degrees (~0.005 = ~500m)
 */
function createBoundingBox(
  lat: number,
  lon: number,
  bufferDegrees: number = 0.005
): string {
  const minLon = lon - bufferDegrees;
  const minLat = lat - bufferDegrees;
  const maxLon = lon + bufferDegrees;
  const maxLat = lat + bufferDegrees;

  return `${minLon},${minLat},${maxLon},${maxLat},EPSG:4326`;
}

/**
 * Get all infrastructure data for a property
 */
async function getPropertyInfrastructure(
  latitude: number,
  longitude: number,
  bufferMeters: number = 500
): Promise<InfrastructureData> {
  // Convert meters to degrees (approximate)
  const bufferDegrees = bufferMeters / 111000; // ~111km per degree
  const bbox = createBoundingBox(latitude, longitude, bufferDegrees);

  console.log(`\n=== Fetching Infrastructure Data ===`);
  console.log(`Location: ${latitude}, ${longitude}`);
  console.log(`Buffer: ${bufferMeters}m`);
  console.log(`Bounding Box: ${bbox}\n`);

  // Fetch water data
  console.log("📍 WATER INFRASTRUCTURE:");
  const waterPipes = await fetchYVWData("yvw:WATERPIPES", bbox);
  const waterConnections = await fetchYVWData(
    "yvw:WATERPROPERTYCONNECTIONS",
    bbox
  );
  const waterHydrants = await fetchYVWData("yvw:WATERHYDRANTS", bbox);

  // Fetch sewer data
  console.log("\n📍 SEWER INFRASTRUCTURE:");
  const sewerPipes = await fetchYVWData("yvw:SEWERPIPES", bbox);
  const sewerBranches = await fetchYVWData("yvw:SEWERBRANCHES", bbox);
  const sewerStructures = await fetchYVWData("yvw:SEWERSTRUCTURES", bbox);

  // Fetch recycled water (NDW) data
  console.log("\n📍 RECYCLED WATER (NDW) INFRASTRUCTURE:");
  const ndwPipes = await fetchYVWData("yvw:NDWPIPES", bbox);
  const ndwConnections = await fetchYVWData("yvw:NDWPROPERTYCONNECTIONS", bbox);
  const ndwZones = await fetchYVWData("yvw:NDW_DISTRIBUTION_ZONES", bbox);

  return {
    water: {
      pipes: waterPipes?.features || [],
      connections: waterConnections?.features || [],
      hydrants: waterHydrants?.features || [],
    },
    sewer: {
      pipes: sewerPipes?.features || [],
      branches: sewerBranches?.features || [],
      structures: sewerStructures?.features || [],
    },
    recycledWater: {
      pipes: ndwPipes?.features || [],
      connections: ndwConnections?.features || [],
      zones: ndwZones?.features || [],
    },
  };
}

/**
 * Analyze infrastructure availability
 */
function analyzeInfrastructure(data: InfrastructureData) {
  console.log(`\n\n=== INFRASTRUCTURE ANALYSIS ===\n`);

  // Water Analysis
  console.log("💧 WATER:");
  console.log(`   Pipes found: ${data.water?.pipes.length || 0}`);
  console.log(
    `   Property connections: ${data.water?.connections.length || 0}`
  );
  console.log(`   Hydrants: ${data.water?.hydrants.length || 0}`);
  console.log(
    `   Status: ${
      data.water?.pipes.length > 0 ? "✅ Available" : "❌ Not available"
    }`
  );

  // Sewer Analysis
  console.log("\n🚽 SEWER:");
  console.log(`   Pipes found: ${data.sewer?.pipes.length || 0}`);
  console.log(`   Property branches: ${data.sewer?.branches.length || 0}`);
  console.log(`   Structures: ${data.sewer?.structures.length || 0}`);
  console.log(
    `   Status: ${
      data.sewer?.pipes.length > 0 ? "✅ Available" : "❌ Not available"
    }`
  );

  // Recycled Water Analysis
  console.log("\n♻️  RECYCLED WATER (NDW):");
  console.log(`   Pipes found: ${data.recycledWater?.pipes.length || 0}`);
  console.log(
    `   Property connections: ${data.recycledWater?.connections.length || 0}`
  );
  console.log(
    `   Distribution zones: ${data.recycledWater?.zones.length || 0}`
  );
  console.log(
    `   Status: ${
      data.recycledWater?.pipes.length > 0 ? "✅ Available" : "❌ Not available"
    }`
  );

  // Summary
  console.log("\n=== SUMMARY ===");
  const servicesAvailable = [
    data.water?.pipes.length > 0 ? "Water" : null,
    data.sewer?.pipes.length > 0 ? "Sewer" : null,
    data.recycledWater?.pipes.length > 0 ? "Recycled Water" : null,
  ].filter(Boolean);

  if (servicesAvailable.length > 0) {
    console.log(`✅ Available services: ${servicesAvailable.join(", ")}`);
  } else {
    console.log("❌ No infrastructure found in this area");
  }
}

/**
 * Get detailed pipe information
 */
function analyzePipes(pipes: any[], type: string) {
  if (!pipes || pipes.length === 0) {
    console.log(`\nNo ${type} pipes found in area`);
    return;
  }

  console.log(`\n=== ${type.toUpperCase()} PIPE DETAILS ===`);

  pipes.slice(0, 5).forEach((feature, index) => {
    const props = feature.properties;
    console.log(`\nPipe ${index + 1}:`);
    console.log(`  Asset ID: ${props.ASSETID || "N/A"}`);
    console.log(`  Material: ${props.MATERIAL || "N/A"}`);
    console.log(`  Diameter: ${props.DIAMETER || "N/A"}mm`);
    console.log(`  Length: ${props.LENGTH || "N/A"}m`);
    console.log(`  Installed: ${props.INSTALLED_DATE || "N/A"}`);
    console.log(`  Owner: ${props.OWNER || "N/A"}`);
  });

  if (pipes.length > 5) {
    console.log(`\n... and ${pipes.length - 5} more pipes`);
  }
}

/**
 * Calculate distance to nearest infrastructure
 */
function findNearestInfrastructure(
  targetLat: number,
  targetLon: number,
  features: any[]
): { distance: number; feature: any } | null {
  if (!features || features.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  features.forEach((feature) => {
    if (feature.geometry?.type === "Point") {
      const [lon, lat] = feature.geometry.coordinates;
      const distance = calculateDistance(targetLat, targetLon, lat, lon);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = feature;
      }
    } else if (feature.geometry?.type === "LineString") {
      // For lines, find distance to closest point on line
      feature.geometry.coordinates.forEach(([lon, lat]: [number, number]) => {
        const distance = calculateDistance(targetLat, targetLon, lat, lon);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = feature;
        }
      });
    }
  });

  return nearest ? { distance: minDistance, feature: nearest } : null;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Export data to files
 */
async function exportData(data: InfrastructureData, filename: string) {
  const fs = await import("fs");
  const outputPath = `/mnt/user-data/outputs/${filename}`;

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✅ Data exported to: ${outputPath}`);
}

// Main execution
async function main() {
  // Example: Melbourne CBD area
  // Replace with your property coordinates
  const propertyLat = -37.8136;
  const propertyLon = 144.9631;
  const bufferMeters = 500;

  console.log("🏠 Yarra Valley Water Infrastructure Checker");
  console.log("============================================\n");

  try {
    // Fetch all infrastructure data
    const data = await getPropertyInfrastructure(
      propertyLat,
      propertyLon,
      bufferMeters
    );

    // Analyze the results
    analyzeInfrastructure(data);

    // Show detailed pipe information
    if (data.water?.pipes.length > 0) {
      analyzePipes(data.water.pipes, "Water");
    }

    if (data.sewer?.pipes.length > 0) {
      analyzePipes(data.sewer.pipes, "Sewer");
    }

    // Find nearest connections
    console.log("\n=== NEAREST INFRASTRUCTURE ===");

    const nearestWater = findNearestInfrastructure(
      propertyLat,
      propertyLon,
      data.water?.connections || []
    );
    if (nearestWater) {
      console.log(
        `\n💧 Nearest water connection: ${nearestWater.distance.toFixed(
          0
        )}m away`
      );
    }

    const nearestSewer = findNearestInfrastructure(propertyLat, propertyLon, [
      ...(data.sewer?.pipes || []),
      ...(data.sewer?.branches || []),
    ]);
    if (nearestSewer) {
      console.log(
        `🚽 Nearest sewer: ${nearestSewer.distance.toFixed(0)}m away`
      );
    }

    // Export to file
    // await exportData(data, 'yvw_infrastructure_data.json');

    console.log("\n✅ Analysis complete!\n");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the script
main().catch(console.error);

export {
  fetchYVWData,
  getPropertyInfrastructure,
  analyzeInfrastructure,
  createBoundingBox,
  calculateDistance,
};
