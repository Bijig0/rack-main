import z from "zod";
import { AppraisalSummarySchema } from "../../getAppraisalSummary/types";
import { CouncilSchema } from "../../getCouncil/types";
import { DistanceFromCBDSchema } from "../../getDistanceFromCBD/types";
import { EstimatedValueRangeSchema } from "../../getEstimatedValueRange/types";
import { FloorAreaSchema } from "../../getFloorArea/types";
import { FrontageWidthSchema } from "../../getFrontageWidth/types";
import { LandAreaSchema } from "../../getLandArea/types";
import { NearbySchoolsSchema } from "../../getNearbySchools/types";
import { PropertyImageSchema } from "../../getPropertyImage/types";
import { PropertyTypeSchema } from "../../getPropertyType/types";
import { SimilarPropertiesForRentSchema } from "../../getSimilarPropertiesForRent/types";
import { SimilarPropertiesForSaleSchema } from "../../getSimilarPropertiesForSale/types";
import { YearBuiltSchema } from "../../getYearBuilt/types";
import { BedroomCountSchema } from "../../getBedroomCount/types";
import { BathroomCountSchema } from "../../getBathroomCount/types";

export const PropertyInfoSchema = z.object({
  bedroomCount: BedroomCountSchema,
  bathroomCount: BathroomCountSchema,
  yearBuilt: YearBuiltSchema,
  landArea: LandAreaSchema,
  floorArea: FloorAreaSchema,
  frontageWidth: FrontageWidthSchema,
  propertyType: PropertyTypeSchema,
  council: CouncilSchema,
  distanceFromCBD: DistanceFromCBDSchema,
  nearbySchools: NearbySchoolsSchema,
  propertyImage: PropertyImageSchema,
  estimatedValue: EstimatedValueRangeSchema,
  similarPropertiesForSale: SimilarPropertiesForSaleSchema,
  similarPropertiesForRent: SimilarPropertiesForRentSchema,
  appraisalSummary: AppraisalSummarySchema,

});

export type PropertyInfo = z.infer<typeof PropertyInfoSchema>;
