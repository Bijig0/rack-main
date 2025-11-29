import type { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import { checkWaterServiceArea } from "./checkWaterServiceArea/checkWaterServiceArea";
import { queryYVWWater } from "./queryYVWWater/queryYVWWater";
import { queryMelbourneWater } from "./queryMelbourneWater/queryMelbourneWater";
import { queryOSMWater } from "./queryOSMWater/queryOSMWater";
import { analyzeWaterAccess } from "./analyzeWaterAccess/analyzeWaterAccess";
import type { WaterInfrastructure, WaterAlert } from "./types";

type Args = {
  address: Address;
  bufferMeters?: number;
};

type Return = {
  waterInfrastructure: WaterInfrastructure;
};

/**
 * Generates alerts based on water infrastructure analysis
 */
const generateAlerts = (
  hasConnection: boolean,
  nearestMainDistance: number | undefined | null,
  nearestHydrantDistance: number | undefined,
  pressureZone: string | null,
  dataSource: string
): WaterAlert[] => {
  const alerts: WaterAlert[] = [];

  // No data available
  if (!nearestMainDistance && dataSource === "none") {
    alerts.push({
      type: "note",
      message: "Detailed water infrastructure data is currently unavailable for this location. Contact the local water authority to confirm connection status.",
    });
    return alerts;
  }

  // Not connected to mains
  if (!hasConnection && nearestMainDistance) {
    if (nearestMainDistance > 1000) {
      alerts.push({
        type: "risk",
        message: `Property is ${(nearestMainDistance / 1000).toFixed(2)}km from the nearest water main. Connection may require significant infrastructure extension costs.`,
      });
    } else if (nearestMainDistance > 200) {
      alerts.push({
        type: "note",
        message: `Nearest water main is ${Math.round(nearestMainDistance)}m away. Verify connection feasibility and costs with the water authority.`,
      });
    }
  }

  // Fire hydrant distance concerns
  if (nearestHydrantDistance !== undefined) {
    if (nearestHydrantDistance > 500) {
      alerts.push({
        type: "note",
        message: `Nearest fire hydrant is ${Math.round(nearestHydrantDistance)}m away. May affect fire insurance premiums.`,
      });πsc
    } else if (nearestHydrantDistance <= 100) {
      alerts.push({
        type: "note",
        message: `Fire hydrant available within ${Math.round(nearestHydrantDistance)}m - favorable for fire safety and insurance.`,
      });
    }
  }

  // Pressure zone information
  if (pressureZone && pressureZone.toLowerCase().includes("low")) {
    alerts.push({
      type: "note",
      message: `Property is in a low pressure zone. Verify water pressure is adequate for intended use.`,
    });
  }

  // Data source note (if using fallback)
  if (dataSource === "osm") {
    alerts.push({
      type: "note",
      message: "Water infrastructure data sourced from OpenStreetMap community data. Verify with local water authority for accuracy.",
    });
  } else if (dataSource === "melbourne-water") {
    alerts.push({
      type: "note",
      message: "Water infrastructure data sourced from Melbourne Water wholesale supply network. Contact local retailer for property-specific connection details.",
    });
  }

  return alerts;
};

/**
 * Gets comprehensive water infrastructure data for a property using multiple data sources
 *
 * This function implements a multi-source fallback strategy:
 * 1. Determines the water service provider for the address
 * 2. Geocodes the address to get coordinates
 * 3. Queries water infrastructure data with fallback priority:
 *    - Primary: Yarra Valley Water WFS API (if in YVW service area)
 *    - Fallback 1: Melbourne Water ArcGIS REST API (wholesale supplier data)
 *    - Fallback 2: OpenStreetMap Overpass API (community-contributed hydrant data)
 * 4. Analyzes water pipe proximity and connectivity
 * 5. Identifies nearest fire hydrants
 * 6. Determines water pressure zone (if available)
 * 7. Generates descriptive text and recommendations
 *
 * Data Sources:
 * - YVW: Most detailed for YVW service areas, but currently blocked by WAF
 * - Melbourne Water: Reliable wholesale water main data, limited coverage
 * - OpenStreetMap: Good hydrant coverage, subject to rate limiting
 *
 * @param address - The property address to analyze
 * @param bufferMeters - Search radius in meters (default: 500m)
 * @returns Comprehensive water infrastructure data
 *
 * @example
 * ```typescript
 * const result = await getWaterData({
 *   address: {
 *     addressLine: "7 English Place",
 *     suburb: "Kew",
 *     state: "VIC",
 *     postcode: "3101"
 *   },
 *   bufferMeters: 500
 * });
 *
 * console.log(result.waterInfrastructure.isConnectedToMains); // true/false
 * console.log(result.waterInfrastructure.distanceToNearestMain); // distance in meters
 * console.log(result.waterInfrastructure.nearestWaterMain?.diameter); // pipe diameter in mm
 * console.log(result.waterInfrastructure.alerts); // array of alerts relevant to landlords/tenants
 * ```
 */
export const getWaterData = async ({
  address,
  bufferMeters = 500,
}: Args): Promise<Return> => {
  // Step 1: Check service area and determine provider
  const serviceAreaInfo = checkWaterServiceArea({ address });

  // Step 2: Geocode the address
  const { lat, lon } = await geocodeAddress({ address });

  let hasWaterConnection = false;
  let nearestWaterMain = undefined;
  let nearestHydrant = undefined;
  let waterPressureZone = null;

  // Step 3: Query water infrastructure data with fallback strategy
  // Priority: YVW → Melbourne Water → OpenStreetMap

  let waterPipes = null;
  let hydrants = null;
  let distributionZones = null;
  let dataSource = "none";

  // Try YVW first (if in service area)
  if (serviceAreaInfo.useYVW) {
    console.log("Attempting to query Yarra Valley Water API...");
    const yvwData = await queryYVWWater({
      lon,
      lat,
      bufferMeters,
    });

    if (yvwData.waterPipes && yvwData.waterPipes.features.length > 0) {
      waterPipes = yvwData.waterPipes;
      hydrants = yvwData.hydrants;
      distributionZones = yvwData.distributionZones;
      dataSource = "yvw";
      console.log(`YVW data retrieved: ${waterPipes.features.length} pipes found`);
    } else {
      console.log("YVW returned no data, trying fallback sources...");
    }
  }

  // Fallback to Melbourne Water if YVW didn't return data
  if (!waterPipes) {
    console.log("Attempting to query Melbourne Water API...");
    const mwData = await queryMelbourneWater({
      lon,
      lat,
      bufferMeters,
    });

    if (mwData.waterMains && mwData.waterMains.features.length > 0) {
      // Convert Melbourne Water format to YVW format for analysis
      waterPipes = {
        type: "FeatureCollection" as const,
        features: mwData.waterMains.features.map((feature) => ({
          type: "Feature" as const,
          id: feature.id?.toString(),
          properties: {
            PIPE_DIAMETER: feature.properties.PIPE_DIAMETER,
            PIPE_MATERIAL: feature.properties.PIPE_MATERIAL,
            SERVICE_STATUS: feature.properties.STATUS,
            ASSET_ID: feature.properties.PIPE_ID,
          },
          geometry: feature.geometry,
        })),
      };
      dataSource = "melbourne-water";
      console.log(`Melbourne Water data retrieved: ${waterPipes.features.length} pipes found`);
    } else {
      console.log("Melbourne Water returned no data, trying OpenStreetMap...");
    }
  }

  // Last resort: OpenStreetMap for hydrants
  if (!hydrants) {
    console.log("Querying OpenStreetMap for hydrants...");
    const osmData = await queryOSMWater({
      lon,
      lat,
      bufferMeters,
    });

    if (osmData.hydrants && osmData.hydrants.elements.length > 0) {
      // Convert OSM format to YVW format for analysis
      hydrants = {
        type: "FeatureCollection" as const,
        features: osmData.hydrants.elements
          .filter((el) => el.type === "node")
          .map((node) => {
            if (node.type === "node") {
              return {
                type: "Feature" as const,
                id: node.id.toString(),
                properties: {
                  HYDRANT_TYPE: node.tags?.["fire_hydrant:type"] || "Unknown",
                  SERVICE_STATUS: "Active",
                },
                geometry: {
                  type: "Point" as const,
                  coordinates: [node.lon, node.lat] as [number, number],
                },
              };
            }
            return null;
          })
          .filter((f): f is NonNullable<typeof f> => f !== null),
      };
      dataSource = dataSource === "none" ? "osm" : dataSource;
      console.log(`OpenStreetMap data retrieved: ${hydrants.features.length} hydrants found`);
    }
  }

  // Step 4: Analyze the data
  if (waterPipes || hydrants) {
    const analysis = analyzeWaterAccess({
      propertyLat: lat,
      propertyLon: lon,
      waterPipes,
      hydrants,
      distributionZones,
    });

    hasWaterConnection = analysis.hasWaterConnection;
    nearestWaterMain = analysis.nearestWaterMain;
    nearestHydrant = analysis.nearestHydrant;
    waterPressureZone = analysis.waterPressureZone;

    console.log(`Analysis complete using ${dataSource} data source`);
  } else {
    console.log(
      `No water infrastructure data available for ${serviceAreaInfo.provider} service area from any source`
    );
  }

  // Step 5: Generate alerts
  const alerts = generateAlerts(
    hasWaterConnection,
    nearestWaterMain?.distance,
    nearestHydrant?.distance,
    waterPressureZone,
    dataSource
  );

  // Step 6: Construct and return the water infrastructure data
  const waterInfrastructure: WaterInfrastructure = {
    isConnectedToMains: hasWaterConnection,
    distanceToNearestMain: nearestWaterMain?.distance ?? null,
    nearestWaterMain: nearestWaterMain
      ? {
          diameter: nearestWaterMain.diameter,
          material: nearestWaterMain.material,
          status: nearestWaterMain.serviceStatus,
          pressureZone: nearestWaterMain.pressureZone,
        }
      : undefined,
    alerts: alerts.length > 0 ? alerts : undefined,
  };

  return { waterInfrastructure };
};

if (import.meta.main) {
  console.log("\n=== WATER INFRASTRUCTURE TEST ===\n");

  // Test with multiple addresses
  const testAddresses: Address[] = [
    {
      addressLine: "7 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
    {
      addressLine: "1 Collins Street",
      suburb: "Melbourne",
      state: "VIC",
      postcode: "3000",
    },
    {
      addressLine: "100 Bridge Road",
      suburb: "Richmond",
      state: "VIC",
      postcode: "3121",
    },
  ];

  for (const address of testAddresses) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(
      `ADDRESS: ${address.addressLine}, ${address.suburb} ${address.postcode}`
    );
    console.log("=".repeat(80));

    try {
      const result = await getWaterData({
        address,
        bufferMeters: 500,
      });

      const { waterInfrastructure } = result;

      console.log(
        `\nConnected to Mains: ${waterInfrastructure.isConnectedToMains}`
      );

      if (waterInfrastructure.distanceToNearestMain !== null) {
        console.log(
          `Distance to Nearest Main: ${waterInfrastructure.distanceToNearestMain.toFixed(2)}m`
        );
      } else {
        console.log("Distance to Nearest Main: Not available");
      }

      if (waterInfrastructure.nearestWaterMain) {
        console.log("\nNearest Water Main Details:");
        console.log(
          `  Diameter: ${waterInfrastructure.nearestWaterMain.diameter || "N/A"}mm`
        );
        console.log(
          `  Material: ${waterInfrastructure.nearestWaterMain.material || "N/A"}`
        );
        console.log(
          `  Status: ${waterInfrastructure.nearestWaterMain.status || "N/A"}`
        );
        console.log(
          `  Pressure Zone: ${waterInfrastructure.nearestWaterMain.pressureZone || "N/A"}`
        );
      } else {
        console.log("\nNearest Water Main Details: Not available");
      }

      if (waterInfrastructure.alerts && waterInfrastructure.alerts.length > 0) {
        console.log("\nAlerts:");
        waterInfrastructure.alerts.forEach((alert, index) => {
          const icon = alert.type === "risk" ? "⚠️" : "ℹ️";
          console.log(`  ${index + 1}. ${icon} [${alert.type.toUpperCase()}] ${alert.message}`);
        });
      } else {
        console.log("\nAlerts: None");
      }
    } catch (error) {
      console.error(`Error processing address: ${error}`);
    }
  }

  console.log(`\n${"=".repeat(80)}\n`);
}
