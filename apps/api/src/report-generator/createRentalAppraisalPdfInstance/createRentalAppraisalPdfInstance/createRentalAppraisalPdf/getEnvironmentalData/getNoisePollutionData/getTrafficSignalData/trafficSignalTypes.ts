import { z } from "zod";

// Traffic signal volume CSV row schema
export const TrafficSignalRowSchema = z.object({
  NB_SCATS_SITE: z.string(),
  QT_INTERVAL_COUNT: z.string(), // Date in YYYY-MM-DD format
  NB_DETECTOR: z.string(),
  // V00-V95 are 15-minute interval volumes (96 intervals per day)
  QT_VOLUME_24HOUR: z.string(), // Total daily volume
  NM_REGION: z.string().optional(),
  CT_RECORDS: z.string().optional(),
  CT_ALARM_24HOUR: z.string().optional(),
});

export type TrafficSignalRow = z.infer<typeof TrafficSignalRowSchema>;

// Aggregated traffic signal data for a site
export const TrafficSignalSiteSchema = z.object({
  scatsSiteId: z.string(),
  detectorId: z.string(),
  averageDailyVolume: z.number(), // Average vehicles per day
  peakHourVolume: z.number(), // Maximum hourly volume
  region: z.string(),
  date: z.string(),
});

export type TrafficSignalSite = z.infer<typeof TrafficSignalSiteSchema>;

// Traffic signal data for analysis
export const TrafficSignalDataSchema = z.object({
  sites: z.array(TrafficSignalSiteSchema),
  totalVolume: z.number(), // Total vehicles from all sites
  averageVolume: z.number(), // Average per site
  maxVolume: z.number(), // Maximum from any site
});

export type TrafficSignalData = z.infer<typeof TrafficSignalDataSchema>;
