import { z } from "zod";

export const ZoneCodeSchema = z.string().nullish();

export type ZoneCode = z.infer<typeof ZoneCodeSchema>;
