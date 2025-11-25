import * as path from "path";

/**
 * Resolve a path relative to the current working directory.
 *
 * @example
 * getPathFromCwd("output", "file.html")
 * // => /Users/.../your-project/output/file.html
 */
export const getPathFromCwd = (...segments: string[]): string => {
  return path.join(process.cwd(), ...segments);
};
