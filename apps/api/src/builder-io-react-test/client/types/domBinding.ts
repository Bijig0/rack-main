/**
 * Types for DOM binding and conditional styling system
 */

/**
 * Operators for conditional style evaluation
 */
export type StyleConditionOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "contains"
  | "notContains";

/**
 * A single condition that applies CSS properties when met
 */
export interface StyleCondition {
  /** Value to compare against */
  value: any;
  /** Comparison operator */
  operator: StyleConditionOperator;
  /** CSS properties to apply when condition is true */
  cssProperties: Record<string, string>;
}

/**
 * Conditional styling based on another data binding
 */
export interface ConditionalStyle {
  /** Data binding path this style depends on (e.g., "state.easementsData[0].status") */
  dependsOn: string;
  /** List of conditions to evaluate */
  conditions: StyleCondition[];
}

/**
 * A single condition that sets an attribute value when met
 */
export interface AttributeCondition {
  /** Value to compare against */
  value: any;
  /** Comparison operator */
  operator: StyleConditionOperator;
  /** Attribute value to set when condition is true */
  attributeValue: string;
}

/**
 * Conditional attribute (e.g., icon src) based on another data binding
 */
export interface ConditionalAttribute {
  /** Data binding path this attribute depends on (e.g., "state.schools[0].type") */
  dependsOn: string;
  /** HTML attribute to modify (e.g., "src", "href", "alt") */
  attribute: string;
  /** List of conditions to evaluate */
  conditions: AttributeCondition[];
}

/**
 * A single data binding field with path and alias for templates
 */
export interface DataBindingField {
  /** Data binding path (e.g., "state.propertyInfo.landArea.value") */
  path: string;
  /** Alias used in template (e.g., "value", "unit") */
  alias: string;
}

/**
 * Mapping between a DOM element and a data binding
 */
export interface DomBindingMapping {
  /** Unique identifier */
  id: string;
  /** CSS selector or DOM path to the element */
  path: string;
  /** Data binding path (e.g., "state.propertyInfo.yearBuilt.value") - for single bindings */
  dataBinding: string;
  /** Type of the data (from JSON schema) */
  dataType: string;
  /** For array types, indicates this is the container element */
  isListContainer?: boolean;
  /** For array items, the index accessor pattern (e.g., "[0]") */
  listItemPattern?: string;
  /** Conditional styles to apply based on other data */
  conditionalStyles?: ConditionalStyle[];
  /** Template for formatting object properties (e.g., "{value} {unit}" for landArea) */
  template?: string;
  /** Multiple data bindings for multi-field templates (e.g., combining landArea.value + landArea.unit) */
  multiFieldBindings?: DataBindingField[];
  /** Conditional attributes (e.g., icon src) to apply based on other data */
  conditionalAttributes?: ConditionalAttribute[];
}

/**
 * Apply a template string to an object, replacing {property} placeholders
 * @param template Template string like "{value} {unit}"
 * @param data Object with properties to interpolate
 * @returns Formatted string
 */
export function applyTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = data[key];
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  });
}

/**
 * Extract property names from a template string
 * @param template Template string like "{value} {unit}"
 * @returns Array of property names like ["value", "unit"]
 */
export function extractTemplateProperties(template: string): string[] {
  const matches = template.match(/\{(\w+)\}/g);
  if (!matches) return [];
  return matches.map(m => m.slice(1, -1));
}

/**
 * Apply a multi-field template by building a data object from resolved field values
 * @param template Template string like "{value} {unit}"
 * @param fields Array of field bindings with their aliases
 * @param resolveValue Function to resolve a data path to its value
 * @returns Formatted string
 */
export function applyMultiFieldTemplate(
  template: string,
  fields: DataBindingField[],
  resolveValue: (path: string) => any
): string {
  // Build a data object from the fields
  const data: Record<string, any> = {};
  fields.forEach(field => {
    data[field.alias] = resolveValue(field.path);
  });
  return applyTemplate(template, data);
}

/**
 * Type compatibility between schema types and DOM element types
 */
export const TYPE_COMPATIBILITY: Record<string, string[]> = {
  string: ["text", "textarea", "input", "span", "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "a", "label", "td", "th", "li", "dt", "dd"],
  number: ["text", "input", "span", "p", "div", "td", "th", "li"],
  integer: ["text", "input", "span", "p", "div", "td", "th", "li"],
  boolean: ["checkbox", "switch", "span", "div", "input"],
  array: ["div", "ul", "ol", "section", "table", "tbody", "thead"],
  object: ["div", "section", "article", "aside", "header", "footer", "main", "nav"],
};

/**
 * Get compatible DOM element types for a data type
 */
export function getCompatibleElementTypes(dataType: string): string[] {
  const baseType = dataType.replace(" (nullable)", "").trim();
  return TYPE_COMPATIBILITY[baseType] || [];
}

/**
 * Check if a DOM element is compatible with a data type
 */
export function isElementCompatible(elementType: string, dataType: string): boolean {
  const compatibleTypes = getCompatibleElementTypes(dataType);
  return compatibleTypes.includes(elementType.toLowerCase());
}

/**
 * Escape special characters in CSS class names for use in selectors
 */
function escapeClassName(className: string): string {
  // Escape special CSS characters: !"#$%&'()*+,./:;<=>?@[\]^`{|}~
  return className.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

/**
 * Generate a unique CSS selector for an element
 */
export function generateElementPath(element: HTMLElement): string {
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector += `#${escapeClassName(current.id)}`;
      path.unshift(selector);
      break;
    }

    if (current.className) {
      const classes = Array.from(current.classList)
        .filter(c => !c.startsWith('hover:') && !c.startsWith('group-'))
        .slice(0, 3)
        .map(c => escapeClassName(c))
        .join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(current);
      if (siblings.filter(s => s.tagName === current.tagName).length > 1) {
        selector += `:nth-child(${index + 1})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}
