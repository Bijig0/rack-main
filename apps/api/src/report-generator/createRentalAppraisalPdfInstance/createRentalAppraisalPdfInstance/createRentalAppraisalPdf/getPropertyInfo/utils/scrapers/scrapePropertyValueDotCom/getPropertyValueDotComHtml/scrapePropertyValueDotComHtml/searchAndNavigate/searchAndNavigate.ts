/**
 * Searches for a property on PropertyValue.com.au and navigates to the result
 *
 * Workflow:
 * 1. Navigate to PropertyValue.com.au homepage
 * 2. Close cookie consent modal if present
 * 3. Find and fill the search input with the address
 * 4. Wait for search results and click the first matching result
 */

import { Address } from "../../../../../../../../../../../shared/types";

type Args = {
  address: Address;
  page: any; // Puppeteer Page
};

export async function searchAndNavigate({
  address,
  page,
}: Args): Promise<void> {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    console.log("🌐 Navigating to PropertyValue.com.au...");

    // Navigate to homepage
    await page.goto("https://www.propertyvalue.com.au/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await delay(2000);

    // Step 1: Close cookie consent modal if present
    console.log("🍪 Checking for cookie consent modal...");
    try {
      // Try to find and click accept buttons using page.evaluate
      const cookieAccepted = await page.evaluate(() => {
        // Look for buttons that are specifically for cookies
        // Be more specific to avoid clicking wrong buttons
        const buttons = Array.from(document.querySelectorAll("button"));

        for (const button of buttons) {
          const text = (button.textContent?.trim() || "").toLowerCase();
          const id = button.id?.toLowerCase() || "";
          const className = button.className?.toLowerCase() || "";
          const ariaLabel =
            button.getAttribute("aria-label")?.toLowerCase() || "";

          // Only match if it's clearly a cookie consent button
          // Must have "accept" AND be cookie-related
          const hasCookieContext =
            className.includes("cookie") ||
            id.includes("cookie") ||
            ariaLabel.includes("cookie") ||
            text.includes("cookie");

          const hasAcceptAction =
            text === "accept" ||
            text === "accept all" ||
            text === "i accept" ||
            text === "agree" ||
            text.startsWith("accept");

          if (hasAcceptAction && hasCookieContext) {
            console.log("Found cookie accept button:", text, id, className);
            button.click();
            return true;
          }
        }

        // If no specific cookie button found, look for modal with cookie in it
        const modals = Array.from(
          document.querySelectorAll(
            '[class*="modal"], [class*="popup"], [role="dialog"]'
          )
        );
        for (const modal of modals) {
          const modalText = (modal.textContent || "").toLowerCase();
          if (modalText.includes("cookie") || modalText.includes("privacy")) {
            // Find accept button within this modal
            const modalButtons = Array.from(modal.querySelectorAll("button"));
            for (const btn of modalButtons) {
              const btnText = (btn.textContent?.trim() || "").toLowerCase();
              if (
                btnText === "accept" ||
                btnText === "accept all" ||
                btnText === "i accept"
              ) {
                console.log("Found accept button in cookie modal:", btnText);
                (btn as HTMLElement).click();
                return true;
              }
            }
          }
        }

        return false;
      });

      if (cookieAccepted) {
        console.log("✅ Clicked cookie accept button");
        await delay(1500);
      } else {
        console.log("ℹ️  No cookie modal detected");
      }
    } catch (err) {
      console.log("ℹ️  Error handling cookie modal:", err);
    }

    // Step 2: Find and fill the search input
    console.log("🔍 Searching for property...");

    const fullAddress = `${address.addressLine}, ${address.suburb} ${address.state} ${address.postcode}`;
    console.log(`   Address: ${fullAddress}`);

    // Try multiple search input selectors
    const searchSelectors = [
      'input[type="text"]',
      'input[placeholder*="address"]',
      'input[placeholder*="Address"]',
      'input[placeholder*="search"]',
      'input[placeholder*="Search"]',
      'input[name*="search"]',
      'input[id*="search"]',
      ".search-input",
      "#search-input",
    ];

    let searchInput = null;
    for (const selector of searchSelectors) {
      try {
        const input = await page.$(selector);
        if (input) {
          searchInput = input;
          console.log(`   Found search input: ${selector}`);
          break;
        }
      } catch (err) {
        // Continue to next selector
      }
    }

    if (!searchInput) {
      throw new Error("Could not find search input field");
    }

    // Type the address with human-like delay
    await searchInput.click();
    await delay(500);
    await searchInput.type(fullAddress, { delay: 100 });
    await delay(2000); // Give more time for autocomplete to appear

    // Step 3: Use keyboard navigation to select autocomplete suggestion
    console.log("⏳ Using keyboard to select autocomplete suggestion...");

    // Take a screenshot to debug
    await page.screenshot({ path: "propertyvalue-before-search.png" });
    console.log("📸 Screenshot saved: propertyvalue-before-search.png");

    // Press Arrow Down to select the first autocomplete result
    console.log("⬇️  Pressing ArrowDown to select first result...");
    await searchInput.press("ArrowDown");
    await delay(500);

    // Press Enter to navigate to the selected result
    console.log("⏎  Pressing Enter to navigate...");
    await searchInput.press("Enter");

    // Wait for navigation to property page
    await page
      .waitForNavigation({
        waitUntil: "domcontentloaded",
        timeout: 30000,
      })
      .catch(() => {
        console.log("ℹ️  No navigation occurred after Enter");
      });

    await delay(1000);

    // Check if we navigated to a search results page or property page
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    if (currentUrl.includes("/property/")) {
      // We're on a property page! Wait for "Property Insights" text to appear
      console.log("✅ On property page, waiting for content to load...");

      try {
        await page.waitForFunction(
          () => document.body.textContent?.includes("Property Insights"),
          { timeout: 15000 }
        );
        console.log("✅ Property Insights found - page fully loaded");
      } catch (err) {
        console.log("⚠️  Property Insights not found, but continuing anyway");
      }

      return;
    }

    // Try to find and click a property result
    try {
      // Try different selectors for search results
      const resultSelectors = [
        'a[href*="/property/"]',
        ".property-result a",
        ".search-result a",
        '[class*="result"] a[href*="/property/"]',
        '[class*="search"] a[href*="/property/"]',
      ];

      let clicked = false;
      for (const selector of resultSelectors) {
        try {
          const links = await page.$$(selector);
          if (links.length > 0) {
            console.log(
              `✅ Found ${links.length} result(s) with selector: ${selector}`
            );
            console.log("🖱️  Clicking first result...");
            await links[0].click();

            // Wait for navigation
            await page
              .waitForNavigation({
                waitUntil: "domcontentloaded",
                timeout: 30000,
              })
              .catch(() => {
                console.log(
                  "ℹ️  No navigation occurred (might already be on page)"
                );
              });

            await delay(2000);
            clicked = true;
            break;
          }
        } catch (err) {
          // Continue to next selector
        }
      }

      if (!clicked) {
        console.warn("⚠️  Could not find property results to click");
      }

      const finalUrl = page.url();
      console.log(`📍 Final URL: ${finalUrl}`);
    } catch (err) {
      console.error("❌ Error finding/clicking search results:", err);
      console.log(`📍 Staying on current page: ${page.url()}`);
    }
  } catch (error) {
    console.error("❌ Error in searchAndNavigate:", error);
    throw error;
  }
}
