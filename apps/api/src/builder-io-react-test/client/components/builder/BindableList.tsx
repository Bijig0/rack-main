import { useId, Children, cloneElement, isValidElement } from "react";

export interface BindableListProps {
  /** Unique identifier for this bindable list (auto-generated if not provided) */
  bindingId?: string;
  /** Number of items to show in preview mode */
  previewCount?: number;
  /** Child elements that form the item template */
  children?: React.ReactNode;
  /** CSS classes for the container */
  className?: string;
  /** Inline styles for the container */
  style?: React.CSSProperties;
  /** HTML tag for the container */
  tag?: "div" | "ul" | "ol" | "section";
  /** HTML tag for each item wrapper */
  itemTag?: "div" | "li" | "article";
  /** CSS classes for each item */
  itemClassName?: string;
}

/**
 * BindableList - A container for repeating content bound to schema arrays.
 *
 * Usage in Builder.io:
 * 1. Drag this component where a list should appear
 * 2. Add child components (including BindableText) for the item template
 * 3. In the binding panel, select an array schema field and click this component
 *
 * The component renders with data attributes:
 * - data-bindable="list" - Marks this as a bindable list container
 * - data-binding-id="xxx" - Unique identifier for binding storage
 *
 * Child elements inside the list can use BindableText components to bind
 * to array item fields. During rendering, paths like `schools[i].name`
 * will be resolved to `schools[0].name`, `schools[1].name`, etc.
 */
export const BindableList = ({
  bindingId,
  previewCount = 3,
  children,
  className,
  style,
  tag = "div",
  itemTag = "div",
  itemClassName,
}: BindableListProps) => {
  // Generate a stable ID if none provided
  const generatedId = useId();
  const finalBindingId = bindingId || `list-${generatedId.replace(/:/g, "")}`;

  const Tag = tag;
  const ItemTag = itemTag;

  // In preview mode, render multiple copies of the children
  const previewItems = Array.from({ length: previewCount }).map((_, index) => {
    // Clone children and add index context
    const clonedChildren = Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child as React.ReactElement<any>, {
          "data-list-index": index,
        });
      }
      return child;
    });

    return (
      <ItemTag
        key={index}
        data-list-item
        data-list-item-template={index === 0 ? "true" : undefined}
        data-list-index={index}
        className={itemClassName}
      >
        {clonedChildren}
      </ItemTag>
    );
  });

  return (
    <Tag
      data-bindable="list"
      data-binding-id={finalBindingId}
      data-binding-type="array"
      className={className}
      style={style}
    >
      {previewItems}
    </Tag>
  );
};

export default BindableList;
