import z from "zod";

export const LandUseSchema = z.string().nullish();

export type LandUse = z.infer<typeof LandUseSchema>;
