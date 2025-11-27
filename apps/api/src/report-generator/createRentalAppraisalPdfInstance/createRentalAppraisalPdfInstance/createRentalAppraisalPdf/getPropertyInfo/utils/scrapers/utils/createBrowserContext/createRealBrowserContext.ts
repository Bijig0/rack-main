import { connect } from "puppeteer-real-browser";

type Return = {
  page: any;
  browser: any;
};

const createRealBrowserContext = async (): Promise<Return> => {
  console.log("🚀 Launching real browser with advanced anti-detection...");

  const { browser, page } = await connect({
    headless: true,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
    customConfig: {},
    turnstile: true,
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  console.log("✅ Real browser launched successfully");

  return { page, browser };
};

export { createRealBrowserContext };
