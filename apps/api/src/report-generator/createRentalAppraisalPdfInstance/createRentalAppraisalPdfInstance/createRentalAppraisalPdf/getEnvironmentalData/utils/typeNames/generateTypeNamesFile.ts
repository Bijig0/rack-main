import fs from "fs";

import { fetchTypeNames } from "./fetchTypeNames";
import path from "path";

const OUTPUT_TS = path.join(__dirname, "typeNames.generated.ts");

/**
 * Generates a TypeScript file with Zod schema and literal union for typeNames
 */
export function generateTypeNamesFile(typeNames: string[]) {
  if (typeNames.length === 0) {
    throw new Error("No typeNames provided, cannot generate TypeScript file.");
  }

  const content = `
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
import { z } from "zod";

export const typeNamesSchema = z.enum(${JSON.stringify(typeNames)});

export type TypeName = z.infer<typeof typeNamesSchema>;
`;

  fs.writeFileSync(OUTPUT_TS, content);
  console.log(`Generated TypeScript file at ${OUTPUT_TS}`);
}

// Example usage
(async () => {
  const typeNames = await fetchTypeNames();
  generateTypeNamesFile(typeNames);
})();
