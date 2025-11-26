import { Page } from "playwright";

export async function setupAntiBot(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  });
}

export const antiBotContextOptions = {
  viewport: { width: 1920, height: 1080 },
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  locale: "en-AU",
  timezoneId: "Australia/Melbourne",
} as const;

export const antiBotLaunchArgs = [
  "--disable-blink-features=AutomationControlled",
  "--disable-dev-shm-usage",
  "--no-sandbox",
] as const;
