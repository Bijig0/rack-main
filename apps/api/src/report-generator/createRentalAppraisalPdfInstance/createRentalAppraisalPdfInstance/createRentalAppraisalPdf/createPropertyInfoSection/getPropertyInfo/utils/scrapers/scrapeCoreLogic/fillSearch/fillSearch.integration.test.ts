import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
//   @ts-ignore
} from "bun:test";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";
import fillSearchElements from "./fillSearch";

describe("fillSearchElements", () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();

    // Create a test page with the React Select structure
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head><title>Test Page</title></head>
        <body>
          <input 
            aria-activedescendant="react-select-2--value" 
            role="combobox"
            value=""
          />
          <div style="position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px;"></div>
        </body>
      </html>
    `);
  });

  afterEach(async () => {
    await context.close();
  });

  test("should fill the input element with the provided address", async () => {
    const address = "7 English Place Kew VIC 3101";

    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe(address);
  });

  test("should set the value attribute on the input", async () => {
    const address = "123 Test Street";

    await fillSearchElements({ addressToSearch: address, page });

    const valueAttr = await page.getAttribute(
      'input[aria-activedescendant^="react-select"][role="combobox"]',
      "value"
    );

    expect(valueAttr).toBe(address);
  });

  test("should fill the hidden div with the address text", async () => {
    const address = "456 Sample Ave";

    await fillSearchElements({ addressToSearch: address, page });

    const divText = await page.evaluate(() => {
      const div = document.querySelector(
        'div[style*="position: absolute"][style*="visibility: hidden"]'
      ) as HTMLDivElement;
      return div?.textContent || "";
    });

    expect(divText).toBe(address);
  });

  test("should handle empty string address", async () => {
    const address = "";

    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe("");
  });

  test("should handle special characters in address", async () => {
    const address = "Unit 5/10 O'Brien St, St Kilda VIC 3182";

    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe(address);
  });

  test("should wait for input selector to be present", async () => {
    // Create page without the input initially
    await page.setContent(`<html><body></body></html>`);

    // Add input after a delay
    setTimeout(async () => {
      await page.evaluate(() => {
        const input = document.createElement("input");
        input.setAttribute("aria-activedescendant", "react-select-2--value");
        input.setAttribute("role", "combobox");
        document.body.appendChild(input);

        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.height = "0px";
        document.body.appendChild(div);
      });
    }, 500);

    const address = "Test Address";
    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe(address);
  });

  test(
    "should timeout if input selector not found",
    async () => {
      // Page without the required input
      await page.setContent(`<html><body><input type="text" /></body></html>`);

      const address = "Test";

      // Expect it to throw an error
      await expect(
        fillSearchElements({ addressToSearch: address, page })
      ).rejects.toThrow();
    },
    { timeout: 20000 }
  ); // FIXED: Increase timeout to 20 seconds

  test("should handle very long addresses", async () => {
    const address =
      "Unit 123/456 Very Long Street Name With Multiple Words Suburb State 1234";

    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe(address);
  });

  test("should handle unicode characters", async () => {
    const address = "123 Café Street, Zürich 🏠";

    await fillSearchElements({ addressToSearch: address, page });

    const inputValue = await page.inputValue(
      'input[aria-activedescendant^="react-select"][role="combobox"]'
    );

    expect(inputValue).toBe(address);
  });
});
