import z from "zod";
import { GooglePlaceSchema } from "../types/googlePlaceSchema";

export const EmergencyServiceSchema = GooglePlaceSchema;

export const emergencyServiceTypes = [
  "hospital",
  "police",
  "fire_station",
  "doctor",
] as const;

export type EmergencyService = z.infer<typeof EmergencyServiceSchema>;

export const EmergencyServicesSchema = z.array(EmergencyServiceSchema);

export type EmergencyServices = z.infer<typeof EmergencyServicesSchema>;
