import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronRight, Search, AlertCircle, Edit3, Link2, FileCode, Eye, EyeOff } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useGetRentalAppraisalSchema, JsonSchema } from "@/hooks/useGetRentalAppraisalSchema";
import { DomBindingMapping, ConditionalStyle } from "@/types/domBinding";
import { DomElementSelector } from "./DomElementSelector";
import { ListBindingSelector } from "./ListBindingSelector";
import { ConditionalStyleEditor } from "./ConditionalStyleEditor";
import { DomBindingsManager } from "./DomBindingsManager";
import { BindingVisualIndicators } from "./BindingVisualIndicators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataBindingReferenceProps {
  /**
   * The Builder.io content to scan for used bindings
   * Pass the content from Builder's context
   */
  builderContent?: any;

  /**
   * Hide the component (useful for production)
   */
  hidden?: boolean;

  /**
   * Position in the editor (default: fixed bottom-right)
   */
  position?: "fixed" | "static" | "relative";
}

interface BindingNode {
  path: string;
  type: string;
  isUsed: boolean;
  children?: BindingNode[];
}

/**
 * Extract all possible binding paths from JSON Schema
 */
function extractBindingPathsFromSchema(
  schema: JsonSchema | undefined,
  prefix: string = "state",
  usedBindings: Set<string>,
): BindingNode[] {
  if (!schema || !schema.properties) {
    return [];
  }

  function traverse(
    currentSchema: JsonSchema,
    currentPath: string
  ): BindingNode[] {
    const nodes: BindingNode[] = [];

    if (currentSchema.type === "array" && currentSchema.items) {
      // For arrays, show the array itself and example item access
      nodes.push({
        path: currentPath,
        type: "array",
        isUsed: usedBindings.has(currentPath),
      });

      // Show first item access pattern
      const itemPath = `${currentPath}[0]`;
      const childNodes = traverse(currentSchema.items, itemPath);
      nodes.push(...childNodes);
    } else if (currentSchema.type === "object" && currentSchema.properties) {
      // Traverse object properties
      for (const [key, propSchema] of Object.entries(currentSchema.properties)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        if (propSchema.type === "array" && propSchema.items) {
          nodes.push(...traverse(propSchema, newPath));
        } else if (propSchema.type === "object" && propSchema.properties) {
          const childNodes = traverse(propSchema, newPath);
          if (childNodes.length > 0) {
            nodes.push({
              path: newPath,
              type: propSchema.nullable ? "object (nullable)" : "object",
              isUsed: usedBindings.has(newPath),
              children: childNodes,
            });
          } else {
            nodes.push({
              path: newPath,
              type: propSchema.nullable ? "object (nullable)" : "object",
              isUsed: usedBindings.has(newPath),
            });
          }
        } else {
          // Primitive type
          const type = propSchema.nullable
            ? `${propSchema.type} (nullable)`
            : propSchema.type || "unknown";
          nodes.push({
            path: newPath,
            type,
            isUsed: usedBindings.has(newPath),
          });
        }
      }
    }

    return nodes;
  }

  return traverse(schema, prefix);
}

/**
 * Scan Builder.io content for used bindings
 */
function scanForUsedBindings(content: any): Set<string> {
  const usedBindings = new Set<string>();

  function scanObject(obj: any) {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      const value = obj[key];

      // Check for binding syntax: {{state.xxx}}
      if (typeof value === "string") {
        const bindingRegex = /\{\{(state\.[^\}]+)\}\}/g;
        let match: RegExpExecArray | null;
        while ((match = bindingRegex.exec(value)) !== null) {
          usedBindings.add(match[1]);
        }
      }

      // Recursively scan nested objects and arrays
      if (typeof value === "object") {
        scanObject(value);
      }
    }
  }

  scanObject(content);
  return usedBindings;
}

export const DataBindingReference = ({
  builderContent,
  hidden = false,
  position = "fixed",
}: DataBindingReferenceProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [markedPath, setMarkedPath] = useState<string | null>(null);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [domBindings, setDomBindings] = useState<DomBindingMapping[]>([]);
  const [selectingBinding, setSelectingBinding] = useState<{
    path: string;
    type: string;
  } | null>(null);
  const [editingConditionalStyles, setEditingConditionalStyles] = useState<DomBindingMapping | null>(null);
  const [activeTab, setActiveTab] = useState<"reference" | "bindings">("reference");
  const [showVisualIndicators, setShowVisualIndicators] = useState(false);

  // Resize state
  const [panelWidth, setPanelWidth] = useState(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef({ startX: 0, startWidth: 0 });

  // Fetch the JSON Schema
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useGetRentalAppraisalSchema();

  const isDevelopment = import.meta.env.DEV;

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate the delta from start position
      const deltaX = resizeStartRef.current.startX - e.clientX; // Drag left (wider) = negative delta, drag right (narrower) = positive delta
      const newWidth = resizeStartRef.current.startWidth + deltaX;

      // Constrain between 300px and 90vw
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.9;
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      setPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeStartRef.current = {
      startX: e.clientX,
      startWidth: panelWidth,
    };
    setIsResizing(true);
  };

  const usedBindings = useMemo(() => {
    return scanForUsedBindings(builderContent);
  }, [builderContent]);

  const allBindings = useMemo(() => {
    if (!schema) return [];
    return extractBindingPathsFromSchema(schema, "state", usedBindings);
  }, [schema, usedBindings]);

  const filteredBindings = useMemo(() => {
    let filtered = allBindings;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((binding) =>
        binding.path.toLowerCase().includes(query),
      );
    }

    // Filter by used/unused
    if (showOnlyUsed) {
      filtered = filtered.filter((binding) => binding.isUsed);
    }

    return filtered;
  }, [allBindings, searchQuery, showOnlyUsed]);

  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleMarkBinding = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMarkedPath(markedPath === path ? null : path);

    // Copy to clipboard
    navigator.clipboard.writeText(`{{${path}}}`).catch(console.error);
  };

  const handleBindToDom = (path: string, type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectingBinding({ path, type });
  };

  const handleDomElementSelected = (domPath: string, element: HTMLElement) => {
    if (!selectingBinding) return;

    const newBinding: DomBindingMapping = {
      id: `${Date.now()}-${Math.random()}`,
      path: domPath,
      dataBinding: selectingBinding.path,
      dataType: selectingBinding.type,
      conditionalStyles: [],
    };

    setDomBindings([...domBindings, newBinding]);
    setSelectingBinding(null);
    setActiveTab("bindings");
  };

  const handleListBindingComplete = (containerPath: string, childPath: string) => {
    if (!selectingBinding) return;

    const newBinding: DomBindingMapping = {
      id: `${Date.now()}-${Math.random()}`,
      path: containerPath,
      dataBinding: selectingBinding.path,
      dataType: selectingBinding.type,
      isListContainer: true,
      listItemPattern: childPath,
      conditionalStyles: [],
    };

    setDomBindings([...domBindings, newBinding]);
    setSelectingBinding(null);
    setActiveTab("bindings");
  };

  const handleEditConditionalStyles = (binding: DomBindingMapping) => {
    setEditingConditionalStyles(binding);
  };

  const handleConditionalStylesChange = (styles: ConditionalStyle[]) => {
    if (!editingConditionalStyles) return;

    setDomBindings(
      domBindings.map((b) =>
        b.id === editingConditionalStyles.id
          ? { ...b, conditionalStyles: styles }
          : b
      )
    );

    setEditingConditionalStyles({
      ...editingConditionalStyles,
      conditionalStyles: styles,
    });
  };

  const renderBindingNode = (node: BindingNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedPaths.has(node.path);
    const isMarked = markedPath === node.path;
    const isArray = node.type === "array";
    const alreadyBound = domBindings.some((b) => b.dataBinding === node.path);

    return (
      <div key={node.path} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded group overflow-x-auto ${
            isMarked ? "border-2 border-red-500 bg-red-50" : ""
          } ${!editMode ? "cursor-pointer" : ""}`}
          onClick={(e) => !editMode && handleMarkBinding(node.path, e)}
        >
          {hasChildren && (
            <div
              className="w-4 h-4 flex items-center justify-center cursor-pointer flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.path);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-4 flex-shrink-0" />}

          {node.isUsed && (
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          )}
          {!node.isUsed && <div className="w-4 h-4 flex-shrink-0" />}

          <code className={`text-xs font-mono flex-1 min-w-0 ${isMarked ? "font-bold text-red-700" : ""}`}>
            {node.path}
          </code>

          <Badge variant="outline" className="text-xs flex-shrink-0">
            {node.type}
          </Badge>

          {editMode && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs flex-shrink-0 ml-auto"
              onClick={(e) => handleBindToDom(node.path, node.type, e)}
              disabled={alreadyBound}
            >
              <Link2 className="w-3 h-3 mr-1" />
              {alreadyBound ? "Bound" : "Bind"}
            </Button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderBindingNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const usedCount = allBindings.filter((b) => b.isUsed).length;
  const totalCount = allBindings.length;

  if (hidden) return null;

  const positionClasses =
    position === "fixed"
      ? "fixed bottom-4 right-4 max-h-[600px] z-50"
      : "";

  const panelStyle: React.CSSProperties = position === "fixed"
    ? { width: `${panelWidth}px` }
    : {};

  return (
    <>
      <div
        ref={panelRef}
        className={positionClasses}
        style={panelStyle}
      >
        {/* Resize handle */}
        {position === "fixed" && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1 hover:w-2 cursor-ew-resize bg-transparent hover:bg-blue-500 transition-all z-[60]"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          />
        )}
        <Card className="h-full w-full shadow-2xl overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Data Binding Reference</CardTitle>
              <CardDescription>
                {schemaLoading ? (
                  "Loading schema..."
                ) : schemaError ? (
                  <div className="space-y-1">
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Fetching failed
                    </span>
                    {isDevelopment && schema && (
                      <span className="text-amber-600 text-xs">
                        Using sample schema (dev mode)
                      </span>
                    )}
                  </div>
                ) : (
                  `${usedCount} of ${totalCount} bindings used`
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {domBindings.length > 0 && (
                <Button
                  variant={showVisualIndicators ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowVisualIndicators(!showVisualIndicators)}
                  title="Toggle visual binding indicators"
                >
                  {showVisualIndicators ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <>
                    <FileCode className="w-4 h-4 mr-2" />
                    Exit Edit
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reference">Reference</TabsTrigger>
              <TabsTrigger value="bindings">
                DOM Bindings ({domBindings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reference" className="space-y-3 mt-3">
        {markedPath && (
          <div className="border-2 border-red-500 bg-red-50 rounded-md p-3">
            <div className="text-xs font-semibold text-red-700 mb-1">
              Selected Binding (copied to clipboard)
            </div>
            <code className="text-sm font-mono text-red-900 break-all">
              {`{{${markedPath}}}`}
            </code>
            <button
              onClick={() => setMarkedPath(null)}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search bindings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="show-only-used"
            checked={showOnlyUsed}
            onCheckedChange={(checked) => setShowOnlyUsed(checked === true)}
          />
          <label
            htmlFor="show-only-used"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Show only used bindings
          </label>
        </div>

        <div className="h-[400px] border rounded-md overflow-y-auto overflow-x-hidden">
          <div className="p-2">
            {filteredBindings.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No bindings found
              </p>
            ) : (
              <div className="space-y-0.5">
                {filteredBindings.map((binding) => renderBindingNode(binding))}
              </div>
            )}
          </div>
        </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>
                  <strong>Tip:</strong>{" "}
                  {editMode
                    ? "Hover over bindings and click 'Bind' to map them to DOM elements"
                    : "Click any binding to copy it to clipboard with"}{" "}
                  {!editMode && (
                    <code className="bg-gray-100 px-1 rounded">
                      {"{{}}"}
                    </code>
                  )}
                  {!editMode && " syntax for Builder.io"}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="bindings" className="mt-3">
              <DomBindingsManager
                bindings={domBindings}
                onChange={setDomBindings}
                onEditConditionalStyles={handleEditConditionalStyles}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>

      {/* DOM Element Selector Overlay */}
      {selectingBinding && selectingBinding.type !== "array" && (
        <DomElementSelector
          dataType={selectingBinding.type}
          dataBinding={selectingBinding.path}
          onSelect={handleDomElementSelected}
          onCancel={() => setSelectingBinding(null)}
        />
      )}

      {/* List Binding Selector Overlay */}
      {selectingBinding && selectingBinding.type === "array" && (
        <ListBindingSelector
          dataBinding={selectingBinding.path}
          itemType="object"
          onComplete={handleListBindingComplete}
          onCancel={() => setSelectingBinding(null)}
        />
      )}

      {/* Conditional Style Editor Modal */}
      {editingConditionalStyles && (
        <ConditionalStyleEditor
          availableBindings={allBindings.map((b) => ({
            path: b.path,
            type: b.type,
          }))}
          conditionalStyles={editingConditionalStyles.conditionalStyles || []}
          onChange={handleConditionalStylesChange}
          onClose={() => setEditingConditionalStyles(null)}
        />
      )}

      {/* Visual Binding Indicators */}
      <BindingVisualIndicators
        bindings={domBindings}
        enabled={showVisualIndicators}
      />
    </>
  );
};
