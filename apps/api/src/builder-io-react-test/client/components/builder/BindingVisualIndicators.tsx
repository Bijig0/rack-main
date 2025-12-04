import { useEffect, useState } from "react";
import { DomBindingMapping } from "@/types/domBinding";
import { Badge } from "@/components/ui/badge";

interface BindingVisualIndicatorsProps {
  /** DOM bindings to visualize */
  bindings: DomBindingMapping[];
  /** Whether to show visual indicators */
  enabled: boolean;
  /** Sample data to render (optional) */
  data?: any;
}

/**
 * Component that adds visual indicators to DOM elements that have bindings
 * Shows a badge with the binding path on hover
 */
export const BindingVisualIndicators = ({
  bindings,
  enabled,
  data,
}: BindingVisualIndicatorsProps) => {
  const [hoveredBinding, setHoveredBinding] = useState<{
    binding: DomBindingMapping;
    element: HTMLElement;
    rect: DOMRect;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Remove all indicators
      document.querySelectorAll('[data-binding-indicator]').forEach((el) => {
        el.remove();
      });
      document.querySelectorAll('[data-has-binding]').forEach((el) => {
        (el as HTMLElement).removeAttribute('data-has-binding');
        (el as HTMLElement).style.position = '';
      });
      return;
    }

    // Add indicators to all bound elements
    bindings.forEach((binding) => {
      try {
        const element = document.querySelector(binding.path) as HTMLElement;
        if (!element) return;

        // Mark element as having a binding
        element.setAttribute('data-has-binding', 'true');
        element.setAttribute('data-binding-path', binding.dataBinding);
        if (binding.isListContainer) {
          element.setAttribute('data-is-list-container', 'true');
        }

        // Ensure element has position for the indicator
        const currentPosition = window.getComputedStyle(element).position;
        if (currentPosition === 'static') {
          element.style.position = 'relative';
        }

        // Add visual border - RED for all bindings
        const originalOutline = element.style.outline;
        const originalOutlineOffset = element.style.outlineOffset;
        element.style.outline = '2px solid #ef4444'; // red-500
        element.style.outlineOffset = '2px';

        // For list containers, also highlight the item template children with purple
        if (binding.isListContainer && binding.listItemPattern) {
          console.log('🟣 List container found:', {
            path: binding.path,
            listItemPattern: binding.listItemPattern,
            element: element.tagName,
          });

          // Try multiple selector strategies
          let itemElements = element.querySelectorAll(`:scope > ${binding.listItemPattern}`);
          console.log('🟣 Direct children with :scope >:', itemElements.length);

          // If no direct children found, try without :scope >
          if (itemElements.length === 0) {
            itemElements = element.querySelectorAll(binding.listItemPattern);
            console.log('🟣 All descendants matching pattern:', itemElements.length);
          }

          itemElements.forEach((itemEl, idx) => {
            const item = itemEl as HTMLElement;
            console.log(`🟣 Highlighting item ${idx}:`, item.tagName, item.className);
            // Store original styles
            item.setAttribute('data-is-list-item-template', 'true');
            item.setAttribute('data-original-outline', item.style.outline);
            item.setAttribute('data-original-outline-offset', item.style.outlineOffset);
            // Apply purple dashed border to indicate it's the repeating template
            item.style.outline = '2px dashed #9333ea'; // purple-600
            item.style.outlineOffset = '1px';
          });
        }

        // Store original styles to restore later
        element.setAttribute('data-original-outline', originalOutline);
        element.setAttribute('data-original-outline-offset', originalOutlineOffset);

        // Add hover listeners
        const handleMouseEnter = () => {
          const rect = element.getBoundingClientRect();
          setHoveredBinding({ binding, element, rect });
        };

        const handleMouseLeave = () => {
          setHoveredBinding(null);
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        // Store cleanup function
        (element as any)._bindingCleanup = () => {
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
          element.style.outline = originalOutline;
          element.style.outlineOffset = originalOutlineOffset;
          element.removeAttribute('data-has-binding');
          element.removeAttribute('data-binding-path');
          element.removeAttribute('data-is-list-container');
          element.removeAttribute('data-original-outline');
          element.removeAttribute('data-original-outline-offset');

          // Also cleanup list item template elements
          if (binding.isListContainer && binding.listItemPattern) {
            const itemElements = element.querySelectorAll('[data-is-list-item-template]');
            itemElements.forEach((itemEl) => {
              const item = itemEl as HTMLElement;
              const origOutline = item.getAttribute('data-original-outline') || '';
              const origOutlineOffset = item.getAttribute('data-original-outline-offset') || '';
              item.style.outline = origOutline;
              item.style.outlineOffset = origOutlineOffset;
              item.removeAttribute('data-is-list-item-template');
              item.removeAttribute('data-original-outline');
              item.removeAttribute('data-original-outline-offset');
            });
          }
        };
      } catch (error) {
        console.error('Error adding binding indicator:', error);
      }
    });

    return () => {
      // Cleanup
      bindings.forEach((binding) => {
        try {
          const element = document.querySelector(binding.path) as HTMLElement;
          if (element && (element as any)._bindingCleanup) {
            (element as any)._bindingCleanup();
          }
        } catch (error) {
          console.error('Error cleaning up binding indicator:', error);
        }
      });
    };
  }, [bindings, enabled]);

  if (!enabled || !hoveredBinding) return null;

  const isListContainer = hoveredBinding.binding.isListContainer;

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: hoveredBinding.rect.left + hoveredBinding.rect.width / 2,
        top: hoveredBinding.rect.top - 40,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-xl border-2 border-red-700">
        <div className="text-xs font-semibold mb-1">
          {isListContainer ? '📋 List Container:' : 'Bound to:'}
        </div>
        <code className="text-xs bg-red-700 px-2 py-1 rounded">
          {hoveredBinding.binding.dataBinding}
        </code>
        <div className="text-xs mt-1 opacity-90">
          Type: {hoveredBinding.binding.dataType}
        </div>
        {isListContainer && hoveredBinding.binding.listItemPattern && (
          <div className="text-xs mt-1 opacity-90">
            Item selector: <code className="bg-red-800 px-1 rounded">{hoveredBinding.binding.listItemPattern}</code>
          </div>
        )}
        {hoveredBinding.binding.conditionalStyles &&
         hoveredBinding.binding.conditionalStyles.length > 0 && (
          <div className="text-xs mt-1 opacity-90">
            ✨ {hoveredBinding.binding.conditionalStyles.length} conditional style(s)
          </div>
        )}
      </div>
      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-red-700"
      />
    </div>
  );
};
