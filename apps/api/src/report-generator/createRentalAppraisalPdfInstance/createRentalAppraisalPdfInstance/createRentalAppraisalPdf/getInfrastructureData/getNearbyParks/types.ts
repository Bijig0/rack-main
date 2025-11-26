import z from "zod";

import { GooglePlaceSchema } from "../types";

export const ParkSchema = GooglePlaceSchema;

export type Park = z.infer<typeof ParkSchema>;

export const ParksSchema = z.array(ParkSchema);

export type Parks = z.infer<typeof ParksSchema>;
