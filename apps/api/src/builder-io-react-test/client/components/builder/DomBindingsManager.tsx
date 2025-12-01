import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  Edit,
  Code,
  Download,
  Upload,
  List,
  Sparkles,
  Info,
  X,
  Eye,
} from "lucide-react";
import { DomBindingMapping } from "@/types/domBinding";

interface DomBindingsManagerProps {
  /** Current DOM bindings */
  bindings: DomBindingMapping[];
  /** Callback when bindings change */
  onChange: (bindings: DomBindingMapping[]) => void;
  /** Callback to edit a binding's conditional styles */
  onEditConditionalStyles: (binding: DomBindingMapping) => void;
}

export const DomBindingsManager = ({
  bindings,
  onChange,
  onEditConditionalStyles,
}: DomBindingsManagerProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewingBinding, setViewingBinding] = useState<DomBindingMapping | null>(null);

  // Helper function to safely check if element exists
  const findElement = useCallback((path: string): HTMLElement | null => {
    try {
      const element = document.querySelector(path) as HTMLElement;
      if (element) {
        console.log('✅ Element found for path:', path);
      } else {
        console.warn('⚠️ Element not found for path:', path);
      }
      return element;
    } catch (error) {
      console.error('❌ Invalid selector path:', path, error);
      return null;
    }
  }, []);

  // Memoize element existence check for viewing binding
  const viewingElementExists = useMemo(() => {
    if (!viewingBinding) return false;
    return !!findElement(viewingBinding.path);
  }, [viewingBinding, findElement]);

  // Highlight element when viewing binding
  useEffect(() => {
    if (!viewingBinding) return;

    const element = findElement(viewingBinding.path);
    if (!element) return;

    // Store original styles
    const originalOutline = element.style.outline;
    const originalOutlineOffset = element.style.outlineOffset;
    const originalZIndex = element.style.zIndex;

    // Apply highlight
    element.style.outline = '4px solid #ef4444';
    element.style.outlineOffset = '4px';
    element.style.zIndex = '9998';

    // Scroll into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return () => {
      // Restore original styles
      element.style.outline = originalOutline;
      element.style.outlineOffset = originalOutlineOffset;
      element.style.zIndex = originalZIndex;
    };
  }, [viewingBinding, findElement]);

  const removeBinding = (id: string) => {
    onChange(bindings.filter((b) => b.id !== id));
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportBindings = () => {
    const json = JSON.stringify(bindings, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dom-bindings.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBindings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const imported = JSON.parse(text);
          onChange(imported);
        } catch (error) {
          alert("Failed to import bindings: Invalid JSON");
        }
      }
    };
    input.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">DOM Bindings</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={importBindings}
              title="Import bindings"
            >
              <Upload className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportBindings}
              title="Export bindings"
              disabled={bindings.length === 0}
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bindings.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            No DOM bindings configured yet. Select a data binding and click
            "Bind to DOM" to get started.
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {bindings.map((binding) => {
                const isExpanded = expandedIds.has(binding.id);
                return (
                  <Card key={binding.id} className="border">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Code className="w-3 h-3 text-blue-600" />
                              <code className="text-xs font-mono font-semibold">
                                {binding.dataBinding}
                              </code>
                              <Badge variant="outline" className="text-xs">
                                {binding.dataType}
                              </Badge>
                              {binding.isListContainer && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50"
                                >
                                  <List className="w-3 h-3 mr-1" />
                                  List
                                </Badge>
                              )}
                              {binding.conditionalStyles &&
                                binding.conditionalStyles.length > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-50"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {binding.conditionalStyles.length} rules
                                  </Badge>
                                )}
                            </div>
                            <div
                              className="text-xs text-gray-600 font-mono cursor-pointer hover:bg-gray-50 p-1 rounded"
                              onClick={() => toggleExpanded(binding.id)}
                            >
                              {isExpanded ? (
                                <div className="break-all">{binding.path}</div>
                              ) : (
                                <div className="truncate">{binding.path}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingBinding(binding)}
                              title="View binding details"
                            >
                              <Info className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditConditionalStyles(binding)}
                              title="Edit conditional styles"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBinding(binding.id)}
                              title="Remove binding"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {binding.conditionalStyles &&
                          binding.conditionalStyles.length > 0 &&
                          isExpanded && (
                            <div className="mt-2 pt-2 border-t">
                              <div className="text-xs font-semibold mb-1">
                                Conditional Styles:
                              </div>
                              {binding.conditionalStyles.map((style, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs bg-amber-50 p-2 rounded mb-1"
                                >
                                  <div className="font-mono">
                                    When{" "}
                                    <code className="bg-white px-1 rounded">
                                      {style.dependsOn}
                                    </code>
                                  </div>
                                  <div className="ml-4 mt-1 space-y-0.5">
                                    {style.conditions.map((cond, cidx) => (
                                      <div key={cidx} className="text-gray-700">
                                        {cond.operator} "{cond.value}" →{" "}
                                        {Object.keys(cond.cssProperties).join(
                                          ", "
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Binding Details Modal */}
      {viewingBinding && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" data-binding-panel>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Binding Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingBinding(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Data Binding */}
              <div>
                <div className="text-xs font-semibold mb-1">Data Binding:</div>
                <code className="text-sm bg-blue-50 border border-blue-200 px-2 py-1 rounded block break-words">
                  {viewingBinding.dataBinding}
                </code>
              </div>

              {/* Data Type */}
              <div>
                <div className="text-xs font-semibold mb-1">Data Type:</div>
                <Badge variant="outline">{viewingBinding.dataType}</Badge>
              </div>

              {/* DOM Path */}
              <div>
                <div className="text-xs font-semibold mb-1 flex items-center gap-2">
                  DOM Element Path:
                  {viewingElementExists ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      <Eye className="w-3 h-3 mr-1" />
                      Element Found & Highlighted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                      ⚠️ Element Not Found
                    </Badge>
                  )}
                </div>
                <code className="text-sm bg-gray-50 border border-gray-200 px-2 py-1 rounded block break-words overflow-wrap-anywhere">
                  {viewingBinding.path}
                </code>
              </div>

              {/* List Container Info */}
              {viewingBinding.isListContainer && (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <List className="w-3 h-3" />
                    List Container:
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded">
                    <div className="text-xs">
                      <span className="font-semibold">Item Pattern:</span>
                      <code className="ml-2 bg-white px-1 rounded text-xs">
                        {viewingBinding.listItemPattern || "N/A"}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Styles */}
              {viewingBinding.conditionalStyles && viewingBinding.conditionalStyles.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Conditional Styles ({viewingBinding.conditionalStyles.length}):
                  </div>
                  <div className="space-y-2">
                    {viewingBinding.conditionalStyles.map((style, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50 border border-amber-200 p-3 rounded"
                      >
                        <div className="text-xs font-semibold mb-2">
                          Depends on:{" "}
                          <code className="bg-white px-1 rounded">
                            {style.dependsOn}
                          </code>
                        </div>
                        <div className="space-y-1">
                          {style.conditions.map((cond, cidx) => (
                            <div
                              key={cidx}
                              className="text-xs bg-white p-2 rounded"
                            >
                              <div className="font-semibold mb-1">
                                Condition: {cond.operator} "{cond.value}"
                              </div>
                              <div className="text-gray-700">
                                <span className="font-semibold">Apply CSS:</span>
                                <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(cond.cssProperties, null, 2)}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewingBinding(null);
                    onEditConditionalStyles(viewingBinding);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Edit Conditional Styles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    removeBinding(viewingBinding.id);
                    setViewingBinding(null);
                  }}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Remove Binding
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};
