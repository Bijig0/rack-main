import { Browser, BrowserContext, chromium, Page } from "playwright";

type BrowserSetup = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export async function createBrowserContext(): Promise<BrowserSetup> {
  const browser = await chromium.launch({
    headless: true,
    slowMo: 100,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  return { browser, context, page };
}
