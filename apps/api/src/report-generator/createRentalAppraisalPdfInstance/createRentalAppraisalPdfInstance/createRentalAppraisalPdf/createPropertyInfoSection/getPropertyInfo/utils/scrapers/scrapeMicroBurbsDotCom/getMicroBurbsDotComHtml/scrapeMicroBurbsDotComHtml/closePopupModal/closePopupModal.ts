import { Page } from "playwright";

/**
 * Closes the MicroBurbs popup modal by clicking "Stay on Free Version" button
 * Waits for the button to appear and clicks it to dismiss the modal
 */
export async function closePopupModal(page: Page): Promise<void> {
  try {
    console.log("⏳ Waiting for popup modal...");

    // Wait a bit for the page to fully load and the modal to appear
    await page.waitForTimeout(3000);

    // Search for modal and button with various selectors
    const result = await page.evaluate(() => {
      // Search for elements containing "Stay on Free Version" or similar text
      const allElements = Array.from(document.querySelectorAll('a, button, span, div'));
      const freeVersionElements = allElements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('free') ||
               text.includes('stay') ||
               text.includes('close') ||
               text.includes('skip') ||
               text.includes('no thanks');
      });

      // Search for elements that might be modals (overlays, popups, etc.)
      const possibleModals = Array.from(document.querySelectorAll('[class*="modal"], [class*="overlay"], [class*="popup"], [id*="modal"], [id*="overlay"], [id*="popup"]'));

      // Log what we found
      const foundElements = {
        freeVersionElements: freeVersionElements.slice(0, 10).map(el => ({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          text: el.textContent?.trim().substring(0, 100),
        })),
        possibleModals: possibleModals.map(el => ({
          tag: el.tagName,
          id: el.id,
          className: el.className,
        })),
      };

      // Find the payment modal specifically
      const paymentModal = document.getElementById('payment-modal');
      const closeButton = document.getElementById('close-payment-modal');

      // Find and remove backdrops/overlays
      const backdrops = Array.from(document.querySelectorAll('[class*="backdrop"], [class*="overlay"], [class*="modal-backdrop"], [style*="z-index"]'));

      // Click the close button first
      if (closeButton) {
        closeButton.click();
      }

      // Close the payment modal
      if (paymentModal) {
        (paymentModal as HTMLElement).style.display = 'none';
        (paymentModal as HTMLElement).style.visibility = 'hidden';
        (paymentModal as HTMLElement).style.opacity = '0';
        paymentModal.remove(); // Remove it completely from DOM
      }

      // Remove all backdrops and overlays
      backdrops.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = 'none';
        htmlEl.style.visibility = 'hidden';
        htmlEl.remove();
      });

      // Also close any other modals as fallback
      possibleModals.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = 'none';
        htmlEl.style.visibility = 'hidden';
        htmlEl.remove();
      });

      // Check if there are any iframes and try to close modals within them
      const iframes = Array.from(document.querySelectorAll('iframe'));
      iframes.forEach(iframe => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Try to remove modals from iframe
            const iframeModals = iframeDoc.querySelectorAll('[id*="modal"], [class*="modal"]');
            iframeModals.forEach(modal => {
              (modal as HTMLElement).remove();
            });
          }
        } catch (e) {
          // Cross-origin iframe, can't access
        }
      });

      return {
        foundElements,
        paymentModalFound: paymentModal !== null,
        closeButtonFound: closeButton !== null,
        paymentModalRemoved: paymentModal !== null,
        backdropsRemoved: backdrops.length,
        iframesChecked: iframes.length,
      };
    });

    console.log("🔍 Search result:", JSON.stringify(result, null, 2));

    if (result.paymentModalRemoved) {
      console.log("✅ Payment modal removed from DOM");
      await page.waitForTimeout(1000);
    } else {
      console.log("ℹ️  No payment modal found to close");
    }
  } catch (err) {
    console.log("ℹ️  No popup modal detected (or already closed)");
    console.log(`   Error: ${err instanceof Error ? err.message : String(err)}`);
  }
}
