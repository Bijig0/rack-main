import { Effect, pipe } from "effect";
import { Address } from "../../../../../shared/types";
import { getAppraisalSummary } from "./getAppraisalSummary/getAppraisalSummary";
import { getCouncil } from "./getCouncil/getCouncil";
import { getDistanceFromCBD } from "./getDistanceFromCBD/getDistanceFromCBD";
import { getFloorArea } from "./getFloorArea/getFloorArea";
import { getLandArea } from "./getLandArea/getLandArea";
import { getNearbySchools } from "./getNearbySchools/getNearbySchools";
import { getPropertyImage } from "./getPropertyImage/getPropertyImage";
import { getPropertyType } from "./getPropertyType/getPropertyType";
import { getSimilarPropertiesForRent } from "./getSimilarPropertiesForRent/getSimilarPropertiesForRent";
import { getSimilarPropertiesForSale } from "./getSimilarPropertiesForSale/getSimilarPropertiesForSale";
import { getYearBuilt } from "./getYearBuilt/getYearBuilt";
import { PropertyInfo } from "./utils/types";
import { getReportCache } from "./utils/createReportCache/createReportCache/createReportCache";
import { fetchOrRetrieve } from "./utils/createReportCache/fetchOrRetrieve/fetchOrRetrieve";
import { scrapeDomainDotCom } from "./utils/scrapers/scrapeDomainDotCom/scrapeDomainDotCom";
import { scrapePropertyValueDotCom } from "./utils/scrapers/scrapePropertyValueDotCom/scrapePropertyValueDotCom";
import { scrapeRealEstateDotCom } from "./utils/scrapers/scrapeRealEstateDotCom/scrapePropertyValueDotCom";

type Args = {
  address: Address;
};

type Return = {
  propertyInfo: PropertyInfo;
};

/**
 * Pre-fetch HTML from all sources to populate the cache.
 * This prevents multiple concurrent getters from scraping the same source.
 *
 * Sources:
 * - propertyvalue.com: Used by 9 getters (yearBuilt, landArea, floorArea, propertyType, council, distanceFromCBD, appraisalSummary, propertyImage, estimatedValueRange)
 * - domain.com: Used by 3 getters (similarPropertiesForRent, similarPropertiesForSale, propertyTimeline)
 * - realestate.com: Used by 1 getter (nearbySchools)
 */
const prefetchSources = async ({ address }: Args): Promise<void> => {
  const cacheStore = getReportCache();

  const sources = [
    { source: "propertyvalue.com" as const, scraper: scrapePropertyValueDotCom },
    { source: "domain.com" as const, scraper: scrapeDomainDotCom },
    { source: "realestate.com" as const, scraper: scrapeRealEstateDotCom },
  ];

  // Fetch all sources in parallel (3 concurrent requests total)
  await Promise.all(
    sources.map(({ source, scraper }) =>
      fetchOrRetrieve({
        cacheStore,
        address,
        source,
        scraper,
      })
    )
  );
};

const createEffects = ({ address }: Args) => {
  return {
    yearBuilt: pipe(
      getYearBuilt({ address }),
      Effect.map((r) => r.yearBuilt)
    ),
    landArea: pipe(
      getLandArea({ address }),
      Effect.map((r) => r.landArea)
    ),
    floorArea: pipe(
      getFloorArea({ address }),
      Effect.map((r) => r.floorArea)
    ),
    propertyType: pipe(
      getPropertyType({ address }),
      Effect.map((r) => r.propertyType)
    ),
    council: pipe(
      getCouncil({ address }),
      Effect.map((r) => r.council)
    ),
    distanceFromCBD: pipe(
      getDistanceFromCBD({ address }),
      Effect.map((r) => r.distanceFromCBD)
    ),
    nearbySchools: pipe(
      getNearbySchools({ address }),
      Effect.map((r) => r.nearbySchools)
    ),
    appraisalSummary: pipe(
      getAppraisalSummary({ address }),
      Effect.map((r) => r.appraisalSummary)
    ),
    propertyImage: pipe(
      getPropertyImage({ address }),
      Effect.map((r) => r.propertyImage)
    ),
    similarPropertiesForSale: pipe(
      getSimilarPropertiesForSale({ address }),
      Effect.map((r) => r.similarPropertiesForSale)
    ),
    similarPropertiesForRent: pipe(
      getSimilarPropertiesForRent({ address }),
      Effect.map((r) => r.similarPropertiesForRent)
    ),
  };
};

const getPropertyInfo = async ({ address }: Args): Promise<Return> => {
  // Step 1: Pre-fetch all sources to populate the cache (3 parallel requests)
  // This ensures that when all getters run concurrently, they hit the cache
  // instead of making redundant requests to the same sources
  await prefetchSources({ address });

  // Step 2: Run all property info getters concurrently (all will use cached data)
  const propertyInfo = await Effect.runPromise(
    Effect.all(createEffects({ address }), {
      concurrency: "unbounded",
    })
  );

  return { propertyInfo };
};

if (import.meta.main) {
  const { propertyInfo } = await getPropertyInfo({
    address: {
      addressLine: "6 English Place",
      suburb: "Kew",
      state: "VIC",
      postcode: "3101",
    },
  });

  console.log(JSON.stringify(propertyInfo, null, 2));
}

export default getPropertyInfo;
