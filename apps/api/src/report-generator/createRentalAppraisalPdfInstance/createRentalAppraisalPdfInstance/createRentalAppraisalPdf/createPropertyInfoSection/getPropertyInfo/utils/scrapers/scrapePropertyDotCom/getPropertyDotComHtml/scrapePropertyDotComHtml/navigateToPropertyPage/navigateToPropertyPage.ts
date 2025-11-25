type NavigateToPropertyPageArgs = {
  page: any; // Puppeteer Page type
  url: string;
};

/**
 * Navigates to property.com.au homepage then to the target property page
 * Using Puppeteer API (compatible with puppeteer-real-browser)
 */
export async function navigateToPropertyPage({
  page,
  url,
}: NavigateToPropertyPageArgs): Promise<void> {
  console.log(`🌐 Navigating to ${url}`);

  // Go to homepage first to establish cookies/session
  await page.goto("https://www.property.com.au/", {
    waitUntil: "networkidle0",
  });

  // Simulate human behavior - random delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(500 + Math.random() * 500);

  // Simulate mouse movement on homepage
  await page.mouse.move(100 + Math.random() * 300, 100 + Math.random() * 300);
  await delay(200);
  await page.mouse.move(400 + Math.random() * 300, 200 + Math.random() * 300);

  // Navigate to property page and wait for network to be idle
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000
  });

  // Wait for content to be rendered with random delay
  await delay(1000 + Math.random() * 500);

  // Simulate scrolling (human behavior)
  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(500);
  await page.evaluate(() => window.scrollBy(0, 500));

  console.log("✅ Page loaded successfully");

  // Log the page title to verify we're on the right page
  const title = await page.title();
  console.log(`📄 Page title: ${title}`);
}
