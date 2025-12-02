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
import { Check, ChevronDown, ChevronRight, Search, AlertCircle, Edit3, Link2, FileCode, Eye, EyeOff, AlertTriangle, Download, Upload, X, Minimize2, Maximize2 } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useGetRentalAppraisalSchema, JsonSchema } from "@/hooks/useGetRentalAppraisalSchema";
import { useFetchDomBindings, useSaveDomBindings } from "@/hooks/useDomBindingsApi";
import { DomBindingMapping, ConditionalStyle } from "@/types/domBinding";
import { DomElementSelector } from "./DomElementSelector";
import { ListBindingSelector } from "./ListBindingSelector";
import { ConditionalStyleEditor } from "./ConditionalStyleEditor";
import { DomBindingsManager } from "./DomBindingsManager";
import { BindingVisualIndicators } from "./BindingVisualIndicators";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Path to store DOM bindings
const BINDINGS_FILE_PATH = "./dom-bindings.json";

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
 * Unwrap anyOf/oneOf to get the actual schema (handles nullable patterns)
 * Returns the non-null schema from anyOf/oneOf arrays
 */
function unwrapNullableSchema(schema: JsonSchema): { schema: JsonSchema; isNullable: boolean } {
  // Handle anyOf pattern: [{ type: "object", ... }, { type: "null" }]
  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const nonNullSchema = schema.anyOf.find(
      (s: JsonSchema) => s.type !== "null" && !(Array.isArray(s.type) && s.type.includes("null"))
    );
    if (nonNullSchema) {
      return { schema: nonNullSchema, isNullable: true };
    }
  }

  // Handle oneOf pattern similarly
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const nonNullSchema = schema.oneOf.find(
      (s: JsonSchema) => s.type !== "null" && !(Array.isArray(s.type) && s.type.includes("null"))
    );
    if (nonNullSchema) {
      return { schema: nonNullSchema, isNullable: true };
    }
  }

  // Handle type: ["string", "null"] pattern
  if (Array.isArray(schema.type) && schema.type.includes("null")) {
    const nonNullType = schema.type.find((t: string) => t !== "null");
    return {
      schema: { ...schema, type: nonNullType },
      isNullable: true,
    };
  }

  return { schema, isNullable: schema.nullable === true };
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

    // Unwrap nullable patterns (anyOf, oneOf, type arrays)
    const { schema: unwrappedSchema, isNullable } = unwrapNullableSchema(currentSchema);

    if (unwrappedSchema.type === "array" && unwrappedSchema.items) {
      // For arrays, show the array itself and example item access
      nodes.push({
        path: currentPath,
        type: isNullable ? "array (nullable)" : "array",
        isUsed: usedBindings.has(currentPath),
      });

      // Unwrap items schema too (in case items use anyOf)
      const { schema: itemSchema } = unwrapNullableSchema(unwrappedSchema.items);

      // Show first item access pattern
      const itemPath = `${currentPath}[0]`;
      const childNodes = traverse(itemSchema, itemPath);
      nodes.push(...childNodes);
    } else if (unwrappedSchema.type === "object" && unwrappedSchema.properties) {
      // Traverse object properties
      for (const [key, propSchema] of Object.entries(unwrappedSchema.properties)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        // Unwrap the property schema
        const { schema: unwrappedPropSchema, isNullable: propIsNullable } = unwrapNullableSchema(propSchema);

        if (unwrappedPropSchema.type === "array" && unwrappedPropSchema.items) {
          nodes.push(...traverse(propSchema, newPath));
        } else if (unwrappedPropSchema.type === "object" && unwrappedPropSchema.properties) {
          const childNodes = traverse(unwrappedPropSchema, newPath);
          if (childNodes.length > 0) {
            nodes.push({
              path: newPath,
              type: propIsNullable ? "object (nullable)" : "object",
              isUsed: usedBindings.has(newPath),
              children: childNodes,
            });
          } else {
            nodes.push({
              path: newPath,
              type: propIsNullable ? "object (nullable)" : "object",
              isUsed: usedBindings.has(newPath),
            });
          }
        } else {
          // Primitive type
          const type = propIsNullable
            ? `${unwrappedPropSchema.type} (nullable)`
            : unwrappedPropSchema.type || "unknown";
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

  // React Query hooks for database operations
  const { data: savedBindings = [], isLoading: isLoadingBindings, error: bindingsError } = useFetchDomBindings();
  const saveMutation = useSaveDomBindings();

  // Local state for unsaved changes (dirty state)
  const [localBindings, setLocalBindings] = useState<DomBindingMapping[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Sync localBindings with saved data from database
  useEffect(() => {
    setLocalBindings(savedBindings);
    setIsDirty(false);
  }, [savedBindings]);

  // Track when local bindings differ from saved
  useEffect(() => {
    const hasChanges = JSON.stringify(localBindings) !== JSON.stringify(savedBindings);
    setIsDirty(hasChanges);
  }, [localBindings, savedBindings]);

  const [selectingBinding, setSelectingBinding] = useState<{
    path: string;
    type: string;
  } | null>(null);
  const [editingConditionalStyles, setEditingConditionalStyles] = useState<DomBindingMapping | null>(null);
  const [activeTab, setActiveTab] = useState<"reference" | "bindings">("reference");
  const [showVisualIndicators, setShowVisualIndicators] = useState(false);
  const [incompatibilities, setIncompatibilities] = useState<string[]>([]);
  const [showIncompatibilityModal, setShowIncompatibilityModal] = useState(false);

  // Resize state
  const [panelWidth, setPanelWidth] = useState(512); // ~33% larger than original 384px
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
    return extractBindingPathsFromSchema(schema, "", usedBindings);
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

  // Get all valid paths from current schema
  const validSchemaPaths = useMemo(() => {
    const paths = new Set<string>();
    const collectPaths = (bindings: BindingNode[]) => {
      bindings.forEach((binding) => {
        paths.add(binding.path);
        if (binding.children) {
          collectPaths(binding.children);
        }
      });
    };
    collectPaths(allBindings);
    return paths;
  }, [allBindings]);

  // Save bindings to file
  const saveBindings = async (bindings: DomBindingMapping[]) => {
    try {
      const json = JSON.stringify(bindings, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dom-bindings.json";
      a.click();
      URL.revokeObjectURL(url);
      console.log("✅ Bindings saved successfully");
    } catch (error) {
      console.error("❌ Failed to save bindings:", error);
    }
  };

  // Load bindings from file
  const loadBindings = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          try {
            const loaded = JSON.parse(text) as DomBindingMapping[];
            setLocalBindings(loaded);

            // Check for incompatibilities
            const issues: string[] = [];
            loaded.forEach((binding) => {
              if (!validSchemaPaths.has(binding.dataBinding)) {
                issues.push(binding.dataBinding);
              }
            });

            if (issues.length > 0) {
              setIncompatibilities(issues);
              setShowIncompatibilityModal(true);
            }

            console.log("✅ Bindings loaded successfully");
          } catch (error) {
            alert("Failed to parse bindings file: Invalid JSON");
          }
        }
      };
      input.click();
    } catch (error) {
      console.error("❌ Failed to load bindings:", error);
    }
  };

  // Manual save function
  const handleSaveChanges = () => {
    console.log("💾 Saving bindings to database...");
    saveMutation.mutate(localBindings);
  };

  // Check for incompatibilities when bindings are loaded
  useEffect(() => {
    if (savedBindings.length > 0 && schema) {
      const issues: string[] = [];
      savedBindings.forEach((binding: DomBindingMapping) => {
        if (!validSchemaPaths.has(binding.dataBinding)) {
          issues.push(binding.dataBinding);
        }
      });

      if (issues.length > 0) {
        setIncompatibilities(issues);
        setShowIncompatibilityModal(true);
      }
    }
  }, [savedBindings, schema, validSchemaPaths]);

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

    setLocalBindings([...localBindings, newBinding]);
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

    setLocalBindings([...localBindings, newBinding]);
    setSelectingBinding(null);
    setActiveTab("bindings");
  };

  const handleEditConditionalStyles = (binding: DomBindingMapping) => {
    setEditingConditionalStyles(binding);
  };

  const handleConditionalStylesChange = (styles: ConditionalStyle[]) => {
    if (!editingConditionalStyles) return;

    setLocalBindings(
      localBindings.map((b) =>
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
    const alreadyBound = localBindings.some((b) => b.dataBinding === node.path);

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
      ? "fixed bottom-4 right-4 z-50"
      : "";

  const panelStyle: React.CSSProperties = position === "fixed"
    ? { width: isMinimized ? "auto" : `${panelWidth}px` }
    : {};

  // Minimized view - just a small tab
  if (isMinimized) {
    return (
      <div
        className={positionClasses}
        style={panelStyle}
        data-binding-panel
      >
        <Card className="shadow-2xl">
          <CardHeader className="p-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Data Bindings</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinimized(false)}
                title="Expand panel"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div
        ref={panelRef}
        className={`${positionClasses} max-h-[600px]`}
        style={panelStyle}
        data-binding-panel
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
              {localBindings.length > 0 && (
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
                variant="default"
                size="sm"
                onClick={handleSaveChanges}
                disabled={!isDirty || saveMutation.isPending}
                title={isDirty ? "Save changes to database" : "No changes to save"}
              >
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinimized(true)}
                title="Minimize panel"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reference">Reference</TabsTrigger>
              <TabsTrigger value="bindings">
                {isLoadingBindings ? "Loading..." : `DOM Bindings (${localBindings.length})`}
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
              <div className="space-y-3">
                {/* Save/Load Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveBindings(localBindings)}
                    disabled={localBindings.length === 0}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Export Bindings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadBindings}
                    className="flex-1"
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    Load Bindings
                  </Button>
                </div>

                <DomBindingsManager
                  bindings={localBindings}
                  onChange={setLocalBindings}
                  onEditConditionalStyles={handleEditConditionalStyles}
                />
              </div>
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
        bindings={localBindings}
        enabled={showVisualIndicators || editMode}
      />

      {/* Incompatibility Warning Modal */}
      {showIncompatibilityModal && (
        <div className="fixed inset-0 bg-black/50 z-[300] flex items-center justify-center p-4" data-binding-panel>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">Schema Incompatibilities Detected</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIncompatibilityModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-700">
                The following data bindings exist in your saved DOM bindings but are not present in the current schema. This may cause runtime errors.
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-xs font-semibold mb-2 text-amber-900">Missing Bindings:</div>
                <div className="space-y-1">
                  {incompatibilities.map((binding, idx) => (
                    <div key={idx} className="text-xs font-mono bg-white px-2 py-1 rounded border border-amber-300 text-amber-900">
                      {binding}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Possible solutions:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Update your schema to include these bindings</li>
                  <li>Remove the incompatible bindings from your DOM bindings</li>
                  <li>Verify that you're using the correct schema version</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Remove incompatible bindings
                    const filtered = localBindings.filter(
                      (b) => !incompatibilities.includes(b.dataBinding)
                    );
                    setLocalBindings(filtered);
                    setShowIncompatibilityModal(false);
                  }}
                  className="flex-1 text-amber-700 hover:text-amber-800"
                >
                  Remove Incompatible Bindings
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowIncompatibilityModal(false)}
                  className="flex-1"
                >
                  Keep All & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
