import fs from "fs";
import path from "path";
import z from "zod";
import { Address } from "../../../../../../shared/types";
import { geocodeAddress } from "../../../../wfsDataToolkit/geocodeAddress/geoCodeAddress";
import {
  analyzeBushfireRisk,
  BushfireRiskAnalysis,
  BushfireRiskAnalysisSchema,
} from "./analyzeBushfireRisk";
import {
  InferredFireHistoryData,
  InferredFireHistoryDataSchema,
} from "./createFireHistoryResponseSchema/types";
import { getBushfireProneAreas } from "./getBushfireProneAreas";
import { getFireHistory } from "./getFireHistory";
import {
  InferredFireManagementZone,
  InferredFireManagementZoneSchema,
} from "./getFireManagementZones/types";

type Args = {
  address: Address;
};

export const BushfireRiskDataSchema = z.object({
  // bushfireProneAreas: InferredBushfireRiskDataSchema.array(),
  fireHistory: InferredFireHistoryDataSchema.array(),
  // fireManagementZones: InferredFireManagementZoneSchema.array().nullable(),
  riskAnalysis: BushfireRiskAnalysisSchema,
});

export type BushfireRiskData = {
  // bushfireProneAreas: InferredBushfireRiskData[];
  fireHistory: InferredFireHistoryData[];
  fireManagementZones?: InferredFireManagementZone[];
  riskAnalysis: BushfireRiskAnalysis;
};

type Return = BushfireRiskData;

/**
 * Get comprehensive bushfire risk data from multiple sources
 * Includes: bushfire prone areas, historical fire records, fire management zones, and risk analysis
 */
export const getBushfireRiskData = async ({
  address,
}: Args): Promise<Return> => {
  const { lat, lon } = await geocodeAddress({ address });

  // Fetch all three datasets in parallel
  const [bushfireProneAreas, fireHistory] = await Promise.all([
    getBushfireProneAreas({ lat, lon }),
    getFireHistory({ lat, lon }),
    // getFireManagementZones({ lat, lon }),
  ]);

  // Analyze risk based on all data sources
  const riskAnalysis = analyzeBushfireRisk({
    bushfireProneAreas,
    fireHistory,
    propertyLat: lat,
    propertyLon: lon,
  });

  return {
    // bushfireProneAreas,
    fireHistory,
    // fireManagementZones,
    riskAnalysis,
  };
};

if (import.meta.main) {
  const { fireHistory, fireManagementZones, riskAnalysis } =
    await getBushfireRiskData({
      address: {
        addressLine: "Flinders Street Station",
        suburb: "Melbourne",
        state: "VIC",
        postcode: "3000",
      },
    });

  console.log("\n=== BUSHFIRE RISK ANALYSIS ===");
  console.log(`Overall Risk: ${riskAnalysis.overallRisk}`);
  console.log(`\n${riskAnalysis.summary}`);

  console.log("\n--- Risk Factors ---");
  console.log(
    `In Bushfire Prone Area: ${riskAnalysis.riskFactors.inBushfireProneArea}`
  );
  console.log(
    `Historical Fires Nearby: ${riskAnalysis.riskFactors.historicalFiresNearby}`
  );
  console.log(
    `Recent Fires (last 10 years): ${riskAnalysis.riskFactors.recentFiresNearby}`
  );

  if (riskAnalysis.riskFactors.fireManagementZone) {
    console.log("\nFire Management Zone:");
    console.log(
      `  Zone Type: ${riskAnalysis.riskFactors.fireManagementZone.zoneTypeDescription}`
    );
    console.log(
      `  Within Zone: ${riskAnalysis.riskFactors.fireManagementZone.isWithinZone}`
    );
    if (!riskAnalysis.riskFactors.fireManagementZone.isWithinZone) {
      console.log(
        `  Distance: ${riskAnalysis.riskFactors.fireManagementZone.distance.measurement.toFixed(
          2
        )}${riskAnalysis.riskFactors.fireManagementZone.distance.unit}`
      );
    }
  }

  if (riskAnalysis.riskFactors.closestHistoricalFire) {
    console.log("\nClosest Historical Fire:");
    console.log(
      `  Distance: ${riskAnalysis.riskFactors.closestHistoricalFire.distance.measurement.toFixed(
        2
      )}${riskAnalysis.riskFactors.closestHistoricalFire.distance.unit}`
    );
    console.log(
      `  Name: ${riskAnalysis.riskFactors.closestHistoricalFire.fireName}`
    );
    console.log(
      `  Season: ${riskAnalysis.riskFactors.closestHistoricalFire.fireSeason}`
    );
  }

  console.log("\n--- Recommendations ---");
  riskAnalysis.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`);
  });

  console.log("\n--- Data Summary ---");
  // console.log(`Bushfire Prone Areas: ${bushfireProneAreas.length}`);
  console.log(`Fire History Records: ${fireHistory.length}`);
  console.log(`Fire Management Zones: ${fireManagementZones?.length}`);

  // Write to JSON file
  const outputPath = path.join(__dirname, "bushfire_risk_analysis.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        // bushfireProneAreas,
        fireHistory: fireHistory.slice(0, 20), // Limit to first 20 for readability
        fireManagementZones,
        riskAnalysis,
      },
      null,
      2
    )
  );

  console.log(`\n✓ Full data written to ${outputPath}`);
}
