import { Page } from "playwright";

type NavigateToHomePageArgs = {
  page: Page;
  url: string;
};

/**
 * Navigates to MicroBurbs homepage first to establish cookies/session,
 * then navigates to the target suburb report page
 */
export async function navigateToPropertyPage({
  page,
  url,
}: NavigateToHomePageArgs): Promise<void> {
  console.log(`🌐 Navigating to ${url}`);

  // Go to homepage first to establish cookies/session
  await page.goto("https://www2.microburbs.com.au/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1000);

  // Now go to the suburb report page
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait for content to load
  await page.waitForTimeout(3000);

  console.log("✅ Page loaded successfully");
}
