import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search, ChevronDown, ChevronRight } from "lucide-react";

// RentalAppraisalData type is inferred from the sample data structure
// This component doesn't need the actual type, just the data structure
type RentalAppraisalData = any;

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
 * Recursively extract all possible binding paths from a type structure
 */
function extractBindingPaths(
  obj: any,
  prefix: string = "state",
  usedBindings: Set<string>
): BindingNode[] {
  const result: BindingNode[] = [];

  // Sample data structure to infer types
  const sampleData: Partial<RentalAppraisalData> = {
    coverPageData: {
      addressCommonName: "",
      reportDate: new Date(),
    },
    propertyInfo: {
      yearBuilt: 0,
      landArea: { value: 0, unit: "m²" },
      floorArea: { value: 0, unit: "m²" },
      frontageWidth: 0,
      propertyType: "",
      council: "",
      nearbySchools: [],
      propertyImage: { url: "", alt: "", isPrimary: false },
      estimatedValue: { low: 0, mid: 0, high: 0, currency: "AUD" },
      distanceFromCBD: { value: 0, unit: "km" },
      similarPropertiesForSale: [],
      similarPropertiesForRent: [],
      appraisalSummary: "",
    },
    planningZoningData: {
      regionalPlan: "",
      landUse: "",
      planningScheme: "",
      zone: "",
      zoneCode: "",
      overlays: [],
      heritageOverlays: [],
      zonePrecinct: "",
      localPlan: "",
      localPlanPrecinct: "",
      localPlanSubprecinct: "",
    },
    environmentalData: {
      easements: {},
      heritage: {},
      character: {},
      floodRisk: {},
      biodiversity: {},
      coastalHazards: {},
      waterways: {},
      wetlands: {},
      bushfireRisk: {},
      steepLand: {},
      noisePollution: {},
      odours: {},
    },
    infrastructureData: {
      sewer: false,
      water: false,
      stormwater: false,
      electricity: false,
      publicTransport: { available: false, distance: 0 },
      shoppingCenter: { available: false, distance: 0 },
      parkAndPlayground: { available: false, distance: 0 },
      emergencyServices: { available: false, distance: 0 },
    },
    locationSuburbData: {
      suburb: "",
      state: "",
      distanceToCBD: 0,
      population: 0,
      populationGrowth: 0,
      occupancyData: { purchaser: 0, renting: 0, other: 0 },
      rentalYieldGrowth: [],
    },
    pricelabsData: {
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
      annualRevenue: 0,
      occupancyRate: 0,
    },
  };

  function traverse(data: any, currentPath: string): BindingNode[] {
    const nodes: BindingNode[] = [];

    if (data === null || data === undefined) {
      return nodes;
    }

    if (Array.isArray(data)) {
      // For arrays, show the array itself and an example item
      const arrayPath = currentPath;
      nodes.push({
        path: arrayPath,
        type: "array",
        isUsed: usedBindings.has(arrayPath),
      });

      if (data.length > 0 || typeof data[0] === "object") {
        const itemPath = `${arrayPath}[0]`;
        const childNodes = traverse(data[0] || {}, itemPath);
        if (childNodes.length > 0) {
          nodes.push(...childNodes);
        }
      }
    } else if (typeof data === "object") {
      for (const key in data) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const value = data[key];

        if (value === null || value === undefined) {
          nodes.push({
            path: newPath,
            type: "null",
            isUsed: usedBindings.has(newPath),
          });
        } else if (Array.isArray(value)) {
          nodes.push(...traverse(value, newPath));
        } else if (typeof value === "object" && !(value instanceof Date)) {
          const childNodes = traverse(value, newPath);
          if (childNodes.length > 0) {
            nodes.push({
              path: newPath,
              type: "object",
              isUsed: usedBindings.has(newPath),
              children: childNodes,
            });
          } else {
            nodes.push({
              path: newPath,
              type: "object",
              isUsed: usedBindings.has(newPath),
            });
          }
        } else {
          const type =
            value instanceof Date
              ? "date"
              : typeof value === "number"
              ? "number"
              : typeof value === "boolean"
              ? "boolean"
              : "string";
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

  return traverse(sampleData, prefix);
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
        let match;
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

  const usedBindings = useMemo(() => {
    return scanForUsedBindings(builderContent);
  }, [builderContent]);

  const allBindings = useMemo(() => {
    return extractBindingPaths({}, "state", usedBindings);
  }, [usedBindings]);

  const filteredBindings = useMemo(() => {
    let filtered = allBindings;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((binding) =>
        binding.path.toLowerCase().includes(query)
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
          {usedCount} of {totalCount} bindings used
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
