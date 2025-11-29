import z from "zod";

export const FloorAreaSchema = z
  .object({
    value: z
      .number()
      .positive()
      .describe("Floor area numeric value (e.g., 358)"),
    unit: z.literal("m²").describe("Floor area unit (square metres)"),
  })
  .nullable()
  .describe("Floor area object or null if not found");

export type FloorArea = z.infer<typeof FloorAreaSchema>;
