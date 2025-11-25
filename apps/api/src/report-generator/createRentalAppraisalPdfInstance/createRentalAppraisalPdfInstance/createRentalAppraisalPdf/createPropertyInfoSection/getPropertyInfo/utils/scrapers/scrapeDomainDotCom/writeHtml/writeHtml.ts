import * as fs from "fs";
import * as path from "path";
import { HtmlDocumentSchema } from "../../../createReportCache";

type Args = {
  outputPath: string; // directory or absolute path
  html: HtmlDocumentSchema;
  fileName: string;
};

const writeHtml = ({ outputPath, html, fileName }: Args): void => {
  // Ensure directory exists
  fs.mkdirSync(outputPath, { recursive: true });

  // Construct full path to the file
  const fullOutputPath = path.join(outputPath, fileName);

  // Write the file
  fs.writeFileSync(fullOutputPath, html, "utf-8");

  console.log(`💾 Saved HTML to ${fullOutputPath}`);
};

export { writeHtml };
