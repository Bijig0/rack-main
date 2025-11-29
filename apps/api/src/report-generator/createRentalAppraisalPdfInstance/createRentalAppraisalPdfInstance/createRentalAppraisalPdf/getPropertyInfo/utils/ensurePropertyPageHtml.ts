import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const PROPERTY_PAGE_HTML_PATH = path.join(
  __dirname,
  "propertyPage.html"
);

const SCRAPER_SCRIPT_PATH = path.join(
  __dirname,
  "selenium-login.ts"
);

/**
 * Ensures that propertyPage.html exists.
 * If it doesn't exist, runs the selenium-login.ts script to scrape and create it.
 *
 * @returns The absolute path to propertyPage.html
 */
export async function ensurePropertyPageHtml(): Promise<string> {
  // Check if propertyPage.html already exists
  if (fs.existsSync(PROPERTY_PAGE_HTML_PATH)) {
    console.log("✓ propertyPage.html already exists");
    return PROPERTY_PAGE_HTML_PATH;
  }

  console.log("⚠️  propertyPage.html not found. Running scraper...");

  try {
    // Run the selenium-login script to create propertyPage.html
    execSync(`bun run ${SCRAPER_SCRIPT_PATH}`, {
      cwd: path.dirname(SCRAPER_SCRIPT_PATH),
      stdio: "inherit", // Show output from the scraper
    });

    // Verify the file was created
    if (!fs.existsSync(PROPERTY_PAGE_HTML_PATH)) {
      throw new Error(
        "Scraper completed but propertyPage.html was not created"
      );
    }

    console.log("✅ propertyPage.html created successfully");
    return PROPERTY_PAGE_HTML_PATH;
  } catch (error) {
    throw new Error(
      `Failed to create propertyPage.html: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Gets the path to propertyPage.html without ensuring it exists
 * Useful for checking or cleaning up
 */
export function getPropertyPageHtmlPath(): string {
  return PROPERTY_PAGE_HTML_PATH;
}

/**
 * Checks if propertyPage.html exists
 */
export function propertyPageHtmlExists(): boolean {
  return fs.existsSync(PROPERTY_PAGE_HTML_PATH);
}

/**
 * Deletes propertyPage.html if it exists
 * Useful for forcing a fresh scrape
 */
export function deletePropertyPageHtml(): void {
  if (fs.existsSync(PROPERTY_PAGE_HTML_PATH)) {
    fs.unlinkSync(PROPERTY_PAGE_HTML_PATH);
    console.log("🗑️  Deleted propertyPage.html");
  }
}
