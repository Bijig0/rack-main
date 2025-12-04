import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MousePointer, Search, Check, Link2, FileText, ChevronRight, ChevronDown, Trash2, Save, Loader2, Code, Plus, Layers, Info, List } from "lucide-react";
import { generateElementPath, DomBindingMapping, DataBindingField } from "@/types/domBinding";

interface BindingNode {
  path: string;
  type: string;
  isUsed: boolean;
  children?: BindingNode[];
  objectProperties?: string[];
}

interface ListBindingConfig {
  isListContainer: boolean;
  listItemPattern?: string;
}

interface ElementFirstSelectorProps {
  /** Available schema bindings in tree format */
  availableBindings: BindingNode[];
  /** Existing DOM bindings */
  existingBindings: DomBindingMapping[];
  /** Callback when a binding is selected for an element */
  onBindingComplete: (
    domPath: string,
    dataBinding: string,
    dataType: string,
    template?: string,
    multiFieldBindings?: DataBindingField[],
    listConfig?: ListBindingConfig
  ) => void;
  /** Callback to delete a binding */
  onDeleteBinding: (bindingId: string) => void;
  /** Callback when edit mode is exited */
  onExit: () => void;
  /** Callback to save changes to the database */
  onSave: () => void;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Whether save is in progress */
  isSaving: boolean;
}

export const ElementFirstSelector = ({
  availableBindings,
  existingBindings,
  onBindingComplete,
  onDeleteBinding,
  onExit,
  onSave,
  hasUnsavedChanges,
  isSaving,
}: ElementFirstSelectorProps) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [pendingBinding, setPendingBinding] = useState<BindingNode | null>(null);
  const [template, setTemplate] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [selectedBoundBinding, setSelectedBoundBinding] = useState<DomBindingMapping | null>(null);

  // Tooltip and modal state for bound elements
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [tooltipBinding, setTooltipBinding] = useState<DomBindingMapping | null>(null);
  const [showBindingModal, setShowBindingModal] = useState(false);
  const [modalBinding, setModalBinding] = useState<DomBindingMapping | null>(null);
  const [modalElement, setModalElement] = useState<HTMLElement | null>(null);

  // Multi-field binding state
  const [multiFieldMode, setMultiFieldMode] = useState(false);
  const [multiFieldBindings, setMultiFieldBindings] = useState<DataBindingField[]>([]);
  const [nextFieldAlias, setNextFieldAlias] = useState("");

  // List binding state
  const [listBindingMode, setListBindingMode] = useState(false);
  const [listItemPattern, setListItemPattern] = useState("");
  const [pendingListBinding, setPendingListBinding] = useState<BindingNode | null>(null);
  const [itemSelectionMode, setItemSelectionMode] = useState(false); // For interactive child item selection

  // Create a map of DOM paths to their bindings for quick lookup
  const boundPathsMap = useMemo(() => {
    const map = new Map<string, DomBindingMapping>();
    existingBindings.forEach(binding => {
      map.set(binding.path, binding);
    });
    return map;
  }, [existingBindings]);

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

  // Check if an element is bound
  const getBindingForElement = useCallback((element: HTMLElement): DomBindingMapping | null => {
    const path = generateElementPath(element);
    return boundPathsMap.get(path) || null;
  }, [boundPathsMap]);

  // Apply overlay styling to all elements
  const applyElementOverlay = useCallback(
    (element: HTMLElement, isHovered: boolean = false, isSelected: boolean = false, isBound: boolean = false) => {
      // Store original styles if not already stored
      if (!element.dataset.originalOutline) {
        element.dataset.originalOutline = element.style.outline || "";
        element.dataset.originalCursor = element.style.cursor || "";
      }

      if (isSelected) {
        element.style.outline = isBound ? "3px solid #dc2626" : "3px solid #10b981";
        element.style.cursor = "default";
      } else if (isHovered) {
        element.style.outline = isBound ? "2px solid #dc2626" : "2px solid #3b82f6";
        element.style.cursor = "pointer";
      } else if (isBound) {
        // Bound elements get a red dashed border
        element.style.outline = "2px dashed #dc2626";
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

    // Check if an element is a child of the selected container (for item selection mode)
    const isChildOfSelectedContainer = (el: HTMLElement): boolean => {
      if (!selectedElement || !itemSelectionMode) return false;
      return selectedElement.contains(el) && el !== selectedElement;
    };

    // Generate a relative CSS selector for a child element within the container
    const generateChildSelector = (el: HTMLElement): string => {
      const tag = el.tagName.toLowerCase();

      // Try to find unique identifier
      if (el.id) {
        return `#${el.id}`;
      }

      // Use classList if available (safer than className which can be SVGAnimatedString)
      if (el.classList && el.classList.length > 0) {
        const classes = Array.from(el.classList)
          .filter(c => typeof c === 'string' && !c.startsWith('hover:') && !c.startsWith('group-'))
          .slice(0, 2)
          .join('.');
        if (classes) {
          return `${tag}.${classes}`;
        }
      }

      // Just use tag name
      return tag;
    };

    // Get all content elements (skip UI elements)
    const getAllContentElements = () => {
      return Array.from(document.querySelectorAll('body *'))
        .filter(el => el instanceof HTMLElement && !shouldExcludeElement(el as HTMLElement)) as HTMLElement[];
    };

    const allElements = getAllContentElements();
    let currentHoveredElement: HTMLElement | null = null;

    // Check if selected element is still valid (exists in DOM)
    const isSelectedElementValid = selectedElement && document.body.contains(selectedElement);

    // If selected element is no longer valid, clear it
    if (selectedElement && !isSelectedElementValid) {
      setSelectedElement(null);
      setSelectedPath("");
      setSelectedBoundBinding(null);
      setShowTemplateInput(false);
      setPendingBinding(null);
      setTemplate("");
      setMultiFieldMode(false);
      setMultiFieldBindings([]);
    }

    // Apply initial overlay to all elements
    allElements.forEach((el) => {
      const isBound = !!getBindingForElement(el);

      // In item selection mode, style children differently
      if (itemSelectionMode && selectedElement) {
        if (el === selectedElement) {
          // Container stays highlighted as selected (green with thicker border)
          el.style.outline = "4px solid #10b981";
          el.style.cursor = "default";
          el.dataset.itemSelectionRole = "container";
        } else if (selectedElement.contains(el) && el !== selectedElement) {
          // Children of container get a special dashed purple border
          el.style.outline = "2px dashed #9333ea";
          el.style.cursor = "pointer";
          el.dataset.itemSelectionRole = "child";
        } else {
          // Other elements are subtle
          el.style.outline = "1px dashed #d1d5db";
          el.style.cursor = "not-allowed";
          el.dataset.itemSelectionRole = "other";
        }
      } else {
        // Normal mode - clear item selection role
        delete el.dataset.itemSelectionRole;
        if (el !== selectedElement || !isSelectedElementValid) {
          applyElementOverlay(el, false, false, isBound);
        }
      }
    });

    // If we have a valid selected element (and not in item selection mode), highlight it
    if (isSelectedElementValid && !itemSelectionMode) {
      const isBound = !!getBindingForElement(selectedElement);
      applyElementOverlay(selectedElement, false, true, isBound);
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldExcludeElement(target)) return;

      // Item selection mode: only highlight children of the container
      if (itemSelectionMode && selectedElement) {
        // Only interact with child elements
        if (target.dataset.itemSelectionRole !== "child") return;

        // Remove hover from previous element
        if (currentHoveredElement && currentHoveredElement !== target) {
          currentHoveredElement.style.outline = "2px dashed #9333ea";
          currentHoveredElement.style.backgroundColor = "";
        }

        currentHoveredElement = target;
        setHoveredElement(target);
        target.style.outline = "3px solid #9333ea";
        target.style.backgroundColor = "rgba(147, 51, 234, 0.1)";
        return;
      }

      // Normal mode
      if (target === selectedElement) return;

      // Remove hover from previous element
      if (currentHoveredElement && currentHoveredElement !== target && currentHoveredElement !== selectedElement) {
        const wasBound = !!getBindingForElement(currentHoveredElement);
        applyElementOverlay(currentHoveredElement, false, false, wasBound);
      }

      currentHoveredElement = target;
      setHoveredElement(target);
      const binding = getBindingForElement(target);
      const isBound = !!binding;
      applyElementOverlay(target, true, false, isBound);

      // Update tooltip for bound elements
      if (binding) {
        setTooltipBinding(binding);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      } else {
        setTooltipBinding(null);
        setTooltipPosition(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldExcludeElement(target)) return;

      const binding = getBindingForElement(target);
      if (binding) {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Item selection mode
      if (itemSelectionMode && selectedElement) {
        if (target.dataset.itemSelectionRole === "child" && target === currentHoveredElement) {
          target.style.outline = "2px dashed #9333ea";
          target.style.backgroundColor = "";
          currentHoveredElement = null;
          setHoveredElement(null);
        }
        return;
      }

      // Normal mode
      if (target === currentHoveredElement && target !== selectedElement) {
        const isBound = !!getBindingForElement(target);
        applyElementOverlay(target, false, false, isBound);
        currentHoveredElement = null;
        setHoveredElement(null);
        // Clear tooltip when leaving element
        setTooltipBinding(null);
        setTooltipPosition(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (shouldExcludeElement(target)) return;

      e.preventDefault();
      e.stopPropagation();

      // Item selection mode: select child as item template
      if (itemSelectionMode && selectedElement) {
        // Only allow clicking on child elements
        if (target.dataset.itemSelectionRole !== "child") return;

        const selector = generateChildSelector(target);
        setListItemPattern(selector);
        setItemSelectionMode(false);

        // Reset hover styling on the clicked element
        target.style.backgroundColor = "";

        return;
      }

      // If clicking the same element that's already selected, deselect it
      if (selectedElement === target) {
        const isBound = !!getBindingForElement(target);
        applyElementOverlay(target, false, false, isBound);
        setSelectedElement(null);
        setSelectedPath("");
        setSelectedBoundBinding(null);
        setShowTemplateInput(false);
        setPendingBinding(null);
        setTemplate("");
        return;
      }

      // Deselect previous element
      if (selectedElement && selectedElement !== target) {
        const wasBound = !!getBindingForElement(selectedElement);
        applyElementOverlay(selectedElement, false, false, wasBound);
      }

      // Select new element
      const path = generateElementPath(target);
      setSelectedElement(target);
      setSelectedPath(path);

      // Check if this element is already bound
      const existingBinding = getBindingForElement(target);
      if (existingBinding) {
        setSelectedBoundBinding(existingBinding);
      } else {
        setSelectedBoundBinding(null);
      }

      const isBound = !!existingBinding;
      applyElementOverlay(target, false, true, isBound);

      // Reset binding selection state
      setShowTemplateInput(false);
      setPendingBinding(null);
      setTemplate("");
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Exit item selection mode first
        if (itemSelectionMode) {
          setItemSelectionMode(false);
          return;
        }

        if (showTemplateInput) {
          setShowTemplateInput(false);
          setPendingBinding(null);
        } else if (selectedElement) {
          // Deselect element
          const isBound = !!getBindingForElement(selectedElement);
          applyElementOverlay(selectedElement, false, false, isBound);
          setSelectedElement(null);
          setSelectedPath("");
          setSelectedBoundBinding(null);
        } else {
          onExit();
        }
      }
    };

    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      // Cleanup all overlays
      allElements.forEach((el) => {
        removeElementOverlay(el);
        el.style.backgroundColor = "";
        delete el.dataset.itemSelectionRole;
      });

      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedElement, showTemplateInput, applyElementOverlay, removeElementOverlay, onExit, getBindingForElement, itemSelectionMode]);

  const handleSelectBinding = (binding: BindingNode) => {
    const baseType = binding.type.replace(" (nullable)", "").trim();

    // If in multi-field mode, add this as another field
    if (multiFieldMode) {
      // Generate a default alias from the last part of the path
      const pathParts = binding.path.split('.');
      const defaultAlias = pathParts[pathParts.length - 1];

      // Check if alias already exists
      const aliasExists = multiFieldBindings.some(f => f.alias === defaultAlias);
      const alias = aliasExists ? `${defaultAlias}${multiFieldBindings.length + 1}` : defaultAlias;

      setMultiFieldBindings([...multiFieldBindings, { path: binding.path, alias }]);
      // Update template with new field
      setTemplate(prev => prev + (prev ? " " : "") + `{${alias}}`);
      return;
    }

    // For array types, show list binding configuration
    if (baseType === "array") {
      setPendingListBinding(binding);
      setListBindingMode(true);
      // Try to auto-detect first child selector
      if (selectedElement) {
        const firstChild = selectedElement.querySelector(':scope > *');
        if (firstChild) {
          const tag = firstChild.tagName.toLowerCase();
          const classes = Array.from(firstChild.classList).slice(0, 2).join('.');
          setListItemPattern(classes ? `${tag}.${classes}` : tag);
        } else {
          setListItemPattern('');
        }
      }
      return;
    }

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
      setSelectedBoundBinding(null);
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
    setSelectedBoundBinding(null);
  };

  const handleMultiFieldConfirm = () => {
    if (multiFieldBindings.length === 0) return;

    // Use the first binding as the primary, with all others in multiFieldBindings
    const primaryBinding = multiFieldBindings[0];
    onBindingComplete(
      selectedPath,
      primaryBinding.path,
      "multi-field", // Special type for multi-field bindings
      template,
      multiFieldBindings
    );

    // Reset all state
    resetSelection();
  };

  const startMultiFieldMode = (e?: React.MouseEvent) => {
    // Stop propagation to prevent the body click handler from deselecting the element
    e?.stopPropagation();
    setMultiFieldMode(true);
    setMultiFieldBindings([]);
    setTemplate("");
  };

  const cancelMultiFieldMode = () => {
    setMultiFieldMode(false);
    setMultiFieldBindings([]);
    setTemplate("");
  };

  const removeMultiField = (index: number) => {
    const field = multiFieldBindings[index];
    setMultiFieldBindings(multiFieldBindings.filter((_, i) => i !== index));
    // Remove from template
    setTemplate(prev => prev.replace(`{${field.alias}}`, "").replace(/\s+/g, " ").trim());
  };

  const updateFieldAlias = (index: number, newAlias: string) => {
    const oldAlias = multiFieldBindings[index].alias;
    const updated = [...multiFieldBindings];
    updated[index] = { ...updated[index], alias: newAlias };
    setMultiFieldBindings(updated);
    // Update template
    setTemplate(prev => prev.replace(`{${oldAlias}}`, `{${newAlias}}`));
  };

  const resetSelection = () => {
    if (selectedElement) {
      removeElementOverlay(selectedElement);
    }
    setSelectedElement(null);
    setSelectedPath("");
    setShowTemplateInput(false);
    setPendingBinding(null);
    setTemplate("");
    setSelectedBoundBinding(null);
    setMultiFieldMode(false);
    setMultiFieldBindings([]);
    setListBindingMode(false);
    setListItemPattern("");
    setPendingListBinding(null);
    setItemSelectionMode(false);
  };

  // List binding handlers
  const handleListBindingConfirm = () => {
    if (!pendingListBinding || !listItemPattern) return;

    console.log("🔵 Creating list binding with:", {
      path: pendingListBinding.path,
      type: pendingListBinding.type,
      listItemPattern,
    });

    onBindingComplete(
      selectedPath,
      pendingListBinding.path,
      pendingListBinding.type,
      undefined, // no template
      undefined, // no multi-field bindings
      {
        isListContainer: true,
        listItemPattern: listItemPattern,
      }
    );

    resetSelection();
  };

  const cancelListBindingMode = () => {
    setListBindingMode(false);
    setListItemPattern("");
    setPendingListBinding(null);
    setItemSelectionMode(false);
  };

  const handleDeleteBinding = () => {
    if (!selectedBoundBinding) return;

    onDeleteBinding(selectedBoundBinding.id);

    // Reset selection
    if (selectedElement) {
      // Update the element to show as unbound now
      applyElementOverlay(selectedElement, false, true, false);
    }
    setSelectedBoundBinding(null);
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
  const renderBindingNode = (node: BindingNode, depth: number = 0, isDisabled: boolean = false) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedPaths.has(node.path);
    const paddingLeft = depth * 12;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 py-1.5 px-2 rounded group ${
            isDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-50 cursor-pointer'
          }`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          {/* Expand/Collapse toggle */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) toggleExpanded(node.path);
              }}
              className={`w-4 h-4 flex items-center justify-center shrink-0 rounded ${
                isDisabled ? '' : 'hover:bg-gray-200'
              }`}
              disabled={isDisabled}
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

          {/* Binding info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <code className="text-xs font-mono truncate flex-1">
              {node.path.split('.').pop()}
            </code>
            <Badge variant="outline" className="text-xs shrink-0">
              {node.type}
            </Badge>
            {!isDisabled && (
              <Button
                size="sm"
                variant="outline"
                className="h-5 px-2 text-xs opacity-0 group-hover:opacity-100 shrink-0 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectBinding(node);
                }}
              >
                Bind
              </Button>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderBindingNode(child, depth + 1, isDisabled))}
          </div>
        )}
      </div>
    );
  };

  // Render flat list item (for search results)
  const renderFlatBindingItem = (binding: BindingNode, isDisabled: boolean = false) => (
    <div
      key={binding.path}
      className={`flex items-center justify-between gap-2 p-2 rounded group ${
        isDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-50 cursor-pointer'
      }`}
    >
      <div className="min-w-0 flex-1">
        <code className="text-xs font-mono block truncate">
          {binding.path}
        </code>
      </div>
      <Badge variant="outline" className="text-xs shrink-0">
        {binding.type}
      </Badge>
      {!isDisabled && (
        <Button
          size="sm"
          variant="outline"
          className="h-5 px-2 text-xs opacity-0 group-hover:opacity-100 shrink-0 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={(e) => {
            e.stopPropagation();
            handleSelectBinding(binding);
          }}
        >
          Bind
        </Button>
      )}
    </div>
  );

  const hoveredInfo = getElementTagInfo(hoveredElement);
  const selectedInfo = getElementTagInfo(selectedElement);
  const hoveredBinding = hoveredElement ? getBindingForElement(hoveredElement) : null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-96" data-element-selector-ui>
      <Card className="shadow-2xl border-2 border-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-sm">Element Binding Mode</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving}
                title={hasUnsavedChanges ? "Save changes to database" : "No changes to save"}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onExit}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Click on any element to select it. <span className="text-red-600">Red borders</span> = already bound
            {hasUnsavedChanges && (
              <span className="ml-2 text-amber-600 font-medium">• Unsaved changes</span>
            )}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Hovered Element Info */}
          {hoveredInfo && !selectedElement && (
            <div className={`border rounded p-2 ${hoveredBinding ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className={`text-xs font-semibold ${hoveredBinding ? 'text-red-700' : 'text-blue-700'}`}>
                {hoveredBinding ? 'Hovering (Bound):' : 'Hovering:'}
              </div>
              <code className="text-xs">
                &lt;{hoveredInfo.tag}
                {hoveredInfo.id && ` id="${hoveredInfo.id}"`}
                {hoveredInfo.classes && ` class="${hoveredInfo.classes}..."`}
                &gt;
              </code>
              {hoveredBinding && (
                <div className="mt-1 text-xs text-red-600">
                  → {hoveredBinding.dataBinding}
                </div>
              )}
            </div>
          )}

          {/* Selected Bound Element - Show binding info and actions */}
          {selectedElement && selectedBoundBinding && (
            <div className="bg-red-50 border border-red-200 rounded p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-red-700">Bound Element Selected</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-600">Element:</div>
                  <code className="text-xs block bg-white rounded p-1 border">
                    &lt;{selectedInfo?.tag}&gt;
                  </code>
                </div>

                {/* Multi-field binding info */}
                {selectedBoundBinding.multiFieldBindings && selectedBoundBinding.multiFieldBindings.length > 0 ? (
                  <>
                    <div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Multi-Field Binding ({selectedBoundBinding.multiFieldBindings.length} fields):
                      </div>
                      <div className="space-y-1 mt-1">
                        {selectedBoundBinding.multiFieldBindings.map((field, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-xs bg-white rounded p-1 border">
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs shrink-0">
                              {field.alias}
                            </Badge>
                            <span className="text-gray-400">=</span>
                            <code className="truncate text-blue-700">{field.path}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedBoundBinding.template && (
                      <div>
                        <div className="text-xs text-gray-600">Template:</div>
                        <code className="text-xs bg-purple-50 px-2 py-1 rounded block">
                          {selectedBoundBinding.template}
                        </code>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-xs text-gray-600">Data Binding:</div>
                      <div className="flex items-center gap-1">
                        <Code className="w-3 h-3 text-blue-600" />
                        <code className="text-xs font-semibold text-blue-700">
                          {selectedBoundBinding.dataBinding}
                        </code>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Type:</div>
                      <Badge variant="outline" className="text-xs">
                        {selectedBoundBinding.dataType}
                      </Badge>
                      {selectedBoundBinding.template && (
                        <Badge variant="outline" className="text-xs ml-1 bg-purple-50">
                          <FileText className="w-3 h-3 mr-1" />
                          Template
                        </Badge>
                      )}
                    </div>

                    {selectedBoundBinding.template && (
                      <div>
                        <div className="text-xs text-gray-600">Template:</div>
                        <code className="text-xs bg-purple-50 px-2 py-1 rounded block">
                          {selectedBoundBinding.template}
                        </code>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-red-200">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setModalBinding(selectedBoundBinding);
                    setModalElement(selectedElement);
                    setShowBindingModal(true);
                  }}
                >
                  <Info className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDeleteBinding}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Selected Unbound Element - Show binding options */}
          {selectedElement && !selectedBoundBinding && !showTemplateInput && !multiFieldMode && (
            <>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Selected Element:</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => startMultiFieldMode(e)}
                    className="h-6 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    Multi-Field
                  </Button>
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

              {/* Instruction banner */}
              <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-blue-700">Select a Schema Field to Bind</div>
                  <p className="text-xs text-blue-600">
                    Choose a data field below to bind to this element. Click "Bind" or re-click the element to deselect.
                  </p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search bindings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>

              <ScrollArea className="h-[220px]">
                {filteredBindings ? (
                  // Flat search results
                  <div className="space-y-1">
                    {filteredBindings.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No bindings found
                      </div>
                    ) : (
                      filteredBindings.map((b) => renderFlatBindingItem(b, false))
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
                      availableBindings.map((binding) => renderBindingNode(binding, 0, false))
                    )}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* Multi-Field Binding Mode - Step 1: Select Fields */}
          {selectedElement && !selectedBoundBinding && multiFieldMode && !showTemplateInput && (
            <div className="space-y-3">
              {/* Header with selected fields panel */}
              <div className="bg-purple-50 border border-purple-200 rounded p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-700">Multi-Field Binding</span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-purple-100">
                    {multiFieldBindings.length} field{multiFieldBindings.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Click on schema fields to select them. Selected fields will be combined into this element.
                </p>

                {/* Selected fields list */}
                {multiFieldBindings.length > 0 && (
                  <div className="space-y-1 mb-2 max-h-[100px] overflow-y-auto">
                    {multiFieldBindings.map((field, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded p-1.5 border text-xs">
                        <Badge variant="outline" className="shrink-0 bg-purple-100 text-purple-700">
                          {field.alias}
                        </Badge>
                        <code className="flex-1 truncate text-blue-700 font-mono">
                          {field.path}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMultiField(index);
                          }}
                          className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-purple-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelMultiFieldMode();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Generate default template and open template modal
                      const defaultTemplate = multiFieldBindings.map(f => `{${f.alias}}`).join(" ");
                      setTemplate(defaultTemplate);
                      setShowTemplateInput(true);
                    }}
                    disabled={multiFieldBindings.length < 1}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Configure Template ({multiFieldBindings.length})
                  </Button>
                </div>
              </div>

              {/* Schema field selection */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search fields to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>

              <ScrollArea className="h-[200px]">
                {filteredBindings ? (
                  <div className="space-y-1">
                    {filteredBindings.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No fields found
                      </div>
                    ) : (
                      filteredBindings.map((binding) => {
                        const isSelected = multiFieldBindings.some(f => f.path === binding.path);
                        return (
                          <div
                            key={binding.path}
                            className={`flex items-center justify-between gap-2 p-2 rounded cursor-pointer group transition-colors ${
                              isSelected
                                ? 'bg-purple-100 border border-purple-300'
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectBinding(binding);
                            }}
                          >
                            <div className="min-w-0 flex-1">
                              <code className={`text-xs font-mono block truncate ${isSelected ? 'text-purple-700' : ''}`}>
                                {binding.path}
                              </code>
                            </div>
                            <Badge variant="outline" className={`text-xs shrink-0 ${isSelected ? 'bg-purple-50' : ''}`}>
                              {binding.type}
                            </Badge>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div>
                    {availableBindings.length === 0 ? (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No fields available
                      </div>
                    ) : (
                      availableBindings.map((binding) => renderBindingNode(binding))
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Multi-Field Template Modal - Step 2: Configure Template */}
          {selectedElement && multiFieldMode && showTemplateInput && multiFieldBindings.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">Configure Template</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateInput(false);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-gray-600">
                Format how the selected fields will be displayed. Use the buttons below or type directly.
              </p>

              {/* Selected fields as clickable badges */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Selected Fields:</div>
                <div className="flex flex-wrap gap-1">
                  {multiFieldBindings.map((field, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplate(prev => prev + (prev && !prev.endsWith(" ") ? " " : "") + `{${field.alias}}`);
                      }}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded text-xs font-mono border border-purple-200 transition-colors"
                      title={`Click to add {${field.alias}} to template\nPath: ${field.path}`}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      {field.alias}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Click a field to add it to the template
                </div>
              </div>

              {/* Alias editing */}
              <div className="space-y-2 pt-2 border-t border-purple-200">
                <div className="text-xs font-medium text-gray-700">Edit Field Aliases:</div>
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {multiFieldBindings.map((field, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Input
                        value={field.alias}
                        onChange={(e) => updateFieldAlias(index, e.target.value)}
                        className="h-6 w-24 text-xs font-mono"
                        placeholder="alias"
                      />
                      <span className="text-gray-400">=</span>
                      <code className="flex-1 truncate text-gray-600">{field.path.split('.').slice(-2).join('.')}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template input */}
              <div className="space-y-2 pt-2 border-t border-purple-200">
                <div className="text-xs font-medium text-gray-700">Template:</div>
                <Input
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="e.g., {value} {unit}"
                  className="text-sm font-mono bg-white"
                />
                <div className="text-xs text-gray-500">
                  Preview: <span className="font-mono bg-white px-1 rounded">{template || "(empty)"}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateInput(false);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMultiFieldConfirm();
                  }}
                  disabled={!template.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Create Binding
                </Button>
              </div>
            </div>
          )}

          {/* List Binding Mode - show indicator in main panel */}
          {selectedElement && listBindingMode && pendingListBinding && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <List className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">List Binding Mode Active</span>
              </div>
              <p className="text-xs text-gray-600">
                Configure the list binding in the panel on the left side of the screen.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelListBindingMode();
                }}
                className="mt-2 w-full"
              >
                Cancel List Binding
              </Button>
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

          {/* Schema Preview when no element selected - greyed out */}
          {!selectedElement && (
            <div className="space-y-3 border-t pt-3">
              <div className="bg-gray-100 border border-gray-200 rounded p-3 text-center">
                <MousePointer className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-600">
                  Select an HTML Element First
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click on any highlighted element on the page to select it for binding
                </p>
              </div>

              {/* Greyed out schema preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 z-10 rounded" />
                <div className="text-xs font-medium text-gray-400 mb-2">Schema Fields (select an element to enable)</div>
                <ScrollArea className="h-[150px] border rounded bg-gray-50">
                  <div className="p-1">
                    {availableBindings.slice(0, 5).map((binding) => renderBindingNode(binding, 0, true))}
                    {availableBindings.length > 5 && (
                      <div className="text-xs text-gray-400 text-center py-2">
                        ... and {availableBindings.length - 5} more fields
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <span className="text-red-500">Red borders</span> = already bound • Press ESC to exit
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Tooltip for Bound Elements - shows on hover when no element selected */}
      {tooltipBinding && tooltipPosition && !selectedElement && !showBindingModal && (
        <div
          className="fixed z-[200]"
          style={{
            left: Math.min(tooltipPosition.x + 12, window.innerWidth - 320),
            top: Math.min(tooltipPosition.y + 12, window.innerHeight - 200),
          }}
          data-element-selector-ui
        >
          <div
            className="bg-gray-900 text-white rounded-lg shadow-xl p-3 max-w-xs cursor-pointer hover:bg-gray-800 transition-colors border border-gray-700 pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalBinding(tooltipBinding);
              setModalElement(hoveredElement);
              setShowBindingModal(true);
              setTooltipBinding(null);
              setTooltipPosition(null);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-red-300">Bound Element</span>
              <span className="text-xs text-gray-400 ml-auto">Click for details →</span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-300">Schema:</div>
              <code className="text-xs text-blue-300 block truncate">
                {tooltipBinding.dataBinding}
              </code>
            </div>
            {tooltipBinding.multiFieldBindings && tooltipBinding.multiFieldBindings.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-300">Multi-Field ({tooltipBinding.multiFieldBindings.length}):</div>
                <div className="text-xs text-purple-300">
                  {tooltipBinding.multiFieldBindings.map(f => f.alias).join(', ')}
                </div>
              </div>
            )}
            {tooltipBinding.template && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-300">Template:</div>
                <code className="text-xs text-purple-300 block truncate">
                  {tooltipBinding.template}
                </code>
              </div>
            )}
            {tooltipBinding.isListContainer && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <Badge variant="outline" className="text-xs bg-purple-900 text-purple-300 border-purple-700">
                  List Container
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Binding Details Modal */}
      {showBindingModal && modalBinding && (
        <div
          className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center"
          onClick={() => setShowBindingModal(false)}
          data-element-selector-ui
        >
          <Card
            className="w-[450px] max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <CardTitle className="text-base">Binding Details</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBindingModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* DOM Path */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Code className="w-3 h-3" />
                  DOM Selector Path
                </div>
                <div className="bg-gray-100 rounded p-2 overflow-x-auto">
                  <code className="text-xs text-gray-800 whitespace-pre-wrap break-all">
                    {modalBinding.path}
                  </code>
                </div>
              </div>

              {/* Element Info */}
              {modalElement && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600">Element</div>
                  <code className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded block">
                    &lt;{modalElement.tagName.toLowerCase()}
                    {modalElement.id && ` id="${modalElement.id}"`}
                    {modalElement.className && ` class="${Array.from(modalElement.classList).slice(0, 3).join(' ')}${modalElement.classList.length > 3 ? '...' : ''}"`}
                    &gt;
                  </code>
                </div>
              )}

              {/* Schema Reference */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Schema Reference
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <code className="text-sm text-blue-700 font-semibold break-all">
                    {modalBinding.dataBinding}
                  </code>
                </div>
              </div>

              {/* Data Type */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-600">Data Type</div>
                <Badge variant="outline" className="text-xs">
                  {modalBinding.dataType}
                </Badge>
              </div>

              {/* Multi-Field Bindings */}
              {modalBinding.multiFieldBindings && modalBinding.multiFieldBindings.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Multi-Field Bindings ({modalBinding.multiFieldBindings.length})
                  </div>
                  <div className="space-y-1 bg-purple-50 rounded p-2">
                    {modalBinding.multiFieldBindings.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 shrink-0">
                          {field.alias}
                        </Badge>
                        <span className="text-gray-400">=</span>
                        <code className="text-purple-700 truncate">{field.path}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template */}
              {modalBinding.template && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Template
                  </div>
                  <div className="bg-purple-50 rounded p-2">
                    <code className="text-sm text-purple-700">
                      {modalBinding.template}
                    </code>
                  </div>
                </div>
              )}

              {/* Conditional Styles */}
              {modalBinding.conditionalStyles && modalBinding.conditionalStyles.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600">
                    Conditional Styles ({modalBinding.conditionalStyles.length})
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    {modalBinding.conditionalStyles.map((style, idx) => (
                      <div key={idx} className="mb-1">
                        Depends on: <code className="text-blue-600">{style.dependsOn}</code>
                        <span className="text-gray-400"> ({style.conditions.length} condition{style.conditions.length !== 1 ? 's' : ''})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Attributes */}
              {modalBinding.conditionalAttributes && modalBinding.conditionalAttributes.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600">
                    Conditional Attributes ({modalBinding.conditionalAttributes.length})
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    {modalBinding.conditionalAttributes.map((attr, idx) => (
                      <div key={idx} className="mb-1">
                        <code className="text-green-600">{attr.attribute}</code> depends on: <code className="text-blue-600">{attr.dependsOn}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowBindingModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    onDeleteBinding(modalBinding.id);
                    setShowBindingModal(false);
                    setModalBinding(null);
                    setModalElement(null);
                  }}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Binding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating List Binding Configuration Panel - Top Left */}
      {listBindingMode && pendingListBinding && (
        <div className="fixed top-4 left-4 z-[100] w-[420px] max-h-[calc(100vh-2rem)] flex flex-col" data-element-selector-ui>
          <Card className="shadow-2xl border-2 border-blue-500 flex flex-col max-h-full overflow-hidden">
            <CardHeader className="pb-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-sm">List/Array Binding</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelListBindingMode}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto flex-1">
              {/* Workflow Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2">
                <div className="text-xs font-semibold text-blue-800">How List Binding Works:</div>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Select a <strong>container element</strong> (e.g., ul, div) that holds repeating items</li>
                  <li>Choose an <strong>array field</strong> from the schema (like <code className="bg-blue-100 px-1 rounded">nearbySchools</code>)</li>
                  <li>Specify the <strong>item selector</strong> pattern for child elements</li>
                  <li>At render time, the container will be populated with one copy of the template per array item</li>
                </ol>
              </div>

              {/* Selected Element Info */}
              {selectedElement && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-700">Selected Container Element:</div>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    &lt;{selectedElement.tagName.toLowerCase()}
                    {selectedElement.id && ` id="${selectedElement.id}"`}
                    {selectedElement.className && ` class="${Array.from(selectedElement.classList).slice(0, 2).join(' ')}..."`}
                    &gt;
                  </code>
                </div>
              )}

              {/* Array Binding Path */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700">Binding Array:</div>
                <div className="bg-blue-100 border border-blue-300 rounded p-2">
                  <code className="text-sm text-blue-800 font-semibold">{pendingListBinding.path}</code>
                  <Badge variant="outline" className="ml-2 text-xs">{pendingListBinding.type}</Badge>
                </div>
                {pendingListBinding.children && pendingListBinding.children.length > 0 && (
                  <div className="text-xs text-gray-600">
                    Each array item has {pendingListBinding.children.length} bindable field(s):
                    <span className="text-blue-600 ml-1">
                      {pendingListBinding.children.slice(0, 3).map(c => c.path.split('.').pop()).join(', ')}
                      {pendingListBinding.children.length > 3 && '...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Item Selector Pattern */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-700">Item Selector Pattern:</div>
                  {selectedElement && !itemSelectionMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItemSelectionMode(true)}
                      className="h-6 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    >
                      <MousePointer className="w-3 h-3 mr-1" />
                      Click to Select
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  CSS selector for the repeating item template within the container. This element will be cloned for each array item.
                </p>

                {/* Item Selection Mode Active */}
                {itemSelectionMode && (
                  <div className="bg-purple-100 border-2 border-purple-400 rounded p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-purple-600 animate-pulse" />
                      <span className="text-xs font-semibold text-purple-800">Item Selection Mode Active</span>
                    </div>
                    <p className="text-xs text-purple-700">
                      Click on any <strong>child element</strong> within the container to use it as the item template.
                      Child elements are highlighted with purple borders.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setItemSelectionMode(false)}
                      className="w-full text-xs"
                    >
                      Cancel Selection
                    </Button>
                  </div>
                )}

                {!itemSelectionMode && (
                  <>
                    <Input
                      value={listItemPattern}
                      onChange={(e) => setListItemPattern(e.target.value)}
                      placeholder="e.g., li, div.item, .school-card"
                      className="text-sm font-mono"
                    />

                    {/* Detected Children */}
                    {selectedElement && (
                      <div className="bg-gray-50 rounded p-2 border">
                        <div className="text-xs text-gray-600 mb-2">Quick select from detected children:</div>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(
                            Array.from(selectedElement.querySelectorAll(':scope > *'))
                              .map(el => {
                                const tag = el.tagName.toLowerCase();
                                const cls = el.className ? `.${Array.from(el.classList).slice(0, 1).join('.')}` : '';
                                return tag + cls;
                              })
                          )).slice(0, 8).map((selector) => (
                            <button
                              key={selector}
                              onClick={() => setListItemPattern(selector)}
                              className={`text-xs px-2 py-1 rounded border transition-colors ${
                                listItemPattern === selector
                                  ? 'bg-blue-500 border-blue-600 text-white'
                                  : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                              }`}
                            >
                              {selector}
                            </button>
                          ))}
                          {Array.from(selectedElement.querySelectorAll(':scope > *')).length === 0 && (
                            <span className="text-xs text-gray-400 italic">No child elements found</span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Next Steps Info */}
              <div className="bg-amber-50 border border-amber-200 rounded p-3 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-amber-800 mb-1">After Creating List Binding:</div>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Click on elements <strong>inside</strong> the item template</li>
                    <li>Select array item fields from the schema tree</li>
                    <li>Optionally add conditional styles based on item properties</li>
                  </ol>
                </div>

                {/* Show available array item fields */}
                {pendingListBinding.children && pendingListBinding.children.length > 0 && (
                  <div className="border-t border-amber-200 pt-2">
                    <div className="text-xs font-semibold text-amber-800 mb-2">Available Item Fields:</div>
                    <div className="flex flex-wrap gap-1">
                      {pendingListBinding.children.map((child) => {
                        const fieldName = child.path.split('.').pop() || child.path;
                        return (
                          <div
                            key={child.path}
                            className="text-xs bg-white border border-amber-300 rounded px-2 py-1"
                            title={`Full path: ${child.path}`}
                          >
                            <code className="text-amber-800">{fieldName}</code>
                            <span className="text-gray-500 ml-1">({child.type.replace(' (nullable)', '')})</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-amber-600 mt-2 italic">
                      These fields will be accessible via paths like: <code className="bg-amber-100 px-1 rounded">{pendingListBinding.path}[0].{pendingListBinding.children[0]?.path.split('.').pop()}</code>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelListBindingMode}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleListBindingConfirm}
                  disabled={!listItemPattern.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Create List Binding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
