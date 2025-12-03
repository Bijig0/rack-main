import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MousePointer, Search, Check, Link2, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { generateElementPath } from "@/types/domBinding";

interface BindingNode {
  path: string;
  type: string;
  isUsed: boolean;
  children?: BindingNode[];
  objectProperties?: string[];
}

interface ElementFirstSelectorProps {
  /** Available schema bindings in tree format */
  availableBindings: BindingNode[];
  /** Callback when a binding is selected for an element */
  onBindingComplete: (domPath: string, dataBinding: string, dataType: string, template?: string) => void;
  /** Callback when edit mode is exited */
  onExit: () => void;
}

export const ElementFirstSelector = ({
  availableBindings,
  onBindingComplete,
  onExit,
}: ElementFirstSelectorProps) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [pendingBinding, setPendingBinding] = useState<BindingNode | null>(null);
  const [template, setTemplate] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  // Toggle expanded state for a path
  const toggleExpanded = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Flatten bindings for search
  const flattenBindings = useCallback((nodes: BindingNode[]): BindingNode[] => {
    const result: BindingNode[] = [];
    const flatten = (nodeList: BindingNode[]) => {
      nodeList.forEach(node => {
        result.push(node);
        if (node.children) {
          flatten(node.children);
        }
      });
    };
    flatten(nodes);
    return result;
  }, []);

  // Filter bindings based on search - when searching, show flat list
  const filteredBindings = useMemo(() => {
    if (!searchQuery) return null; // Return null to indicate tree view should be shown
    const allBindings = flattenBindings(availableBindings);
    return allBindings.filter(b =>
      b.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableBindings, searchQuery, flattenBindings]);

  // Apply overlay styling to all elements
  const applyElementOverlay = useCallback(
    (element: HTMLElement, isHovered: boolean = false, isSelected: boolean = false) => {
      // Store original styles if not already stored
      if (!element.dataset.originalOutline) {
        element.dataset.originalOutline = element.style.outline || "";
        element.dataset.originalCursor = element.style.cursor || "";
      }

      if (isSelected) {
        element.style.outline = "3px solid #10b981";
        element.style.cursor = "default";
      } else if (isHovered) {
        element.style.outline = "2px solid #3b82f6";
        element.style.cursor = "pointer";
      } else {
        element.style.outline = "1px dashed #94a3b8";
        element.style.cursor = "pointer";
      }
    },
    []
  );

  // Remove overlay styling
  const removeElementOverlay = useCallback((element: HTMLElement) => {
    if (element.dataset.originalOutline !== undefined) {
      element.style.outline = element.dataset.originalOutline;
      element.style.cursor = element.dataset.originalCursor || "";
      delete element.dataset.originalOutline;
      delete element.dataset.originalCursor;
    }
  }, []);

  useEffect(() => {
    // Helper to check if element should be excluded
    const shouldExcludeElement = (el: HTMLElement): boolean => {
      return el.closest('[data-element-selector-ui]') !== null ||
             el.closest('[data-binding-panel]') !== null;
    };

    // Get all content elements (skip UI elements)
    const getAllContentElements = () => {
      return Array.from(document.querySelectorAll('body *'))
        .filter(el => el instanceof HTMLElement && !shouldExcludeElement(el as HTMLElement)) as HTMLElement[];
    };

    const allElements = getAllContentElements();
    let currentHoveredElement: HTMLElement | null = null;

    // Apply initial overlay to all elements
    allElements.forEach((el) => {
      if (el !== selectedElement) {
        applyElementOverlay(el, false, false);
      }
    });

    // If we have a selected element, highlight it
    if (selectedElement) {
      applyElementOverlay(selectedElement, false, true);
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldExcludeElement(target)) return;
      if (target === selectedElement) return;

      // Remove hover from previous element
      if (currentHoveredElement && currentHoveredElement !== target && currentHoveredElement !== selectedElement) {
        applyElementOverlay(currentHoveredElement, false, false);
      }

      currentHoveredElement = target;
      setHoveredElement(target);
      applyElementOverlay(target, true, false);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === currentHoveredElement && target !== selectedElement) {
        applyElementOverlay(target, false, false);
        currentHoveredElement = null;
        setHoveredElement(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldExcludeElement(target)) return;

      e.preventDefault();
      e.stopPropagation();

      // Deselect previous element
      if (selectedElement && selectedElement !== target) {
        applyElementOverlay(selectedElement, false, false);
      }

      // Select new element
      const path = generateElementPath(target);
      setSelectedElement(target);
      setSelectedPath(path);
      applyElementOverlay(target, false, true);

      // Reset binding selection state
      setShowTemplateInput(false);
      setPendingBinding(null);
      setTemplate("");
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showTemplateInput) {
          setShowTemplateInput(false);
          setPendingBinding(null);
        } else if (selectedElement) {
          // Deselect element
          applyElementOverlay(selectedElement, false, false);
          setSelectedElement(null);
          setSelectedPath("");
        } else {
          onExit();
        }
      }
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);
    document.body.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup all overlays
      allElements.forEach((el) => {
        removeElementOverlay(el);
      });

      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      document.body.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedElement, showTemplateInput, applyElementOverlay, removeElementOverlay, onExit]);

  const handleSelectBinding = (binding: BindingNode) => {
    const baseType = binding.type.replace(" (nullable)", "").trim();

    // For object types with properties, show template input
    if (baseType === "object" && binding.objectProperties && binding.objectProperties.length > 0) {
      setPendingBinding(binding);
      setShowTemplateInput(true);
      // Set a default template
      setTemplate(binding.objectProperties.map(p => `{${p}}`).join(" "));
    } else {
      // Complete binding immediately
      onBindingComplete(selectedPath, binding.path, binding.type);
      // Reset selection
      if (selectedElement) {
        removeElementOverlay(selectedElement);
      }
      setSelectedElement(null);
      setSelectedPath("");
    }
  };

  const handleTemplateConfirm = () => {
    if (!pendingBinding) return;

    onBindingComplete(selectedPath, pendingBinding.path, pendingBinding.type, template);

    // Reset selection
    if (selectedElement) {
      removeElementOverlay(selectedElement);
    }
    setSelectedElement(null);
    setSelectedPath("");
    setShowTemplateInput(false);
    setPendingBinding(null);
    setTemplate("");
  };

  const getElementTagInfo = (el: HTMLElement | null) => {
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id,
      classes: Array.from(el.classList).slice(0, 3).join(" "),
    };
  };

  // Render a single binding node with expand/collapse
  const renderBindingNode = (node: BindingNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedPaths.has(node.path);
    const paddingLeft = depth * 12;

    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-1 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer group"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          {/* Expand/Collapse toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.path);
              }}
              className="w-4 h-4 flex items-center justify-center shrink-0 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 shrink-0" />
          )}

          {/* Binding info - clickable to bind */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={() => handleSelectBinding(node)}
          >
            <code className="text-xs font-mono truncate flex-1">
              {node.path.split('.').pop()}
            </code>
            <Badge variant="outline" className="text-xs shrink-0">
              {node.type}
            </Badge>
            <Link2 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 shrink-0" />
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderBindingNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render flat list item (for search results)
  const renderFlatBindingItem = (binding: BindingNode) => (
    <div
      key={binding.path}
      className="flex items-center justify-between gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer group"
      onClick={() => handleSelectBinding(binding)}
    >
      <div className="min-w-0 flex-1">
        <code className="text-xs font-mono block truncate">
          {binding.path}
        </code>
      </div>
      <Badge variant="outline" className="text-xs shrink-0">
        {binding.type}
      </Badge>
      <Link2 className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 shrink-0" />
    </div>
  );

  const hoveredInfo = getElementTagInfo(hoveredElement);
  const selectedInfo = getElementTagInfo(selectedElement);

  return (
    <div className="fixed top-4 right-4 z-[100] w-96" data-element-selector-ui>
      <Card className="shadow-2xl border-2 border-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm">Element Binding Mode</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onExit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-600">
            Click on any element to select it, then choose a data binding
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Hovered Element Info */}
          {hoveredInfo && !selectedElement && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <div className="text-xs font-semibold text-blue-700">Hovering:</div>
              <code className="text-xs">
                &lt;{hoveredInfo.tag}
                {hoveredInfo.id && ` id="${hoveredInfo.id}"`}
                {hoveredInfo.classes && ` class="${hoveredInfo.classes}..."`}
                &gt;
              </code>
            </div>
          )}

          {/* Selected Element */}
          {selectedElement && (
            <div className="bg-green-50 border border-green-200 rounded p-2">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Selected Element:</span>
              </div>
              <code className="text-xs block mb-2">
                &lt;{selectedInfo?.tag}
                {selectedInfo?.id && ` id="${selectedInfo.id}"`}
                {selectedInfo?.classes && ` class="${selectedInfo.classes}..."`}
                &gt;
              </code>
              <div className="text-xs text-gray-600 font-mono break-all bg-white rounded p-1 border">
                {selectedPath.length > 60 ? `${selectedPath.slice(0, 60)}...` : selectedPath}
              </div>
            </div>
          )}

          {/* Template Input for Objects */}
          {showTemplateInput && pendingBinding && (
            <div className="bg-purple-50 border border-purple-200 rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Object Template</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Binding: <code className="bg-white px-1 rounded">{pendingBinding.path}</code>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {pendingBinding.objectProperties?.map(prop => (
                  <button
                    key={prop}
                    onClick={() => setTemplate(prev => prev + (prev ? " " : "") + `{${prop}}`)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-0.5 rounded text-xs"
                  >
                    + {prop}
                  </button>
                ))}
              </div>
              <Input
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder="e.g., {value} {unit}"
                className="text-sm font-mono"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowTemplateInput(false);
                    setPendingBinding(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleTemplateConfirm}
                  disabled={!template}
                  className="flex-1"
                >
                  Bind
                </Button>
              </div>
            </div>
          )}

          {/* Binding Selection (only when element is selected and not showing template) */}
          {selectedElement && !showTemplateInput && (
            <>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search bindings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>

              <ScrollArea className="h-[300px]">
                {filteredBindings ? (
                  // Flat search results
                  <div className="space-y-1">
                    {filteredBindings.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No bindings found
                      </div>
                    ) : (
                      filteredBindings.map(renderFlatBindingItem)
                    )}
                  </div>
                ) : (
                  // Tree view
                  <div>
                    {availableBindings.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No bindings available
                      </div>
                    ) : (
                      availableBindings.map((binding) => renderBindingNode(binding))
                    )}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* Instructions when no element selected */}
          {!selectedElement && (
            <div className="text-xs text-gray-500 text-center py-4 border-t">
              Click on any highlighted element to select it
              <br />
              <span className="text-gray-400">Press ESC to exit edit mode</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
