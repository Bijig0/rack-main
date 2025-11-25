import { type Page } from "playwright";

type Args = {
  page: Page;
  email: string;
};

const firstLogin = async ({ page, email }: Args) => {
  console.log("📧 Entering email...");
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', email);
  await page.click("#logIn");
};

export default firstLogin;
