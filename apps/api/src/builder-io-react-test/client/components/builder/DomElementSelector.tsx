import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, MousePointer, Check } from "lucide-react";
import {
  generateElementPath,
  isElementCompatible,
  getCompatibleElementTypes,
} from "@/types/domBinding";

interface DomElementSelectorProps {
  /** The data type to match elements against */
  dataType: string;
  /** Data binding path being configured */
  dataBinding: string;
  /** Whether this is for a list container selection */
  isListSelection?: boolean;
  /** Callback when an element is selected */
  onSelect: (path: string, element: HTMLElement) => void;
  /** Callback to cancel selection */
  onCancel: () => void;
  /** Optional parent element to select within (for list child selection) */
  parentElement?: HTMLElement;
}

export const DomElementSelector = ({
  dataType,
  dataBinding,
  isListSelection = false,
  onSelect,
  onCancel,
  parentElement,
}: DomElementSelectorProps) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");

  // Apply overlay styling to elements
  const applyElementOverlay = useCallback(
    (element: HTMLElement, isHovered: boolean = false) => {
      const isCompatible = isElementCompatible(
        element.tagName.toLowerCase(),
        dataType
      );

      // Store original styles
      if (!element.dataset.originalOutline) {
        element.dataset.originalOutline = element.style.outline || "";
        element.dataset.originalOpacity = element.style.opacity || "";
        element.dataset.originalCursor = element.style.cursor || "";
        element.dataset.originalPointerEvents = element.style.pointerEvents || "";
      }

      if (isCompatible) {
        element.style.outline = isHovered
          ? "3px solid #3b82f6"
          : "1px dashed #3b82f6";
        element.style.opacity = "1";
        element.style.cursor = "pointer";
        element.style.pointerEvents = "auto";
      } else {
        element.style.outline = "none";
        element.style.opacity = "0.3";
        element.style.pointerEvents = "none";
        element.style.cursor = "not-allowed";
      }
    },
    [dataType]
  );

  // Remove overlay styling
  const removeElementOverlay = useCallback((element: HTMLElement) => {
    if (element.dataset.originalOutline !== undefined) {
      element.style.outline = element.dataset.originalOutline;
      element.style.opacity = element.dataset.originalOpacity || "";
      element.style.cursor = element.dataset.originalCursor || "";
      element.style.pointerEvents = element.dataset.originalPointerEvents || "";

      delete element.dataset.originalOutline;
      delete element.dataset.originalOpacity;
      delete element.dataset.originalCursor;
      delete element.dataset.originalPointerEvents;
    }
  }, []);

  useEffect(() => {
    const rootElement = parentElement || document.body;
    const allElements = rootElement.querySelectorAll("*");

    // Apply initial overlay
    allElements.forEach((el) => {
      if (el instanceof HTMLElement && el !== rootElement) {
        applyElementOverlay(el);
      }
    });

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        isElementCompatible(target.tagName.toLowerCase(), dataType)
      ) {
        setHoveredElement(target);
        applyElementOverlay(target, true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && hoveredElement === target) {
        setHoveredElement(null);
        applyElementOverlay(target, false);
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (
        target &&
        isElementCompatible(target.tagName.toLowerCase(), dataType)
      ) {
        const path = generateElementPath(target);
        setSelectedPath(path);
        onSelect(path, target);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    rootElement.addEventListener("mouseover", handleMouseOver);
    rootElement.addEventListener("mouseout", handleMouseOut);
    rootElement.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          removeElementOverlay(el);
        }
      });

      rootElement.removeEventListener("mouseover", handleMouseOver);
      rootElement.removeEventListener("mouseout", handleMouseOut);
      rootElement.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    dataType,
    parentElement,
    applyElementOverlay,
    removeElementOverlay,
    onSelect,
    onCancel,
    hoveredElement,
  ]);

  const compatibleTypes = getCompatibleElementTypes(dataType);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] max-w-[calc(100vw-2rem)] px-4">
      <Card className="shadow-2xl border-2 border-blue-500 w-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">
                  Select DOM Element
                </div>
                <div className="text-xs text-gray-600">
                  {isListSelection ? "Select container for list" : "Select element to bind"}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="text-xs">
              <span className="font-semibold">Data Binding:</span>
              <code className="ml-2 bg-gray-100 px-1 rounded">
                {dataBinding}
              </code>
            </div>
            <div className="text-xs">
              <span className="font-semibold">Data Type:</span>
              <code className="ml-2 bg-gray-100 px-1 rounded">{dataType}</code>
            </div>
            <div className="text-xs">
              <span className="font-semibold">Compatible Elements:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {compatibleTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {hoveredElement && (
            <div className="border-t pt-3">
              <div className="text-xs font-semibold mb-1">Hovering:</div>
              <code className="text-xs bg-yellow-50 border border-yellow-200 px-2 py-1 rounded block break-words overflow-wrap-anywhere">
                {generateElementPath(hoveredElement)}
              </code>
            </div>
          )}

          {selectedPath && (
            <div className="border-t pt-3 bg-green-50 -m-4 mt-3 p-4 rounded-b">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-4 h-4" />
                <span className="font-semibold text-xs">Element Selected!</span>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 border-t pt-2">
            Click on a highlighted element to select it. Press ESC to cancel.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
