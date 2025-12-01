import { useState } from "react";
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
    </Card>
  );
};
