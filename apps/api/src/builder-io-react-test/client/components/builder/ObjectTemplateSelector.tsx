import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, FileText, Plus } from "lucide-react";
import { extractTemplateProperties } from "@/types/domBinding";

interface ObjectTemplateSelectorProps {
  /** The data binding path (e.g., "state.propertyInfo.landArea") */
  dataBinding: string;
  /** Properties available on the object (from schema) */
  availableProperties: string[];
  /** Callback when template is confirmed */
  onConfirm: (template: string) => void;
  /** Callback to cancel */
  onCancel: () => void;
}

export const ObjectTemplateSelector = ({
  dataBinding,
  availableProperties,
  onConfirm,
  onCancel,
}: ObjectTemplateSelectorProps) => {
  const [template, setTemplate] = useState("");

  // Parse the template to show preview
  const usedProperties = useMemo(() => {
    return extractTemplateProperties(template);
  }, [template]);

  // Create sample data for preview
  const previewData = useMemo(() => {
    const data: Record<string, string> = {};
    availableProperties.forEach(prop => {
      // Generate sample values based on common property names
      if (prop === "value") data[prop] = "683";
      else if (prop === "unit") data[prop] = "m²";
      else if (prop === "currency") data[prop] = "AUD";
      else if (prop === "low" || prop === "min") data[prop] = "1,200,000";
      else if (prop === "high" || prop === "max") data[prop] = "1,500,000";
      else if (prop === "mid" || prop === "median") data[prop] = "1,350,000";
      else data[prop] = `[${prop}]`;
    });
    return data;
  }, [availableProperties]);

  // Generate preview
  const preview = useMemo(() => {
    if (!template) return "";
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return previewData[key] || match;
    });
  }, [template, previewData]);

  const handleAddProperty = (prop: string) => {
    setTemplate(prev => prev + (prev ? " " : "") + `{${prop}}`);
  };

  const handleUseDefaultTemplate = () => {
    // Create a default template with all properties
    const defaultTemplate = availableProperties.map(p => `{${p}}`).join(" ");
    setTemplate(defaultTemplate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4" data-binding-panel>
      <Card className="w-full max-w-lg shadow-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold">Object Template</div>
                <div className="text-xs text-gray-600">
                  Define how to display this object's properties
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="text-xs">
              <span className="font-semibold">Data Binding:</span>
              <code className="ml-2 bg-gray-100 px-2 py-0.5 rounded">
                {dataBinding}
              </code>
            </div>

            <div>
              <Label className="text-xs font-semibold">Available Properties:</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {availableProperties.map((prop) => (
                  <button
                    key={prop}
                    onClick={() => handleAddProperty(prop)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {prop}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="template" className="text-xs font-semibold">
                Template:
              </Label>
              <div className="mt-1 flex gap-2">
                <Input
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  placeholder="e.g., {value} {unit}"
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseDefaultTemplate}
                  title="Use all properties"
                >
                  All
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use {"{property}"} syntax to include object properties
              </p>
            </div>

            {template && (
              <div className="bg-gray-50 rounded-lg p-3">
                <Label className="text-xs font-semibold text-gray-600">Preview:</Label>
                <div className="mt-1 text-sm font-medium">
                  {preview || <span className="text-gray-400 italic">Empty result</span>}
                </div>
                {usedProperties.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Using: {usedProperties.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(template)}
              disabled={!template || usedProperties.length === 0}
            >
              Continue to Select Element
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
