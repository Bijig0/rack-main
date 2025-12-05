/**
 * Utility functions for rendering DOM bindings to actual PDF content
 * Use these functions to apply the configured DOM bindings to your PDF template
 */

import {
  DomBindingMapping,
  StyleCondition,
  StyleConditionOperator,
  ConditionalStyle,
  ConditionalAttribute,
  applyTemplate,
  applyMultiFieldTemplate,
} from "@/types/domBinding";

/**
 * Find an element for a binding - supports both bindingId (new) and CSS path (legacy)
 * @param binding The binding configuration
 * @param containerElement The container to search within
 * @returns The found element or null
 */
export function findElementForBinding(
  binding: DomBindingMapping,
  containerElement: HTMLElement | Document = document
): HTMLElement | null {
  // Prefer bindingId if available (new approach with BindableText/BindableList components)
  if (binding.bindingId) {
    const element = containerElement.querySelector(
      `[data-binding-id="${binding.bindingId}"]`
    ) as HTMLElement;
    if (element) {
      return element;
    }
    console.warn(`Element not found for bindingId: ${binding.bindingId}`);
  }

  // Fall back to CSS path selector (legacy approach)
  if (binding.path) {
    try {
      const element = containerElement.querySelector(binding.path) as HTMLElement;
      if (element) {
        return element;
      }
      console.warn(`Element not found for path: ${binding.path}`);
    } catch (err) {
      console.error(`Invalid CSS selector: ${binding.path}`, err);
    }
  }

  return null;
}

/**
 * Find all bindable elements of a specific type in the document
 * @param type The bindable type ("text", "list", "image")
 * @param containerElement The container to search within
 * @returns Array of found elements
 */
export function findBindableElements(
  type: "text" | "list" | "image" | "all",
  containerElement: HTMLElement | Document = document
): HTMLElement[] {
  const selector = type === "all"
    ? "[data-bindable]"
    : `[data-bindable="${type}"]`;

  return Array.from(containerElement.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Get binding info from a bindable element
 * @param element The element to get info from
 * @returns Object with bindingId and type, or null if not bindable
 */
export function getBindableInfo(element: HTMLElement): {
  bindingId: string;
  type: "text" | "list" | "image";
} | null {
  const bindingId = element.getAttribute("data-binding-id");
  const type = element.getAttribute("data-bindable") as "text" | "list" | "image";

  if (!bindingId || !type) {
    return null;
  }

  return { bindingId, type };
}

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
 * Transform conditional style paths for a specific list item index.
 * Replaces [0] or [i] with the actual index in dependsOn paths that belong to the same list.
 *
 * @param conditionalStyles Original conditional styles from the binding
 * @param index Current item index
 * @param listDataBinding The data binding path of the list (e.g., "state.schools[0]")
 * @returns New conditional styles array with transformed paths
 */
function transformConditionalStylesForListItem(
  conditionalStyles: ConditionalStyle[] | undefined,
  index: number,
  listDataBinding: string
): ConditionalStyle[] | undefined {
  if (!conditionalStyles?.length) return conditionalStyles;

  // Extract base path (e.g., "state.schools" from "state.schools[0]")
  const basePathMatch = listDataBinding.match(/^(.+?)\[\d+\]/);
  const basePath = basePathMatch ? basePathMatch[1] : listDataBinding;

  return conditionalStyles.map((style) => {
    // Only transform paths within the same list
    if (style.dependsOn.startsWith(basePath + '[')) {
      return {
        ...style,
        dependsOn: style.dependsOn.replace(/\[\d+\]|\[i\]/, `[${index}]`),
      };
    }
    return style; // External paths unchanged
  });
}

/**
 * Transform conditional attribute paths for a specific list item index.
 * Similar to transformConditionalStylesForListItem but for attributes.
 */
function transformConditionalAttributesForListItem(
  conditionalAttributes: ConditionalAttribute[] | undefined,
  index: number,
  listDataBinding: string
): ConditionalAttribute[] | undefined {
  if (!conditionalAttributes?.length) return conditionalAttributes;

  const basePathMatch = listDataBinding.match(/^(.+?)\[\d+\]/);
  const basePath = basePathMatch ? basePathMatch[1] : listDataBinding;

  return conditionalAttributes.map((attr) => {
    if (attr.dependsOn.startsWith(basePath + '[')) {
      return {
        ...attr,
        dependsOn: attr.dependsOn.replace(/\[\d+\]|\[i\]/, `[${index}]`),
      };
    }
    return attr;
  });
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
 * Apply conditional attributes to an element (e.g., icon src based on data)
 */
function applyConditionalAttributes(
  element: HTMLElement,
  binding: DomBindingMapping,
  data: any
): void {
  if (!binding.conditionalAttributes || binding.conditionalAttributes.length === 0) {
    return;
  }

  binding.conditionalAttributes.forEach((attrRule) => {
    const watchValue = getValueFromPath(data, attrRule.dependsOn);

    attrRule.conditions.forEach((condition) => {
      if (evaluateCondition(watchValue, condition.operator, condition.value)) {
        element.setAttribute(attrRule.attribute, condition.attributeValue);
      }
    });
  });
}

/**
 * Format a value for display
 * @param value The value to format
 * @param dataType The data type from schema
 * @param template Optional template string for objects (e.g., "{value} {unit}")
 */
function formatValue(value: any, dataType: string, template?: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  // Handle template formatting for objects
  if (template && typeof value === "object" && !Array.isArray(value)) {
    return applyTemplate(template, value);
  }

  if (dataType === "number" || dataType === "integer") {
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
    const element = findElementForBinding(binding, containerElement);

    if (!element) {
      // Warning already logged by findElementForBinding
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
        // Also transform conditional styles and attributes to use the correct index
        const itemBinding: DomBindingMapping = {
          ...binding,
          dataBinding: binding.dataBinding.replace(/\[\d+\]|\[i\]/, `[${index}]`),
          conditionalStyles: transformConditionalStylesForListItem(
            binding.conditionalStyles,
            index,
            binding.dataBinding
          ),
          conditionalAttributes: transformConditionalAttributesForListItem(
            binding.conditionalAttributes,
            index,
            binding.dataBinding
          ),
        };

        // Find all text nodes and bindings within the item
        // This is a simple implementation - you might need more sophisticated template rendering
        const itemData = item;

        // Apply item data to the element (simple text replacement)
        if (typeof itemData === "string" || typeof itemData === "number") {
          itemElement.textContent = formatValue(itemData, binding.dataType);
        }

        // Apply conditional styles (now with correct item-specific paths)
        applyConditionalStyles(itemElement, itemBinding, data);

        // Apply conditional attributes (e.g., icon src)
        applyConditionalAttributes(itemElement, itemBinding, data);

        element.appendChild(itemElement);
      });
    } else {
      // Handle simple value binding
      let formattedValue: string;

      // Check for multi-field binding
      if (binding.multiFieldBindings && binding.multiFieldBindings.length > 0 && binding.template) {
        // Multi-field binding: resolve multiple paths and apply template
        formattedValue = applyMultiFieldTemplate(
          binding.template,
          binding.multiFieldBindings,
          (path: string) => getValueFromPath(data, path)
        );
      } else {
        // Single field binding
        const value = getValueFromPath(data, binding.dataBinding);
        formattedValue = formatValue(value, binding.dataType, binding.template);
      }

      // Set element content based on type
      if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox") {
          const value = getValueFromPath(data, binding.dataBinding);
          element.checked = Boolean(value);
        } else {
          element.value = formattedValue;
        }
      } else if (element instanceof HTMLTextAreaElement) {
        element.value = formattedValue;
      } else if (element instanceof HTMLImageElement) {
        const value = getValueFromPath(data, binding.dataBinding);
        if (typeof value === "string") {
          element.src = value;
        }
      } else {
        element.textContent = formattedValue;
      }

      // Apply conditional styles
      applyConditionalStyles(element, binding, data);

      // Apply conditional attributes (e.g., icon src)
      applyConditionalAttributes(element, binding, data);
    }

    return true;
  } catch (error) {
    console.error(`Error rendering binding ${binding.dataBinding}:`, error);
    return false;
  }
}

/**
 * Find bindings that are children of a list binding
 * e.g., for list binding "propertyInfo.nearbySchools", find "propertyInfo.nearbySchools[0].name"
 */
function findChildBindingsForList(
  allBindings: DomBindingMapping[],
  listBinding: DomBindingMapping
): DomBindingMapping[] {
  // Match bindings that start with the list path followed by [index]
  // e.g., "propertyInfo.nearbySchools" -> matches "propertyInfo.nearbySchools[0].name"
  const listPath = listBinding.dataBinding;
  const pattern = new RegExp(`^${listPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]`);

  return allBindings.filter(b =>
    b.id !== listBinding.id && // Not the list itself
    pattern.test(b.dataBinding)
  );
}

/**
 * Render a single binding to the DOM, with access to all bindings for list child resolution
 */
export function renderBindingWithContext(
  binding: DomBindingMapping,
  data: any,
  allBindings: DomBindingMapping[],
  containerElement: HTMLElement | Document = document
): boolean {
  try {
    const element = findElementForBinding(binding, containerElement);

    if (!element) {
      // Warning already logged by findElementForBinding
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

      // Find child bindings that belong to this list
      const childBindings = findChildBindingsForList(allBindings, binding);
      console.log(`📋 List ${binding.dataBinding}: found ${childBindings.length} child bindings`,
        childBindings.map(b => b.dataBinding));

      // Clear container (except template)
      const templateClone = itemTemplate.cloneNode(true) as HTMLElement;
      element.innerHTML = "";

      // Render each item
      arrayData.forEach((item, index) => {
        const itemElement = templateClone.cloneNode(true) as HTMLElement;

        // Replace [0] or [i] in the binding path with the actual index
        // Also transform conditional styles and attributes to use the correct index
        const itemBinding: DomBindingMapping = {
          ...binding,
          dataBinding: binding.dataBinding.replace(/\[\d+\]|\[i\]/, `[${index}]`),
          conditionalStyles: transformConditionalStylesForListItem(
            binding.conditionalStyles,
            index,
            binding.dataBinding
          ),
          conditionalAttributes: transformConditionalAttributesForListItem(
            binding.conditionalAttributes,
            index,
            binding.dataBinding
          ),
        };

        // Find all text nodes and bindings within the item
        // This is a simple implementation - you might need more sophisticated template rendering
        const itemData = item;

        // Apply item data to the element (simple text replacement)
        if (typeof itemData === "string" || typeof itemData === "number") {
          itemElement.textContent = formatValue(itemData, binding.dataType);
        }

        // Apply conditional styles (now with correct item-specific paths)
        applyConditionalStyles(itemElement, itemBinding, data);

        // Apply conditional attributes (e.g., icon src)
        applyConditionalAttributes(itemElement, itemBinding, data);

        // Apply child bindings to elements within this list item
        // Transform the child binding paths to use the current index
        childBindings.forEach(childBinding => {
          // Transform the data binding path to use current index
          const transformedDataBinding = childBinding.dataBinding.replace(
            /\[\d+\]/,
            `[${index}]`
          );

          // Transform multi-field bindings paths if present
          const transformedMultiFieldBindings = childBinding.multiFieldBindings?.map(mf => ({
            ...mf,
            path: mf.path.replace(/\[\d+\]/, `[${index}]`)
          }));

          // We need to find the element within itemElement, not the whole document
          // The child binding's path is absolute, we need to make it relative
          // For now, let's try to find it within the item element using a partial match

          // Get the selector part after the list container path
          // e.g., if list container is at "body > div > ul" and child is "body > div > ul > li > span.name"
          // we want to find "li > span.name" or just query the itemElement

          // Simple approach: query within itemElement using the child's listItemPattern-relative selector
          // This requires the child binding path to contain the item pattern
          const listContainerPath = binding.path;
          let relativeSelector = childBinding.path;

          // If the child path starts with the list container path, make it relative
          if (childBinding.path.startsWith(listContainerPath)) {
            relativeSelector = childBinding.path
              .substring(listContainerPath.length)
              .replace(/^\s*>\s*/, '') // Remove leading ">"
              .trim();

            // If the relative selector starts with the list item pattern, remove it
            if (binding.listItemPattern && relativeSelector.startsWith(binding.listItemPattern)) {
              relativeSelector = relativeSelector
                .substring(binding.listItemPattern.length)
                .replace(/^\s*>\s*/, '')
                .trim();
            }
          }

          // Find element within itemElement
          let targetElement: HTMLElement | null = null;
          if (relativeSelector) {
            targetElement = itemElement.querySelector(relativeSelector) as HTMLElement;
          }

          // If we couldn't find it with the relative selector, try the original as a fallback
          // (in case the structure is different)
          if (!targetElement) {
            // Try to find by matching class or tag from the original path
            const lastPart = childBinding.path.split('>').pop()?.trim();
            if (lastPart) {
              targetElement = itemElement.querySelector(lastPart) as HTMLElement;
            }
          }

          if (targetElement) {
            // Apply the binding to this element
            let formattedValue: string;

            if (transformedMultiFieldBindings && transformedMultiFieldBindings.length > 0 && childBinding.template) {
              formattedValue = applyMultiFieldTemplate(
                childBinding.template,
                transformedMultiFieldBindings,
                (path: string) => getValueFromPath(data, path)
              );
            } else {
              const value = getValueFromPath(data, transformedDataBinding);
              formattedValue = formatValue(value, childBinding.dataType, childBinding.template);
            }

            console.log(`📋 Applied child binding ${transformedDataBinding} -> "${formattedValue}" to element in item ${index}`);
            targetElement.textContent = formattedValue;

            // Apply conditional styles for child binding
            if (childBinding.conditionalStyles?.length) {
              const transformedChildBinding: DomBindingMapping = {
                ...childBinding,
                dataBinding: transformedDataBinding,
                conditionalStyles: transformConditionalStylesForListItem(
                  childBinding.conditionalStyles,
                  index,
                  childBinding.dataBinding
                ),
              };
              applyConditionalStyles(targetElement, transformedChildBinding, data);
            }
          } else {
            console.warn(`Could not find element for child binding ${childBinding.dataBinding} within list item ${index}. Tried selectors:`, {
              relativeSelector,
              originalPath: childBinding.path
            });
          }
        });

        element.appendChild(itemElement);
      });
    } else {
      // Handle simple value binding (non-list)
      let formattedValue: string;

      // Check for multi-field binding
      if (binding.multiFieldBindings && binding.multiFieldBindings.length > 0 && binding.template) {
        // Multi-field binding: resolve multiple paths and apply template
        formattedValue = applyMultiFieldTemplate(
          binding.template,
          binding.multiFieldBindings,
          (path: string) => getValueFromPath(data, path)
        );
      } else {
        // Single field binding
        const value = getValueFromPath(data, binding.dataBinding);
        formattedValue = formatValue(value, binding.dataType, binding.template);
      }

      // Set element content based on type
      if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox") {
          const value = getValueFromPath(data, binding.dataBinding);
          element.checked = Boolean(value);
        } else {
          element.value = formattedValue;
        }
      } else if (element instanceof HTMLTextAreaElement) {
        element.value = formattedValue;
      } else if (element instanceof HTMLImageElement) {
        const value = getValueFromPath(data, binding.dataBinding);
        if (typeof value === "string") {
          element.src = value;
        }
      } else {
        element.textContent = formattedValue;
      }

      // Apply conditional styles
      applyConditionalStyles(element, binding, data);

      // Apply conditional attributes (e.g., icon src)
      applyConditionalAttributes(element, binding, data);
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

  // First, render list containers (they need special handling)
  // Then render non-list bindings that are NOT children of lists
  // (List children are handled by the list rendering itself)

  const listBindings = bindings.filter(b => b.isListContainer);
  const listPaths = listBindings.map(b => b.dataBinding);

  // Filter out bindings that are children of list bindings (they'll be handled by list rendering)
  const nonListBindings = bindings.filter(b => {
    if (b.isListContainer) return false;

    // Check if this binding is a child of any list binding
    for (const listPath of listPaths) {
      const pattern = new RegExp(`^${listPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]`);
      if (pattern.test(b.dataBinding)) {
        console.log(`⏭️ Skipping ${b.dataBinding} - handled by list ${listPath}`);
        return false; // Skip, will be handled by list rendering
      }
    }
    return true;
  });

  // Render list bindings first (they handle their children)
  listBindings.forEach((binding) => {
    if (renderBindingWithContext(binding, data, bindings, containerElement)) {
      success++;
    } else {
      failed++;
    }
  });

  // Render remaining non-list bindings
  nonListBindings.forEach((binding) => {
    if (renderBindingWithContext(binding, data, bindings, containerElement)) {
      success++;
    } else {
      failed++;
    }
  });

  return { success, failed };
}

/**
 * Result of rendering a single binding
 */
export interface BindingRenderResult {
  binding: DomBindingMapping;
  success: boolean;
  error?: string;
  elementFound: boolean;
  renderedValue?: string;
}

/**
 * Render all bindings to the DOM with detailed results for each binding
 */
export function renderAllBindingsWithDetails(
  bindings: DomBindingMapping[],
  data: any,
  containerElement: HTMLElement | Document = document
): { results: BindingRenderResult[]; success: number; failed: number } {
  const results: BindingRenderResult[] = [];

  const listBindings = bindings.filter(b => b.isListContainer);
  const listPaths = listBindings.map(b => b.dataBinding);

  // Filter out bindings that are children of list bindings
  const nonListBindings = bindings.filter(b => {
    if (b.isListContainer) return false;
    for (const listPath of listPaths) {
      const pattern = new RegExp(`^${listPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[\\d+\\]`);
      if (pattern.test(b.dataBinding)) {
        return false;
      }
    }
    return true;
  });

  // Helper to render and track result
  const renderAndTrack = (binding: DomBindingMapping) => {
    try {
      const element = findElementForBinding(binding, containerElement);
      const elementFound = !!element;

      if (!elementFound) {
        const selector = binding.bindingId || binding.path;
        results.push({
          binding,
          success: false,
          elementFound: false,
          error: `Element not found: ${selector}`,
        });
        return;
      }

      const success = renderBindingWithContext(binding, data, bindings, containerElement);
      const renderedValue = element?.textContent?.substring(0, 100) || undefined;

      results.push({
        binding,
        success,
        elementFound: true,
        renderedValue,
        error: success ? undefined : 'Render failed',
      });
    } catch (err) {
      results.push({
        binding,
        success: false,
        elementFound: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Render list bindings first
  listBindings.forEach(renderAndTrack);

  // Render non-list bindings
  nonListBindings.forEach(renderAndTrack);

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { results, success, failed };
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
