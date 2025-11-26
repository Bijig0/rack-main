/**
 * Navigates to a property page on propertyvalue.com.au
 * Using Puppeteer API (compatible with puppeteer-real-browser)
 */

type Args = {
  page: any; // Puppeteer Page
  url: string;
};

export async function navigateToPropertyPage({
  page,
  url,
}: Args): Promise<void> {
  console.log(`🌐 Navigating to ${url}`);

  // Puppeteer-compatible delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Go to homepage first to establish cookies/session
    console.log("📍 Loading homepage...");
    await page.goto("https://www.propertyvalue.com.au/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Simulate human behavior - random delay
    await delay(500 + Math.random() * 500);

    // Simulate mouse movement on homepage
    await page.mouse.move(
      100 + Math.random() * 300,
      100 + Math.random() * 300
    );
    await delay(200);
    await page.mouse.move(
      400 + Math.random() * 300,
      200 + Math.random() * 300
    );

    // Navigate to property page
    console.log(`📍 Navigating to property page: ${url}`);
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for content to be rendered with random delay
    await delay(2000 + Math.random() * 1000);

    // Simulate scrolling (human behavior)
    await page.evaluate(() => window.scrollBy(0, 500));
    await delay(500);
    await page.evaluate(() => window.scrollBy(0, 500));

    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    console.log(`✅ Successfully navigated to property page`);
  } catch (error) {
    console.error(`❌ Navigation error:`, error);
    throw error;
  }
}
