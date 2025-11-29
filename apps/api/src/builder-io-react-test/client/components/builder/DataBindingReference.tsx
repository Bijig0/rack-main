import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown, ChevronRight, Search, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetRentalAppraisalSchema, JsonSchema } from "@/hooks/useGetRentalAppraisalSchema";

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

  // Fetch the JSON Schema
  const { data: schema, isLoading: schemaLoading, error: schemaError } = useGetRentalAppraisalSchema();

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

  const renderBindingNode = (node: BindingNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedPaths.has(node.path);

    return (
      <div key={node.path} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer group"
          onClick={() => hasChildren && toggleExpanded(node.path)}
        >
          {hasChildren && (
            <div className="w-4 h-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-4" />}

          {node.isUsed && (
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          )}
          {!node.isUsed && <div className="w-4 h-4 flex-shrink-0" />}

          <code className="text-xs font-mono flex-1">{node.path}</code>

          <Badge variant="outline" className="text-xs">
            {node.type}
          </Badge>
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
      ? "fixed bottom-4 right-4 w-96 max-h-[600px] z-50 shadow-2xl"
      : "";

  return (
    <Card className={positionClasses}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Data Binding Reference</CardTitle>
        <CardDescription>
          {schemaLoading ? (
            "Loading schema..."
          ) : schemaError ? (
            <span className="text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Error loading schema
            </span>
          ) : (
            `${usedCount} of ${totalCount} bindings used`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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

        <ScrollArea className="h-[400px] border rounded-md p-2">
          {filteredBindings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No bindings found
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredBindings.map((binding) => renderBindingNode(binding))}
            </div>
          )}
        </ScrollArea>

        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>
            <strong>Tip:</strong> Use binding syntax like{" "}
            <code className="bg-gray-100 px-1 rounded">
              {"{{state.propertyInfo.yearBuilt}}"}
            </code>{" "}
            in Builder.io text fields
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
