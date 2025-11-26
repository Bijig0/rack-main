import { type Page } from "playwright";

type Args = {
  addressToSearch: string;
  page: Page;
};

async function fillSearchElements({ addressToSearch, page }: Args) {
  // 1. Fill the input element
  const inputSelector =
    'input[aria-activedescendant^="react-select"][role="combobox"]';

  // Wait for the input to be visible
  await page.waitForSelector(inputSelector, { timeout: 15000 });

  // Fill the input using Playwright's fill method
  await page.fill(inputSelector, addressToSearch);

  // Also set the value attribute using evaluate
  // FIXED: Pass addressToSearch as a parameter
  await page.evaluate((searchValue) => {
    const input = document.querySelector(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    ) as HTMLInputElement;
    if (input) {
      input.setAttribute("value", searchValue);
    }
  }, addressToSearch); // Pass the variable here

  // 2. Fill the hidden div's text content
  // FIXED: Pass addressToSearch as a parameter
  await page.evaluate((searchValue) => {
    const div = document.querySelector(
      'div[style*="position: absolute"][style*="visibility: hidden"][style*="height: 0px"]'
    ) as HTMLDivElement;
    if (div) {
      div.textContent = searchValue;
    }
  }, addressToSearch); // Pass the variable here

  console.log(`✅ Filled both elements with '${addressToSearch}'`);
}

export default fillSearchElements;
