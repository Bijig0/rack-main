import { z } from "zod";

export const ZoneDescriptionSchema = z.string().nullish();

export type ZoneDescription = z.infer<typeof ZoneDescriptionSchema>;
