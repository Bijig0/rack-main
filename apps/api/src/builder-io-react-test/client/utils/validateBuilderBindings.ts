import { JsonSchema } from "@/hooks/useGetRentalAppraisalSchema";

/**
 * Extract binding paths from Builder.io content
 * Finds patterns like {{state.propertyInfo.yearBuilt}}
 */
export function extractBindingPaths(content: any): string[] {
  const bindings = new Set<string>();

  function traverse(obj: any) {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === "string") {
        // Match {{state.xxx}} or {{state.xxx.yyy}} patterns
        const bindingRegex = /\{\{(state\.[^}]+)\}\}/g;
        let match: RegExpExecArray | null;
        while ((match = bindingRegex.exec(value)) !== null) {
          bindings.add(match[1]);
        }
      }

      if (typeof value === "object") {
        traverse(value);
      }
    }
  }

  traverse(content);
  return Array.from(bindings);
}

/**
 * Get the expected type for a binding path from JSON Schema
 * @param bindingPath - e.g., "state.propertyInfo.yearBuilt"
 * @param schema - The JSON Schema to validate against
 * @returns Object with type info and validation status
 */
export function getBindingTypeInfo(
  bindingPath: string,
  schema: JsonSchema
): {
  exists: boolean;
  type?: string;
  isNullable?: boolean;
  schema?: JsonSchema;
  error?: string;
} {
  // Remove "state." prefix
  const path = bindingPath.replace(/^state\./, "");
  const parts = path.split(".");

  let currentSchema = schema;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Handle array access like "nearbySchools[0]"
    const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName] = arrayMatch;

      // Navigate to array property
      if (!currentSchema.properties?.[arrayName]) {
        return {
          exists: false,
          error: `Property '${arrayName}' not found in schema`,
        };
      }

      currentSchema = currentSchema.properties[arrayName];

      // Check if it's an array type
      if (currentSchema.type !== "array" && !currentSchema.items) {
        return {
          exists: false,
          error: `Property '${arrayName}' is not an array`,
        };
      }

      // Move to array items schema
      if (currentSchema.items) {
        currentSchema = currentSchema.items;
      }
    } else {
      // Regular property access
      if (!currentSchema.properties?.[part]) {
        return {
          exists: false,
          error: `Property '${part}' not found in schema at path '${parts
            .slice(0, i + 1)
            .join(".")}'`,
        };
      }

      currentSchema = currentSchema.properties[part];
    }
  }

  return {
    exists: true,
    type: currentSchema.type,
    isNullable: currentSchema.nullable || false,
    schema: currentSchema,
  };
}

/**
 * Validate a single binding value against the expected type
 */
export function validateBindingValue(
  bindingPath: string,
  value: any,
  schema: JsonSchema
): {
  valid: boolean;
  expectedType?: string;
  actualType?: string;
  error?: string;
} {
  const typeInfo = getBindingTypeInfo(bindingPath, schema);

  if (!typeInfo.exists) {
    return {
      valid: false,
      error: typeInfo.error,
    };
  }

  // Handle nullable values
  if (value === null || value === undefined) {
    if (typeInfo.isNullable) {
      return { valid: true, expectedType: typeInfo.type };
    }
    return {
      valid: false,
      expectedType: typeInfo.type,
      actualType: value === null ? "null" : "undefined",
      error: "Value is null/undefined but schema requires a value",
    };
  }

  const actualType = Array.isArray(value) ? "array" : typeof value;
  const expectedType = typeInfo.type;

  // Type checking
  if (expectedType === "integer" || expectedType === "number") {
    if (typeof value !== "number") {
      return {
        valid: false,
        expectedType,
        actualType,
        error: `Expected ${expectedType}, got ${actualType}`,
      };
    }
    if (expectedType === "integer" && !Number.isInteger(value)) {
      return {
        valid: false,
        expectedType,
        actualType: "number (non-integer)",
        error: "Expected integer, got non-integer number",
      };
    }
  } else if (expectedType !== actualType) {
    return {
      valid: false,
      expectedType,
      actualType,
      error: `Expected ${expectedType}, got ${actualType}`,
    };
  }

  return {
    valid: true,
    expectedType,
    actualType,
  };
}

/**
 * Validate all bindings in Builder.io content against actual data
 */
export function validateAllBindings(
  builderContent: any,
  data: any,
  schema: JsonSchema
): {
  bindingPath: string;
  valid: boolean;
  expectedType?: string;
  actualType?: string;
  error?: string;
}[] {
  const bindings = extractBindingPaths(builderContent);
  const results = [];

  for (const bindingPath of bindings) {
    // Get actual value from data
    const path = bindingPath.replace(/^state\./, "");
    const value = getValueByPath(data, path);

    const validation = validateBindingValue(bindingPath, value, schema);
    results.push({
      bindingPath,
      ...validation,
    });
  }

  return results;
}

/**
 * Helper to get value from nested object by path string
 */
function getValueByPath(obj: any, path: string): any {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    // Handle array access
    const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current = current?.[arrayName]?.[parseInt(index)];
    } else {
      current = current?.[part];
    }

    if (current === undefined) {
      return undefined;
    }
  }

  return current;
}
