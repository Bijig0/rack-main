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

        // Ensure element has position for the indicator
        const currentPosition = window.getComputedStyle(element).position;
        if (currentPosition === 'static') {
          element.style.position = 'relative';
        }

        // Add visual border
        const originalOutline = element.style.outline;
        element.style.outline = '2px dashed #10b981';
        element.style.outlineOffset = '2px';

        // Store original style to restore later
        element.setAttribute('data-original-outline', originalOutline);

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
          element.removeAttribute('data-has-binding');
          element.removeAttribute('data-binding-path');
          element.removeAttribute('data-original-outline');
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

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: hoveredBinding.rect.left + hoveredBinding.rect.width / 2,
        top: hoveredBinding.rect.top - 40,
        transform: 'translateX(-50%)',
      }}
    >
      <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-xl border-2 border-green-700">
        <div className="text-xs font-semibold mb-1">Bound to:</div>
        <code className="text-xs bg-green-700 px-2 py-1 rounded">
          {hoveredBinding.binding.dataBinding}
        </code>
        <div className="text-xs mt-1 opacity-90">
          Type: {hoveredBinding.binding.dataType}
        </div>
        {hoveredBinding.binding.conditionalStyles &&
         hoveredBinding.binding.conditionalStyles.length > 0 && (
          <div className="text-xs mt-1 opacity-90">
            ✨ {hoveredBinding.binding.conditionalStyles.length} conditional style(s)
          </div>
        )}
      </div>
      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-green-700"
      />
    </div>
  );
};
