// authentication/authenticateCoreLogic.ts
import { Page } from "playwright";
import firstLogin from "./firstLogin/firstLogin";
import secondLogin from "./secondLogin/secondLogin";

interface AuthParams {
  page: Page;
  email: string;
  username: string;
  password: string;
}

export async function authenticateCoreLogic({
  page,
  email,
  username,
  password,
}: AuthParams): Promise<void> {
  console.log("📧 First login...");
  await firstLogin({ page, email });

  console.log("🔐 Second login...");
  await secondLogin({ page, username, password });
}
