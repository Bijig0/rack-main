import z from "zod";
import { GooglePlaceSchema } from "../types";

export const EmergencyServiceSchema = GooglePlaceSchema;

export const emergencyServiceTypes = [
  "hospital",
  "police",
  "fire_station",
  "doctor",
] as const;

export type EmergencyService = z.infer<typeof EmergencyServiceSchema>;
