import { type Page } from "playwright";

type Args = {
  page: Page;
  username: string;
  password: string;
};

const secondLogin = async ({ page, username, password }: Args) => {
  console.log("🔐 Logging in...");
  await page.waitForSelector("#username", { timeout: 10000 });
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click("#signOnButton");
};

export default secondLogin;
