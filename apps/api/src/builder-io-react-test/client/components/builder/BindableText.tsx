import { useEffect, useId } from "react";

export interface BindableTextProps {
  /** Unique identifier for this bindable element (auto-generated if not provided) */
  bindingId?: string;
  /** Preview text shown in the editor */
  placeholder?: string;
  /** Fallback value if no data is bound */
  defaultValue?: string;
  /** HTML tag to render */
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "label";
  /** CSS classes for styling */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * BindableText - A text element that can be bound to schema string/number fields.
 *
 * Usage in Builder.io:
 * 1. Drag this component where dynamic text should appear
 * 2. Style it using Builder.io tools
 * 3. In the binding panel, select a schema field and click this component
 *
 * The component renders with data attributes that make it discoverable:
 * - data-bindable="text" - Marks this as a bindable text element
 * - data-binding-id="xxx" - Unique identifier for binding storage
 */
export const BindableText = ({
  bindingId,
  placeholder = "Bindable Text",
  defaultValue,
  tag = "span",
  className,
  style,
}: BindableTextProps) => {
  // Generate a stable ID if none provided
  const generatedId = useId();
  const finalBindingId = bindingId || `text-${generatedId.replace(/:/g, "")}`;

  const Tag = tag;

  return (
    <Tag
      data-bindable="text"
      data-binding-id={finalBindingId}
      data-binding-type="string"
      className={className}
      style={style}
    >
      {defaultValue || placeholder}
    </Tag>
  );
};

export default BindableText;
