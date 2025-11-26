import z from "zod";
import { ElectricityInfrastructure } from "./getElectricityData/analyzeElectricityData";
import { EmergencyServices } from "./getNearbyEmergencyServices/types";
import { Parks } from "./getNearbyParks/types";
import { Playgrounds } from "./getNearbyPlaygrounds/types";
import { ShoppingMalls } from "./getNearbyShoppingMallData/types";
import { SewageSummary } from "./getSewageData/types";
import { StormwaterData } from "./getStormwaterData/types";
import { InferredTransportStops } from "./getTransportData/getPublicTransportData/types";
import { WaterData } from "./getWaterData/types";

export const GooglePlaceSchema = z.object({
  name: z.string(),
  place_id: z.string(),
  address: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type GooglePlace = z.infer<typeof GooglePlaceSchema>;

type InfrastructureDataSchema = {
  electricityInfrastructureData: ElectricityInfrastructure;
  nearbyEmergencyServices: EmergencyServices;
  nearbyParks: Parks;
  nearbyPlaygrounds: Playgrounds;
  nearbyShoppingMalls: ShoppingMalls;
  sewageData: SewageSummary;
  stormwaterData: StormwaterData;
  waterData: WaterData;
  publicTransport: InferredTransportStops;
  electricity: ElectricityInfrastructure;
};

// type InfrastructureData = z.infer<typeof InfrastructureDataSchema>;

// export type { InfrastructureData };
