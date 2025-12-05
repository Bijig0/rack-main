import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  X,
  AlertCircle,
  Type,
  List,
  Hash,
  ToggleLeft,
  FileText,
  Link2,
  Unlink,
} from "lucide-react";
import { useGetRentalAppraisalSchema, JsonSchema } from "@/hooks/useGetRentalAppraisalSchema";
import { DomBindingMapping, BindableComponentType } from "@/types/domBinding";
import { findBindableElements, getBindableInfo } from "@/utils/domBindingRenderer";

interface SchemaFirstSelectorProps {
  /** Current bindings */
  bindings: DomBindingMapping[];
  /** Callback when bindings change */
  onBindingsChange: (bindings: DomBindingMapping[]) => void;
  /** Whether the panel is in binding mode */
  isActive?: boolean;
  /** Callback when panel active state changes */
  onActiveChange?: (active: boolean) => void;
}

interface SchemaNode {
  path: string;
  name: string;
  type: string;
  description?: string;
  children?: SchemaNode[];
  isArray?: boolean;
  isRequired?: boolean;
}

// Map schema types to compatible bindable component types
const SCHEMA_TO_BINDABLE: Record<string, BindableComponentType[]> = {
  string: ["text"],
  number: ["text"],
  integer: ["text"],
  boolean: ["text"],
  array: ["list"],
  object: ["text"], // Objects can be bound to text with templates
};

// Get icon for schema type
function getTypeIcon(type: string) {
  switch (type) {
    case "string":
      return <Type className="w-3 h-3" />;
    case "number":
    case "integer":
      return <Hash className="w-3 h-3" />;
    case "boolean":
      return <ToggleLeft className="w-3 h-3" />;
    case "array":
      return <List className="w-3 h-3" />;
    case "object":
      return <FileText className="w-3 h-3" />;
    default:
      return <Type className="w-3 h-3" />;
  }
}

// Parse JSON schema into tree structure
function parseSchemaToTree(
  schema: JsonSchema,
  parentPath: string = "",
  parentName: string = ""
): SchemaNode[] {
  const nodes: SchemaNode[] = [];

  if (schema.type === "object" && schema.properties) {
    const required = schema.required || [];

    for (const [key, prop] of Object.entries(schema.properties)) {
      const propSchema = prop as JsonSchema;
      const path = parentPath ? `${parentPath}.${key}` : key;
      const isRequired = required.includes(key);

      const node: SchemaNode = {
        path,
        name: key,
        type: propSchema.type || "unknown",
        description: propSchema.description,
        isRequired,
        isArray: propSchema.type === "array",
      };

      // Recursively parse children
      if (propSchema.type === "object" && propSchema.properties) {
        node.children = parseSchemaToTree(propSchema, path, key);
      } else if (propSchema.type === "array" && propSchema.items) {
        const itemSchema = propSchema.items as JsonSchema;
        if (itemSchema.type === "object" && itemSchema.properties) {
          // For arrays, use [i] placeholder in path
          node.children = parseSchemaToTree(itemSchema, `${path}[i]`, key);
        }
      }

      nodes.push(node);
    }
  }

  return nodes;
}

// Flatten tree for search
function flattenTree(nodes: SchemaNode[]): SchemaNode[] {
  const result: SchemaNode[] = [];

  function traverse(node: SchemaNode) {
    result.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return result;
}

export const SchemaFirstSelector = ({
  bindings,
  onBindingsChange,
  isActive = false,
  onActiveChange,
}: SchemaFirstSelectorProps) => {
  const { data: schema, isLoading, error } = useGetRentalAppraisalSchema();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [selectedSchemaPath, setSelectedSchemaPath] = useState<string | null>(null);
  const [selectedSchemaType, setSelectedSchemaType] = useState<string | null>(null);
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([]);

  // Parse schema into tree
  const schemaTree = useMemo(() => {
    if (!schema) return [];
    return parseSchemaToTree(schema);
  }, [schema]);

  // Flatten for search
  const flatSchema = useMemo(() => flattenTree(schemaTree), [schemaTree]);

  // Get bindings map for quick lookup
  const bindingsMap = useMemo(() => {
    const map = new Map<string, DomBindingMapping>();
    bindings.forEach((b) => map.set(b.dataBinding, b));
    return map;
  }, [bindings]);

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return schemaTree;

    const query = searchQuery.toLowerCase();
    const matchingPaths = new Set<string>();

    flatSchema.forEach((node) => {
      if (
        node.name.toLowerCase().includes(query) ||
        node.path.toLowerCase().includes(query) ||
        node.description?.toLowerCase().includes(query)
      ) {
        matchingPaths.add(node.path);
        // Also add parent paths to keep hierarchy visible
        const parts = node.path.split(".");
        for (let i = 1; i < parts.length; i++) {
          matchingPaths.add(parts.slice(0, i).join("."));
        }
      }
    });

    function filterTree(nodes: SchemaNode[]): SchemaNode[] {
      return nodes
        .filter((n) => matchingPaths.has(n.path))
        .map((n) => ({
          ...n,
          children: n.children ? filterTree(n.children) : undefined,
        }));
    }

    return filterTree(schemaTree);
  }, [schemaTree, flatSchema, searchQuery]);

  // Handle schema field selection
  const handleSelectSchemaField = useCallback(
    (node: SchemaNode) => {
      if (selectedSchemaPath === node.path) {
        // Deselect
        setSelectedSchemaPath(null);
        setSelectedSchemaType(null);
        clearHighlights();
        return;
      }

      setSelectedSchemaPath(node.path);
      setSelectedSchemaType(node.type);

      // Find and highlight compatible bindable elements
      const compatibleTypes = SCHEMA_TO_BINDABLE[node.type] || ["text"];
      const elements: HTMLElement[] = [];

      compatibleTypes.forEach((type) => {
        const found = findBindableElements(type);
        elements.push(...found);
      });

      highlightCompatibleElements(elements);
    },
    [selectedSchemaPath]
  );

  // Highlight compatible elements in the DOM
  const highlightCompatibleElements = useCallback((elements: HTMLElement[]) => {
    // Clear previous highlights
    clearHighlights();

    elements.forEach((el) => {
      el.style.outline = "3px dashed #8b5cf6";
      el.style.outlineOffset = "2px";
      el.style.cursor = "pointer";
      el.setAttribute("data-highlight-for-binding", "true");
    });

    setHighlightedElements(elements);

    // Add click handlers
    elements.forEach((el) => {
      el.addEventListener("click", handleElementClick);
    });
  }, []);

  // Clear highlights
  const clearHighlights = useCallback(() => {
    highlightedElements.forEach((el) => {
      el.style.outline = "";
      el.style.outlineOffset = "";
      el.style.cursor = "";
      el.removeAttribute("data-highlight-for-binding");
      el.removeEventListener("click", handleElementClick);
    });
    setHighlightedElements([]);
  }, [highlightedElements]);

  // Handle clicking on a highlighted element to create binding
  const handleElementClick = useCallback(
    (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const element = e.currentTarget as HTMLElement;
      const info = getBindableInfo(element);

      if (!info || !selectedSchemaPath || !selectedSchemaType) {
        return;
      }

      // Create new binding
      const newBinding: DomBindingMapping = {
        id: `binding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        path: "", // Not using CSS path for new bindings
        bindingId: info.bindingId,
        componentType: info.type,
        dataBinding: selectedSchemaPath,
        dataType: selectedSchemaType,
        isListContainer: info.type === "list",
      };

      onBindingsChange([...bindings, newBinding]);

      // Clear selection and highlights
      setSelectedSchemaPath(null);
      setSelectedSchemaType(null);
      clearHighlights();

      // Flash the element to confirm binding
      element.style.outline = "3px solid #22c55e";
      setTimeout(() => {
        element.style.outline = "";
      }, 1000);
    },
    [selectedSchemaPath, selectedSchemaType, bindings, onBindingsChange, clearHighlights]
  );

  // Remove a binding
  const handleRemoveBinding = useCallback(
    (schemaPath: string) => {
      onBindingsChange(bindings.filter((b) => b.dataBinding !== schemaPath));
    },
    [bindings, onBindingsChange]
  );

  // Toggle expand/collapse
  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHighlights();
    };
  }, []);

  // Render a schema node
  const renderSchemaNode = (node: SchemaNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedPaths.has(node.path);
    const isBound = bindingsMap.has(node.path);
    const isSelected = selectedSchemaPath === node.path;
    const binding = bindingsMap.get(node.path);

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 py-1 px-2 rounded cursor-pointer transition-colors ${
            isSelected
              ? "bg-purple-100 border border-purple-300"
              : isBound
              ? "bg-green-50 hover:bg-green-100"
              : "hover:bg-gray-100"
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleSelectSchemaField(node)}
        >
          {/* Expand/collapse button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.path);
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Type icon */}
          <span
            className={`${
              node.type === "array"
                ? "text-purple-600"
                : node.type === "object"
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            {getTypeIcon(node.type)}
          </span>

          {/* Name */}
          <span className="font-mono text-xs flex-1 truncate">{node.name}</span>

          {/* Bound indicator */}
          {isBound && (
            <Badge variant="outline" className="text-[10px] h-4 px-1 bg-green-100 text-green-700 border-green-300">
              <Link2 className="w-2 h-2 mr-0.5" />
              bound
            </Badge>
          )}

          {/* Required indicator */}
          {node.isRequired && !isBound && (
            <span className="text-red-500 text-[10px]">*</span>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderSchemaNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Stats
  const totalFields = flatSchema.filter(
    (n) => n.type !== "object" || !n.children?.length
  ).length;
  const boundFields = bindings.length;
  const unboundRequired = flatSchema.filter(
    (n) => n.isRequired && !bindingsMap.has(n.path)
  ).length;

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading schema...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="w-5 h-5 mx-auto mb-2" />
        Failed to load schema
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with stats */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Schema Binding</h3>
          <div className="flex gap-2 text-xs">
            <span className="text-green-600">{boundFields} bound</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{totalFields} total</span>
            {unboundRequired > 0 && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-red-600">{unboundRequired} required</span>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search schema fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Selection mode indicator */}
      {selectedSchemaPath && (
        <div className="p-2 bg-purple-50 border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className="text-purple-700 font-medium">
                Click a highlighted element to bind:
              </span>
              <code className="ml-1 bg-purple-100 px-1 rounded text-purple-800">
                {selectedSchemaPath}
              </code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSchemaPath(null);
                setSelectedSchemaType(null);
                clearHighlights();
              }}
              className="h-6 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Schema tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredNodes.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            {searchQuery ? "No matching fields" : "No schema loaded"}
          </div>
        ) : (
          filteredNodes.map((node) => renderSchemaNode(node))
        )}
      </div>

      {/* Instructions */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-500">
        <p>1. Click a schema field to select it</p>
        <p>2. Compatible elements will highlight</p>
        <p>3. Click an element to create binding</p>
      </div>
    </div>
  );
};

export default SchemaFirstSelector;
