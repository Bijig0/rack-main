import z from "zod";
import {
  ElectricityInfrastructure,
  ElectricityInfrastructureSchema,
} from "../getElectricityData/analyzeElectricityData";
import {
  EmergencyServices,
  EmergencyServicesSchema,
} from "../getNearbyEmergencyServices/types";
import { Parks, ParksSchema } from "../getNearbyParks/types";
import { Playgrounds, PlaygroundsSchema } from "../getNearbyPlaygrounds/types";
import {
  ShoppingMalls,
  ShoppingMallsSchema,
} from "../getNearbyShoppingMallData/types";
import { SewageData, SewageDataSchema } from "../getSewageData/types";
import {
  StormwaterData,
  StormwaterDataSchema,
} from "../getStormwaterData/types";
import {
  InferredTransportStops,
  InferredTransportStopsSchema,
} from "../getTransportData/getPublicTransportData/types";
import { WaterInfrastructureSchema } from "../getWaterData/types";

export const InfrastructureDataSchema = z.object({
  electricityInfrastructureData: ElectricityInfrastructureSchema,
  nearbyEmergencyServices: EmergencyServicesSchema,
  nearbyParks: ParksSchema,
  nearbyPlaygrounds: PlaygroundsSchema,
  nearbyShoppingMalls: ShoppingMallsSchema,
  sewageData: SewageDataSchema,
  stormwaterData: StormwaterDataSchema,
  waterData: WaterInfrastructureSchema,
  publicTransport: InferredTransportStopsSchema,
  electricity: ElectricityInfrastructureSchema,
});

type InfrastructureData = z.infer<typeof InfrastructureDataSchema>;

export type { InfrastructureData };
