import { Page } from "playwright";

type Args = {
  page: Page;
  url: string;
};

type Return = {
  page: Page;
};

const navigateToHomePage = async ({ page, url }: Args): Promise<Return> => {
  // Go to homepage first to establish cookies/session

  console.log(`🌐 Navigating to ${url}`);

  await page.goto("https://www.domain.com.au/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1000);

  // Now go to the property profile page
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait for the similar properties sections to appear
  try {
    // Wait for either for-rent or for-sale heading to appear
    await Promise.race([
      page.waitForSelector('h3#for-rent', { timeout: 5000 }),
      page.waitForSelector('h3#for-sale', { timeout: 5000 }),
    ]);
    console.log("✓ Found similar properties section");

    // Scroll to the similar properties container to trigger lazy loading
    // This will load both rent and sale sections
    const $similarProps = page.locator('[data-testid="similar-properties"]').first();
    await $similarProps.scrollIntoViewIfNeeded().catch(() => {
      console.log("⚠ Could not scroll to similar properties");
    });
    await page.waitForTimeout(1000);

    // Scroll down a bit more to ensure all sections are loaded
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });
    await page.waitForTimeout(2000);

    // Wait for network to be idle (all API calls completed)
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log("⚠ Network didn't go idle, continuing anyway");
    });

    // Check if links appeared
    const linksCount = await page.locator('a[id="similar-properties-link"]').count();
    console.log(`✓ Found ${linksCount} similar property links`);

    // If we found links, wait a bit more to ensure all content is loaded
    if (linksCount > 0) {
      await page.waitForTimeout(1000);
    }
  } catch (err) {
    console.log("⚠ Similar properties section took longer to load or not present");
    // Continue anyway - the section might not have content
  }

  console.log("✅ Page loaded successfully");

  return { page };
};

export { navigateToHomePage };
