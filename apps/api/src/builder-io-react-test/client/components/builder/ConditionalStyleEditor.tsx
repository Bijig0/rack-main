import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  ConditionalStyle,
  StyleCondition,
  StyleConditionOperator,
} from "@/types/domBinding";

interface ConditionalStyleEditorProps {
  /** Available data bindings for the "depends on" dropdown */
  availableBindings: Array<{ path: string; type: string }>;
  /** Current conditional styles */
  conditionalStyles: ConditionalStyle[];
  /** Callback when styles change */
  onChange: (styles: ConditionalStyle[]) => void;
  /** Callback to close the editor */
  onClose: () => void;
}

const OPERATORS: { value: StyleConditionOperator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
  { value: "lessThanOrEqual", label: "Less Than or Equal" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Does Not Contain" },
];

const COMMON_CSS_PROPERTIES = [
  "backgroundColor",
  "color",
  "borderColor",
  "opacity",
  "display",
  "fontSize",
  "fontWeight",
  "textDecoration",
];

export const ConditionalStyleEditor = ({
  availableBindings,
  conditionalStyles,
  onChange,
  onClose,
}: ConditionalStyleEditorProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addConditionalStyle = () => {
    onChange([
      ...conditionalStyles,
      {
        dependsOn: "",
        conditions: [],
      },
    ]);
    setEditingIndex(conditionalStyles.length);
  };

  const removeConditionalStyle = (index: number) => {
    onChange(conditionalStyles.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const updateConditionalStyle = (index: number, updated: ConditionalStyle) => {
    onChange(
      conditionalStyles.map((style, i) => (i === index ? updated : style))
    );
  };

  const addCondition = (styleIndex: number) => {
    const style = conditionalStyles[styleIndex];
    updateConditionalStyle(styleIndex, {
      ...style,
      conditions: [
        ...style.conditions,
        {
          value: "",
          operator: "equals",
          cssProperties: {},
        },
      ],
    });
  };

  const removeCondition = (styleIndex: number, conditionIndex: number) => {
    const style = conditionalStyles[styleIndex];
    updateConditionalStyle(styleIndex, {
      ...style,
      conditions: style.conditions.filter((_, i) => i !== conditionIndex),
    });
  };

  const updateCondition = (
    styleIndex: number,
    conditionIndex: number,
    updated: StyleCondition
  ) => {
    const style = conditionalStyles[styleIndex];
    updateConditionalStyle(styleIndex, {
      ...style,
      conditions: style.conditions.map((cond, i) =>
        i === conditionIndex ? updated : cond
      ),
    });
  };

  const addCssProperty = (
    styleIndex: number,
    conditionIndex: number,
    property: string,
    value: string
  ) => {
    const condition = conditionalStyles[styleIndex].conditions[conditionIndex];
    updateCondition(styleIndex, conditionIndex, {
      ...condition,
      cssProperties: {
        ...condition.cssProperties,
        [property]: value,
      },
    });
  };

  const removeCssProperty = (
    styleIndex: number,
    conditionIndex: number,
    property: string
  ) => {
    const condition = conditionalStyles[styleIndex].conditions[conditionIndex];
    const { [property]: _, ...rest } = condition.cssProperties;
    updateCondition(styleIndex, conditionIndex, {
      ...condition,
      cssProperties: rest,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[800px] max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Conditional Style Editor</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            Define styles that change based on other data values. For example,
            change a card's background color based on an easement status.
          </div>

          {conditionalStyles.map((style, styleIndex) => (
            <Card key={styleIndex} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label>Depends On</Label>
                    <Select
                      value={style.dependsOn}
                      onValueChange={(value) =>
                        updateConditionalStyle(styleIndex, {
                          ...style,
                          dependsOn: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data binding..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBindings.map((binding) => (
                          <SelectItem key={binding.path} value={binding.path}>
                            <code className="text-xs">{binding.path}</code>
                            <span className="text-xs text-gray-500 ml-2">
                              ({binding.type})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConditionalStyle(styleIndex)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {style.conditions.map((condition, conditionIndex) => (
                  <div
                    key={conditionIndex}
                    className="border rounded-md p-3 space-y-3 bg-gray-50"
                  >
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">When value</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value) =>
                            updateCondition(styleIndex, conditionIndex, {
                              ...condition,
                              operator: value as StyleConditionOperator,
                            })
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {OPERATORS.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs">Value</Label>
                        <Input
                          className="h-8"
                          value={condition.value}
                          onChange={(e) =>
                            updateCondition(styleIndex, conditionIndex, {
                              ...condition,
                              value: e.target.value,
                            })
                          }
                          placeholder="Enter value..."
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeCondition(styleIndex, conditionIndex)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">CSS Properties</Label>
                      {Object.entries(condition.cssProperties).map(
                        ([property, value]) => (
                          <div key={property} className="flex gap-2">
                            <Input
                              className="h-8 flex-1"
                              value={property}
                              disabled
                            />
                            <Input
                              className="h-8 flex-1"
                              value={value}
                              onChange={(e) =>
                                addCssProperty(
                                  styleIndex,
                                  conditionIndex,
                                  property,
                                  e.target.value
                                )
                              }
                              placeholder="Value..."
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeCssProperty(
                                  styleIndex,
                                  conditionIndex,
                                  property
                                )
                              }
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )
                      )}
                      <Select
                        onValueChange={(property) =>
                          addCssProperty(styleIndex, conditionIndex, property, "")
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Add CSS property..." />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_CSS_PROPERTIES.map((prop) => (
                            <SelectItem key={prop} value={prop}>
                              {prop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition(styleIndex)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addConditionalStyle}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Conditional Style Rule
          </Button>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
