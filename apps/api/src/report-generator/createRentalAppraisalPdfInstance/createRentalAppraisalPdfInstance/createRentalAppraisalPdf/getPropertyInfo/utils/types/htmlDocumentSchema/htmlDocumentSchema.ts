import { HtmlValidate } from "html-validate";
import z from "zod";
const validator = new HtmlValidate();

export const htmlDocumentSchema = z.string().refine(
  async (value) => {
    const report = await validator.validateString(value);
    return report.valid;
  },
  {
    message: "Must be valid HTML",
  }
);

export type HtmlDocumentSchema = z.infer<typeof htmlDocumentSchema>;

if (import.meta.main) {
  (async () => {
    console.log("Testing htmlDocumentSchema...\n");

    const testCases = [
      {
        name: "Valid simple HTML",
        html: "<div><p>Hello</p></div>",
      },
      {
        name: "Valid nested HTML",
        html: "<div><ul><li>Item 1</li><li>Item 2</li></ul></div>",
      },
      {
        name: "Invalid HTML - unclosed tag",
        html: "<div><p>Hello</div>",
      },
      {
        name: "Invalid HTML - malformed tag",
        html: "<div><p>Hello<//p></div>",
      },
      {
        name: "Empty string",
        html: "",
      },
    ];

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);
      const result = await htmlDocumentSchema.safeParseAsync(testCase.html);

      if (result.success) {
        console.log("✓ Valid HTML");
      } else {
        console.log("✗ Invalid HTML");
        console.log(
          "  Errors:",
          result.error.issues.map((i) => i.message).join(", ")
        );
      }
      console.log("");
    }

    console.log("\nDone!");
  })();
}
