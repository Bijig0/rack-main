/**
 * Finds the PropertyValue.com.au property ID by searching for the address
 * The ID is needed to construct the full property URL
 */

import { Address } from "../../../../../../../../../../../../shared/types";

type Args = {
  address: Address;
  page: any; // Puppeteer Page
};

type Return = {
  propertyId: string | null;
};

/**
 * Searches PropertyValue.com.au to find the property ID for a given address
 *
 * Strategy:
 * 1. Navigate to the search page
 * 2. Search for the address
 * 3. Extract the property ID from the search results URL or page content
 */
export async function findPropertyId({ address, page }: Args): Promise<Return> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    console.log("🔍 Searching for property ID...");

    // Navigate to PropertyValue.com.au search
    await page.goto("https://www.propertyvalue.com.au/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await delay(1000);

    // Look for search input field
    const searchInput = await page.$(
      'input[type="text"], input[placeholder*="address"], input[name*="search"]'
    );

    if (!searchInput) {
      console.warn("⚠️  Could not find search input");
      return { propertyId: null };
    }

    // Type the address into the search field
    const fullAddress = `${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`;
    await searchInput.type(fullAddress, { delay: 100 });

    await delay(1000);

    // Wait for search suggestions/results to appear
    await page.waitForSelector('a[href*="/property/"]', { timeout: 10000 });

    // Extract all property links
    const propertyLinks = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('a[href*="/property/"]')
      );
      return links.map((link) => ({
        href: (link as HTMLAnchorElement).href,
        text: link.textContent?.trim() || "",
      }));
    });

    console.log(`📋 Found ${propertyLinks.length} property link(s)`);

    // Find the matching property link
    for (const link of propertyLinks) {
      console.log(`  - ${link.text}: ${link.href}`);

      // Extract property ID from URL like: /property/7-english-place-kew-vic-3101/16062963
      const match = link.href.match(/\/property\/[^/]+\/(\d+)/);
      if (match) {
        const propertyId = match[1];
        console.log(`✅ Found property ID: ${propertyId}`);
        return { propertyId };
      }
    }

    console.warn("⚠️  Could not extract property ID from search results");
    return { propertyId: null };
  } catch (error) {
    console.error("❌ Error finding property ID:", error);
    return { propertyId: null };
  }
}
