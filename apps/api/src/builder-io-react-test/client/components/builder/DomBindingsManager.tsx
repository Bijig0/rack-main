import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DomBindingMapping } from "@/types/domBinding";
import {
  Code,
  Download,
  Edit,
  Eye,
  FileText,
  Info,
  Layers,
  List,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [viewingBinding, setViewingBinding] =
    useState<DomBindingMapping | null>(null);

  // State for editing list item pattern
  const [editingListItemPattern, setEditingListItemPattern] = useState(false);
  const [listItemPatternValue, setListItemPatternValue] = useState("");

  // Helper function to safely check if element exists
  const findElement = useCallback((path: string): HTMLElement | null => {
    try {
      const element = document.querySelector(path) as HTMLElement;
      if (element) {
        console.log("✅ Element found for path:", path);
      } else {
        console.warn("⚠️ Element not found for path:", path);
      }
      return element;
    } catch (error) {
      console.error("❌ Invalid selector path:", path, error);
      return null;
    }
  }, []);

  // Memoize element existence check for viewing binding
  const viewingElementExists = useMemo(() => {
    if (!viewingBinding) return false;
    return !!findElement(viewingBinding.path);
  }, [viewingBinding, findElement]);

  // Reset editing state when viewing binding changes
  useEffect(() => {
    setEditingListItemPattern(false);
    setListItemPatternValue("");
  }, [viewingBinding?.id]);

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
    element.style.outline = "4px solid #ef4444";
    element.style.outlineOffset = "4px";
    element.style.zIndex = "9998";

    // Scroll into view
    element.scrollIntoView({ behavior: "smooth", block: "center" });

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

  // Start editing the list item pattern
  const startEditingListItemPattern = () => {
    if (viewingBinding?.listItemPattern) {
      setListItemPatternValue(viewingBinding.listItemPattern);
    } else {
      setListItemPatternValue("");
    }
    setEditingListItemPattern(true);
  };

  // Save the updated list item pattern
  const saveListItemPattern = () => {
    if (!viewingBinding) return;

    const updatedBindings = bindings.map((b) =>
      b.id === viewingBinding.id
        ? { ...b, listItemPattern: listItemPatternValue || undefined }
        : b
    );
    onChange(updatedBindings);

    // Update the viewing binding to reflect the change
    setViewingBinding({
      ...viewingBinding,
      listItemPattern: listItemPatternValue || undefined,
    });

    setEditingListItemPattern(false);
  };

  // Cancel editing
  const cancelEditingListItemPattern = () => {
    setEditingListItemPattern(false);
    setListItemPatternValue("");
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
                  <Card key={binding.id} className="border overflow-hidden">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 overflow-hidden" style={{ flex: '1 1 0%' }}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Code className="w-3 h-3 text-blue-600 shrink-0" />
                              <code className="text-xs font-mono font-semibold">
                                {binding.dataBinding}
                              </code>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {binding.dataType}
                              </Badge>
                              {binding.isListContainer && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 shrink-0"
                                >
                                  <List className="w-3 h-3 mr-1" />
                                  List
                                </Badge>
                              )}
                              {binding.multiFieldBindings && binding.multiFieldBindings.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 shrink-0"
                                  title={`Multi-field: ${binding.multiFieldBindings.map(f => f.alias).join(', ')}`}
                                >
                                  <Layers className="w-3 h-3 mr-1" />
                                  {binding.multiFieldBindings.length} fields
                                </Badge>
                              )}
                              {binding.template && !binding.multiFieldBindings && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-purple-50 shrink-0"
                                  title={`Template: ${binding.template}`}
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  Template
                                </Badge>
                              )}
                              {binding.conditionalStyles &&
                                binding.conditionalStyles.length > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-50 shrink-0"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {binding.conditionalStyles.length} rules
                                  </Badge>
                                )}
                            </div>
                            <div
                              className="text-xs text-gray-600 font-mono cursor-pointer hover:bg-gray-50 p-1 rounded"
                              onClick={() => toggleExpanded(binding.id)}
                              title={binding.path}
                            >
                              {isExpanded ? (
                                <div className="break-all">{binding.path}</div>
                              ) : (
                                <div>
                                  {binding.path.length > 40
                                    ? `${binding.path.slice(0, 40)}...`
                                    : binding.path}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2 shrink-0">
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
                                          ", ",
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
        <div
          className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
          data-binding-panel
        >
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
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-300"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Element Found & Highlighted
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-300"
                    >
                      ⚠️ Element Not Found
                    </Badge>
                  )}
                </div>
                <code className="text-sm bg-gray-50 border border-gray-200 px-2 py-1 rounded block break-words overflow-wrap-anywhere">
                  {viewingBinding.path}
                </code>
              </div>

              {/* Multi-Field Bindings Info */}
              {viewingBinding.multiFieldBindings && viewingBinding.multiFieldBindings.length > 0 && (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Multi-Field Binding ({viewingBinding.multiFieldBindings.length} fields):
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded space-y-2">
                    <div className="space-y-1">
                      {viewingBinding.multiFieldBindings.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs bg-white rounded p-1.5 border">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 shrink-0">
                            {field.alias}
                          </Badge>
                          <span className="text-gray-400">=</span>
                          <code className="flex-1 truncate text-blue-700 font-mono">
                            {field.path}
                          </code>
                        </div>
                      ))}
                    </div>
                    {viewingBinding.template && (
                      <div className="pt-2 border-t border-purple-200">
                        <div className="text-xs text-gray-600 mb-1">Template:</div>
                        <code className="text-sm font-mono bg-white px-2 py-1 rounded block">
                          {viewingBinding.template}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Template Info (for single-object templates only) */}
              {viewingBinding.template && !viewingBinding.multiFieldBindings && (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Template:
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded">
                    <code className="text-sm font-mono">
                      {viewingBinding.template}
                    </code>
                    <div className="text-xs text-gray-600 mt-1">
                      Object properties will be formatted using this template
                    </div>
                  </div>
                </div>
              )}

              {/* List Container Info */}
              {viewingBinding.isListContainer && (
                <div>
                  <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                    <List className="w-3 h-3" />
                    List Container Configuration:
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded space-y-3">
                    {/* Item Selector Pattern */}
                    <div>
                      <div className="text-xs font-semibold text-purple-800 mb-1 flex items-center justify-between">
                        <span>Item Selector Pattern:</span>
                        {!editingListItemPattern && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={startEditingListItemPattern}
                            className="h-6 px-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                      {editingListItemPattern ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={listItemPatternValue}
                            onChange={(e) => setListItemPatternValue(e.target.value)}
                            placeholder="e.g., div.flex.items-start"
                            className="w-full text-sm bg-white px-2 py-1.5 rounded border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none font-mono"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditingListItemPattern}
                              className="flex-1 h-7"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={saveListItemPattern}
                              className="flex-1 h-7 bg-purple-600 hover:bg-purple-700"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <code className="text-sm bg-white px-2 py-1 rounded block border border-purple-200">
                          {viewingBinding.listItemPattern || "Not configured"}
                        </code>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        This selector identifies the repeating item template within the container.
                      </p>
                    </div>

                    {/* How it works */}
                    <div className="border-t border-purple-200 pt-3">
                      <div className="text-xs font-semibold text-purple-800 mb-2">How List Rendering Works:</div>
                      <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
                        <li>The container element holds one item template</li>
                        <li>At render time, the template is cloned for each array item</li>
                        <li>Bindings inside use indexed paths like <code className="bg-white px-1 rounded">{viewingBinding.dataBinding}[i].field</code></li>
                      </ol>
                    </div>

                    {/* Binding child elements guidance */}
                    <div className="border-t border-purple-200 pt-3">
                      <div className="text-xs font-semibold text-purple-800 mb-2">Binding Child Elements:</div>
                      <div className="bg-white rounded p-2 border border-purple-200">
                        <p className="text-xs text-gray-700 mb-2">
                          To bind elements inside the list item template:
                        </p>
                        <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                          <li>Enter <strong>Element Binding Mode</strong></li>
                          <li>Click on an element inside the list item template</li>
                          <li>Select a field from the array item schema using paths like:</li>
                        </ol>
                        <div className="mt-2 space-y-1">
                          <code className="text-xs bg-purple-100 px-2 py-0.5 rounded block">
                            {viewingBinding.dataBinding}[0].fieldName
                          </code>
                          <p className="text-xs text-gray-500 italic">
                            The [0] index will automatically be replaced with the correct index for each item during rendering.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Styles */}
              {viewingBinding.conditionalStyles &&
                viewingBinding.conditionalStyles.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Conditional Styles (
                      {viewingBinding.conditionalStyles.length}):
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
                                  <span className="font-semibold">
                                    Apply CSS:
                                  </span>
                                  <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                                    {JSON.stringify(
                                      cond.cssProperties,
                                      null,
                                      2,
                                    )}
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
