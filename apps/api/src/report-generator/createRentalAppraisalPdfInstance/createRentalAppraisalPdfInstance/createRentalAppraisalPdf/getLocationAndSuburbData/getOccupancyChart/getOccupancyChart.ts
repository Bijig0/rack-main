import z from "zod";
import { createPropertyInfoGetter } from "../../getPropertyInfo/createPropertyInfoGetter";
import { getPropertyValueDotComOccupancyChart } from "./getPropertyValueDotComOccupancyChart/getPropertyValueDotComOccupancyChart";
import { OccupancyChartSchema } from "./types";

export const getOccupancyChart = createPropertyInfoGetter({
  schema: z.object({
    occupancyChart: OccupancyChartSchema,
  }),
  sourceFns: [getPropertyValueDotComOccupancyChart],
});

if (import.meta.main) {
  const { Effect } = await import("effect");

  const { occupancyChart } = await Effect.runPromise(
    getOccupancyChart({
      address: {
        addressLine: "6 English Place",
        suburb: "Kew",
        state: "VIC",
        postcode: "3101",
      },
    })
  );

  if (occupancyChart) {
    console.log("Occupancy Chart found:");
    console.log(`  Width: ${occupancyChart.width}`);
    console.log(`  Height: ${occupancyChart.height}`);
    console.log(`  SVG length: ${occupancyChart.svg.length} chars`);
    console.log(`  SVG preview: ${occupancyChart.svg.substring(0, 200)}...`);
  } else {
    console.log("No occupancy chart found");
  }
}
