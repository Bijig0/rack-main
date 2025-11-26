import z from "zod";

/**
 * Occupancy chart data extracted from Highcharts SVG pie chart
 * Shows household composition breakdown (Childless Couples, Couples with Children, etc.)
 */
export const OccupancyChartSchema = z
  .object({
    /** The raw SVG string of the chart */
    svg: z.string(),
    /** Width of the SVG */
    width: z.number().optional(),
    /** Height of the SVG */
    height: z.number().optional(),
  })
  .nullish()
  .describe("Occupancy/household composition pie chart SVG");

export type OccupancyChart = z.infer<typeof OccupancyChartSchema>;
