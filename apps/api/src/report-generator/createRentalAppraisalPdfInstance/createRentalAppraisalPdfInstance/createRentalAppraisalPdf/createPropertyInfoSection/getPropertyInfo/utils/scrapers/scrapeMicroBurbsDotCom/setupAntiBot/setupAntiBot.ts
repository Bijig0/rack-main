import { Page } from "playwright";

/**
 * Sets up anti-bot detection measures on a Playwright page
 * Hides the webdriver property to make the browser appear more human-like
 */
export async function setupAntiBot(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  });
}

/**
 * Browser context options for avoiding bot detection
 * Includes realistic viewport, user agent, locale, and headers
 */
export const antiBotContextOptions = {
  viewport: { width: 1920, height: 1080 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  locale: "en-AU",
  timezoneId: "Australia/Melbourne",
  extraHTTPHeaders: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-AU,en;q=0.9",
    "Sec-Ch-Ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  },
} as const;

/**
 * Browser launch arguments for avoiding bot detection
 * Disables automation-controlled features
 */
export const antiBotLaunchArgs = [
  "--disable-blink-features=AutomationControlled",
  "--disable-dev-shm-usage",
  "--no-sandbox",
] as const;
