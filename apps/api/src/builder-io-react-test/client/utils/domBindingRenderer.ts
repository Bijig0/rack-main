/**
 * Utility functions for rendering DOM bindings to actual PDF content
 * Use these functions to apply the configured DOM bindings to your PDF template
 */

import {
  DomBindingMapping,
  StyleCondition,
  StyleConditionOperator,
} from "@/types/domBinding";

/**
 * Get a value from a data object using a path string
 * @example getValueFromPath(data, "state.propertyInfo.yearBuilt.value") => 1985
 */
export function getValueFromPath(data: any, path: string): any {
  const parts = path.split(".");
  let current = data;

  for (const part of parts) {
    // Handle array access like "items[0]"
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current = current?.[arrayName]?.[parseInt(index)];
    } else {
      current = current?.[part];
    }

    if (current === undefined || current === null) {
      return null;
    }
  }

  return current;
}

/**
 * Set a value in a data object using a path string
 */
export function setValueAtPath(data: any, path: string, value: any): void {
  const parts = path.split(".");
  let current = data;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const arrayMatch = part.match(/^(.+)\[(\d+)\]$/);

    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current = current[arrayName][parseInt(index)];
    } else {
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Evaluate a condition
 */
function evaluateCondition(
  value: any,
  operator: StyleConditionOperator,
  compareValue: any
): boolean {
  switch (operator) {
    case "equals":
      return value == compareValue; // Loose equality for string/number comparison
    case "notEquals":
      return value != compareValue;
    case "greaterThan":
      return Number(value) > Number(compareValue);
    case "lessThan":
      return Number(value) < Number(compareValue);
    case "greaterThanOrEqual":
      return Number(value) >= Number(compareValue);
    case "lessThanOrEqual":
      return Number(value) <= Number(compareValue);
    case "contains":
      return String(value).includes(String(compareValue));
    case "notContains":
      return !String(value).includes(String(compareValue));
    default:
      return false;
  }
}

/**
 * Apply conditional styles to an element
 */
function applyConditionalStyles(
  element: HTMLElement,
  binding: DomBindingMapping,
  data: any
): void {
  if (!binding.conditionalStyles || binding.conditionalStyles.length === 0) {
    return;
  }

  binding.conditionalStyles.forEach((styleRule) => {
    const watchValue = getValueFromPath(data, styleRule.dependsOn);

    styleRule.conditions.forEach((condition) => {
      if (evaluateCondition(watchValue, condition.operator, condition.value)) {
        Object.assign(element.style, condition.cssProperties);
      }
    });
  });
}

/**
 * Format a value for display
 */
function formatValue(value: any, dataType: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (dataType === "number") {
    return Number(value).toLocaleString();
  }

  if (dataType === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Render a single binding to the DOM
 */
export function renderBinding(
  binding: DomBindingMapping,
  data: any,
  containerElement: HTMLElement | Document = document
): boolean {
  try {
    const element = containerElement.querySelector(
      binding.path
    ) as HTMLElement;

    if (!element) {
      console.warn(`Element not found for path: ${binding.path}`);
      return false;
    }

    if (binding.isListContainer && binding.listItemPattern) {
      // Handle list/array rendering
      const arrayData = getValueFromPath(data, binding.dataBinding);

      if (!Array.isArray(arrayData)) {
        console.warn(
          `Expected array for binding ${binding.dataBinding}, got:`,
          typeof arrayData
        );
        return false;
      }

      // Find the item template
      const itemTemplate = element.querySelector(
        binding.listItemPattern
      ) as HTMLElement;

      if (!itemTemplate) {
        console.warn(
          `Item template not found: ${binding.listItemPattern} within ${binding.path}`
        );
        return false;
      }

      // Clear container (except template)
      const templateClone = itemTemplate.cloneNode(true) as HTMLElement;
      element.innerHTML = "";

      // Render each item
      arrayData.forEach((item, index) => {
        const itemElement = templateClone.cloneNode(true) as HTMLElement;

        // Replace [0] or [i] in the binding path with the actual index
        const itemBinding = {
          ...binding,
          dataBinding: binding.dataBinding.replace(/\[\d+\]|\[i\]/, `[${index}]`),
        };

        // Find all text nodes and bindings within the item
        // This is a simple implementation - you might need more sophisticated template rendering
        const itemData = item;

        // Apply item data to the element (simple text replacement)
        if (typeof itemData === "string" || typeof itemData === "number") {
          itemElement.textContent = formatValue(itemData, binding.dataType);
        }

        // Apply conditional styles
        applyConditionalStyles(itemElement, itemBinding, data);

        element.appendChild(itemElement);
      });
    } else {
      // Handle simple value binding
      const value = getValueFromPath(data, binding.dataBinding);
      const formattedValue = formatValue(value, binding.dataType);

      // Set element content based on type
      if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox") {
          element.checked = Boolean(value);
        } else {
          element.value = formattedValue;
        }
      } else if (element instanceof HTMLTextAreaElement) {
        element.value = formattedValue;
      } else if (element instanceof HTMLImageElement && typeof value === "string") {
        element.src = value;
      } else {
        element.textContent = formattedValue;
      }

      // Apply conditional styles
      applyConditionalStyles(element, binding, data);
    }

    return true;
  } catch (error) {
    console.error(`Error rendering binding ${binding.dataBinding}:`, error);
    return false;
  }
}

/**
 * Render all bindings to the DOM
 */
export function renderAllBindings(
  bindings: DomBindingMapping[],
  data: any,
  containerElement: HTMLElement | Document = document
): { success: number; failed: number } {
  let success = 0;
  let failed = 0;

  bindings.forEach((binding) => {
    if (renderBinding(binding, data, containerElement)) {
      success++;
    } else {
      failed++;
    }
  });

  return { success, failed };
}

/**
 * Extract bindings for a specific data path prefix
 * Useful for rendering sections of a document
 */
export function getBindingsForPath(
  bindings: DomBindingMapping[],
  pathPrefix: string
): DomBindingMapping[] {
  return bindings.filter((b) => b.dataBinding.startsWith(pathPrefix));
}

/**
 * Validate that all bindings can find their target elements
 */
export function validateBindings(
  bindings: DomBindingMapping[],
  containerElement: HTMLElement | Document = document
): {
  valid: DomBindingMapping[];
  invalid: Array<{ binding: DomBindingMapping; reason: string }>;
} {
  const valid: DomBindingMapping[] = [];
  const invalid: Array<{ binding: DomBindingMapping; reason: string }> = [];

  bindings.forEach((binding) => {
    const element = containerElement.querySelector(binding.path);

    if (!element) {
      invalid.push({
        binding,
        reason: "Element not found in DOM",
      });
    } else if (binding.isListContainer && !binding.listItemPattern) {
      invalid.push({
        binding,
        reason: "List container missing item pattern",
      });
    } else if (
      binding.isListContainer &&
      !element.querySelector(binding.listItemPattern!)
    ) {
      invalid.push({
        binding,
        reason: "Item template not found within container",
      });
    } else {
      valid.push(binding);
    }
  });

  return { valid, invalid };
}
