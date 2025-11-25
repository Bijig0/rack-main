import {
  extractText,
  parsePropertyPageHtml,
} from "../../utils/parsePropertyPageHtml";

type Return = {
  appraisalSummaryText: string | null;
};

/**
 * Parses the appraisal summary from propertyPage.html
 *
 * The HTML structure is:
 * <p class="m-t-10 m-b-10">The size of Kew is approximately...</p>
 *
 * @returns Appraisal summary text or null if not found
 */
export async function parseAppraisalSummary(): Promise<Return> {
  const $ = await parsePropertyPageHtml();

  // Find paragraph that starts with "The size of"
  const paragraphs = $("p.m-t-10.m-b-10");

  for (let i = 0; i < paragraphs.length; i++) {
    const text = $(paragraphs[i]).text().trim();
    if (text.startsWith("The size of")) {
      console.log(
        `Found appraisal summary text: "${text.substring(0, 50)}..." using paragraph filter`
      );
      return { appraisalSummaryText: text };
    }
  }

  console.warn("⚠️  Could not find appraisal summary in HTML");
  return { appraisalSummaryText: null };
}
