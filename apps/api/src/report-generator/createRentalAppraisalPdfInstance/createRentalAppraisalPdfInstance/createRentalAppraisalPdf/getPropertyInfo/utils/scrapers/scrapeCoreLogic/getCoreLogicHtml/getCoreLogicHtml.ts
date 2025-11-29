import * as E from "effect/Either";
import {
  CORELOGIC_EMAIL,
  CORELOGIC_PASSWORD,
  CORELOGIC_URL,
  CORELOGIC_USERNAME,
} from "../../../../../../../../../shared/config";
import { Address } from "../../../createReportCache";
import {
  Scraper,
  ScraperBaseArgs,
  ScraperBaseReturn,
} from "../../../types/scraper";
import { createBrowserContext } from "../createBrowserContext/createBrowserContext";
import {
  scrapeCoreLogic,
  WithCoreLogicAuth,
} from "./scrapeCoreLogicHtml/scrapeCoreLogic";

type Args = ScraperBaseArgs;
type Return = ScraperBaseReturn;

type GetCoreLogicHtml = Scraper<Args, Return>;

const getCoreLogicHtml: GetCoreLogicHtml = async ({ address }) => {
  const { page, browser } = await createBrowserContext();

  const auth = {
    email: CORELOGIC_EMAIL,
    username: CORELOGIC_USERNAME,
    password: CORELOGIC_PASSWORD,
    url: CORELOGIC_URL,
  } satisfies WithCoreLogicAuth;

  const html = await scrapeCoreLogic({ address, page, browser, auth });

  return html;
};

export { getCoreLogicHtml };

if (import.meta.main) {
  const address = {
    addressLine: "6 English Place",
    suburb: "Kew",
    state: "VIC",
    postcode: "3101",
  } satisfies Address;

  try {
    const result = await getCoreLogicHtml({ address });
    E.map(result, ({ html }) => {
      console.log({ html });
    });
  } catch (error) {
    console.error("❌ Error:", error);
  }
}
