/**
 * DOM Binding Types
 *
 * This file contains types and utilities for the DOM binding system
 * which allows visual assignment of data bindings to HTML elements
 */

export interface DomBinding {
  /** The data binding path (e.g., "state.coverPageData.addressCommonName") */
  bindingPath: string;

  /** The type of the binding (e.g., "string", "number", "object") */
  bindingType: string;

  /** CSS selector to uniquely identify the DOM element */
  selector: string;

  /** The tag name of the element (e.g., "p", "td", "span") */
  tagName: string;

  /** Optional: The original text content of the element */
  originalContent?: string;

  /** Timestamp when the binding was created */
  createdAt: number;
}

export interface DomBindingState {
  /** Currently selected binding path for assignment */
  selectedBinding: {
    path: string;
    type: string;
  } | null;

  /** All active DOM bindings */
  bindings: DomBinding[];

  /** Whether we're in binding assignment mode */
  isAssignmentMode: boolean;
}

/**
 * Determine which HTML elements are compatible with a given data type
 */
export function getCompatibleElements(dataType: string): string[] {
  const normalizedType = dataType.toLowerCase().replace(/\s*\(nullable\)\s*/, '');

  switch (normalizedType) {
    case 'string':
      return ['p', 'span', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'label', 'li', 'a'];

    case 'number':
      return ['p', 'span', 'td', 'th', 'div', 'label', 'li'];

    case 'boolean':
      return ['span', 'td', 'div', 'label'];

    case 'array':
      return ['ul', 'ol', 'table', 'div'];

    case 'object':
      return ['div', 'section', 'article'];

    default:
      // For unknown types, allow text-compatible elements
      return ['p', 'span', 'td', 'th', 'div'];
  }
}

/**
 * Check if an element is compatible with a data type
 */
export function isElementCompatible(element: HTMLElement, dataType: string): boolean {
  const compatibleTags = getCompatibleElements(dataType);
  return compatibleTags.includes(element.tagName.toLowerCase());
}

/**
 * Generate a unique CSS selector for an element
 */
export function generateSelector(element: HTMLElement): string {
  // If element has an ID, use that
  if (element.id) {
    return `#${element.id}`;
  }

  // Build a path using tag names and nth-child selectors
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    // Add class if available
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }

    // Add nth-child if there are siblings of the same type
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Get element by selector
 */
export function getElementBySelector(selector: string): HTMLElement | null {
  try {
    return document.querySelector(selector);
  } catch (e) {
    console.error('Invalid selector:', selector, e);
    return null;
  }
}

/**
 * Add visual indicator class to an element
 */
export function addBindingIndicator(element: HTMLElement, bindingPath: string): void {
  element.setAttribute('data-binding', bindingPath);
  element.classList.add('has-data-binding');
}

/**
 * Remove visual indicator class from an element
 */
export function removeBindingIndicator(element: HTMLElement): void {
  element.removeAttribute('data-binding');
  element.classList.remove('has-data-binding');
}
