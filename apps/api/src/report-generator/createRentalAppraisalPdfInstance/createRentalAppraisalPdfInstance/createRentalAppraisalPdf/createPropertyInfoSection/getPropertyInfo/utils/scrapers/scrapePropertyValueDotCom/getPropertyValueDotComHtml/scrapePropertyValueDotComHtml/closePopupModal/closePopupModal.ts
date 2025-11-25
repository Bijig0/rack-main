/**
 * Closes any popup modals on propertyvalue.com.au
 * Using Puppeteer API (compatible with puppeteer-real-browser)
 */
export async function closePopupModal(page: any): Promise<void> {
  try {
    console.log("⏳ Checking for popup modals...");

    // Puppeteer-compatible delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    const result = await page.evaluate(() => {
      // Find and close all modal-like elements
      const modals = Array.from(
        document.querySelectorAll(
          '[class*="modal"], [class*="popup"], [class*="overlay"], [id*="modal"], [id*="popup"]'
        )
      );

      modals.forEach((modal) => {
        const htmlEl = modal as HTMLElement;
        htmlEl.style.display = "none";
        htmlEl.style.visibility = "hidden";
        htmlEl.remove();
      });

      return { modalsClosed: modals.length };
    });

    if (result.modalsClosed > 0) {
      console.log(`✅ Closed ${result.modalsClosed} modal(s)`);
    }
  } catch (err) {
    console.log("ℹ️  No modals detected");
  }
}
