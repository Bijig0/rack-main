import * as E from "effect/Either";
import { Scraper, ScraperBaseReturn } from "../../../types";
import { Address, CacheStore, PropertyInfoSourcesSchema } from "../../types";
import { fetchNew } from "../fetchNew";

export const createFetcher = (source: PropertyInfoSourcesSchema) => {
  return (
    cacheStore: CacheStore,
    address: Address,
    scraper: Scraper
  ): Promise<E.Either<ScraperBaseReturn, Error>> => {
    return fetchNew(cacheStore, address, source, scraper);
  };
};

// Usage:
const fetchNewCoreLogic = createFetcher("corelogic");
const fetchNewDomainDotCom = createFetcher("domain.com");
const fetchNewRealEstateDotCom = createFetcher("realestate.com");
const fetchNewMicroburbsDotCom = createFetcher("microburbs.com");
const fetchNewPropertyComDotCom = createFetcher("property.com");
const fetchNewPropertyValueComDotCom = createFetcher("propertyvalue.com");

export {
  fetchNewCoreLogic,
  fetchNewDomainDotCom,
  fetchNewMicroburbsDotCom,
  fetchNewPropertyComDotCom,
  fetchNewPropertyValueComDotCom,
  fetchNewRealEstateDotCom,
};
