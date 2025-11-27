import { Browser, chromium, Page } from "playwright";
import {
  antiBotContextOptions,
  antiBotLaunchArgs,
  setupAntiBot,
} from "./setupAntiBot/setupAntiBot";

type Return = {
  page: Page;
  browser: Browser;
};

const createAntiBotBrowserContext = async (): Promise<Return> => {
  // Launch with more realistic browser settings to avoid bot detection
  const browser = await chromium.launch({
    headless: true,
    args: antiBotLaunchArgs,
  });

  const context = await browser.newContext(antiBotContextOptions);

  const page = await context.newPage();

  // Hide webdriver property
  await setupAntiBot(page);

  return { page, browser };
};

export { createAntiBotBrowserContext };
