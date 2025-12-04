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
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Repeat, Image } from "lucide-react";
import { useState, useMemo } from "react";
import {
  ConditionalStyle,
  ConditionalAttribute,
  AttributeCondition,
  StyleCondition,
  StyleConditionOperator,
} from "@/types/domBinding";

/** Context for list item bindings */
export interface ListContext {
  /** Base path of the list (e.g., "state.schools") */
  basePath: string;
  /** Item path pattern (e.g., "state.schools[0]") */
  itemPath: string;
}

interface ConditionalStyleEditorProps {
  /** Available data bindings for the "depends on" dropdown */
  availableBindings: Array<{ path: string; type: string }>;
  /** Current conditional styles */
  conditionalStyles: ConditionalStyle[];
  /** Current conditional attributes (e.g., icon src) */
  conditionalAttributes?: ConditionalAttribute[];
  /** Callback when styles change */
  onChange: (styles: ConditionalStyle[]) => void;
  /** Callback when attributes change */
  onAttributesChange?: (attrs: ConditionalAttribute[]) => void;
  /** Callback to close the editor */
  onClose: () => void;
  /** If editing a list item, provide the list context */
  listContext?: ListContext;
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
  conditionalAttributes = [],
  onChange,
  onAttributesChange,
  onClose,
  listContext,
}: ConditionalStyleEditorProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Separate bindings into "same item" and "external" when in list context
  const { sameItemBindings, externalBindings } = useMemo(() => {
    if (!listContext) {
      return { sameItemBindings: [], externalBindings: availableBindings };
    }

    const basePath = listContext.basePath;
    const sameItem = availableBindings.filter((b) =>
      b.path.startsWith(basePath + "[")
    );
    const external = availableBindings.filter(
      (b) => !b.path.startsWith(basePath + "[")
    );

    return { sameItemBindings: sameItem, externalBindings: external };
  }, [availableBindings, listContext]);

  // Helper to format path for display in list context
  const formatPathForDisplay = (path: string) => {
    if (listContext && path.startsWith(listContext.basePath + "[")) {
      return path.replace(listContext.basePath + "[0]", "[item]");
    }
    return path;
  };

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

  // Conditional Attribute handlers
  const addConditionalAttribute = () => {
    if (!onAttributesChange) return;
    onAttributesChange([
      ...conditionalAttributes,
      {
        dependsOn: "",
        attribute: "src",
        conditions: [],
      },
    ]);
  };

  const removeConditionalAttribute = (index: number) => {
    if (!onAttributesChange) return;
    onAttributesChange(conditionalAttributes.filter((_, i) => i !== index));
  };

  const updateConditionalAttribute = (index: number, updated: ConditionalAttribute) => {
    if (!onAttributesChange) return;
    onAttributesChange(
      conditionalAttributes.map((attr, i) => (i === index ? updated : attr))
    );
  };

  const addAttributeCondition = (attrIndex: number) => {
    const attr = conditionalAttributes[attrIndex];
    updateConditionalAttribute(attrIndex, {
      ...attr,
      conditions: [
        ...attr.conditions,
        {
          value: "",
          operator: "equals",
          attributeValue: "",
        },
      ],
    });
  };

  const removeAttributeCondition = (attrIndex: number, conditionIndex: number) => {
    const attr = conditionalAttributes[attrIndex];
    updateConditionalAttribute(attrIndex, {
      ...attr,
      conditions: attr.conditions.filter((_, i) => i !== conditionIndex),
    });
  };

  const updateAttributeCondition = (
    attrIndex: number,
    conditionIndex: number,
    updated: AttributeCondition
  ) => {
    const attr = conditionalAttributes[attrIndex];
    updateConditionalAttribute(attrIndex, {
      ...attr,
      conditions: attr.conditions.map((cond, i) =>
        i === conditionIndex ? updated : cond
      ),
    });
  };

  // Render the binding selector with grouped options for list context
  const renderBindingSelector = (
    value: string,
    onValueChange: (value: string) => void,
    placeholder: string = "Select data binding..."
  ) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {value && formatPathForDisplay(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {listContext && sameItemBindings.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-50">
              Current Item Properties
            </div>
            {sameItemBindings.map((binding) => (
              <SelectItem key={binding.path} value={binding.path}>
                <div className="flex items-center gap-2">
                  <code className="text-xs">
                    {formatPathForDisplay(binding.path)}
                  </code>
                  <Badge variant="outline" className="text-xs">
                    {binding.type}
                  </Badge>
                </div>
              </SelectItem>
            ))}
            <div className="border-t my-1" />
            <div className="px-2 py-1 text-xs font-semibold text-gray-500">
              External Data
            </div>
          </>
        )}
        {!listContext && (
          <div className="px-2 py-1 text-xs font-semibold text-gray-500">
            Available Bindings
          </div>
        )}
        {externalBindings.map((binding) => (
          <SelectItem key={binding.path} value={binding.path}>
            <div className="flex items-center gap-2">
              <code className="text-xs">{binding.path}</code>
              <Badge variant="outline" className="text-xs">
                {binding.type}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

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
          {/* Template Mode Banner for List Items */}
          {listContext && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Repeat className="w-4 h-4" />
                <span className="text-sm font-semibold">Template Styling Mode</span>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                Styles defined here will apply to <strong>each item</strong> in the list.
                Conditions like "rating &gt; 4" will evaluate against each item's own data.
              </p>
            </div>
          )}

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
                    {renderBindingSelector(
                      style.dependsOn,
                      (value) =>
                        updateConditionalStyle(styleIndex, {
                          ...style,
                          dependsOn: value,
                        })
                    )}
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

          {/* Conditional Attributes Section (e.g., icon src) */}
          {onAttributesChange && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-semibold">Conditional Icon/Image Source</Label>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Change image or icon sources based on data values.
              </p>

              {conditionalAttributes.map((attr, attrIndex) => (
                <Card key={attrIndex} className="border-2 border-blue-200 mb-3">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label className="text-xs">Depends On</Label>
                          {renderBindingSelector(
                            attr.dependsOn,
                            (value) =>
                              updateConditionalAttribute(attrIndex, {
                                ...attr,
                                dependsOn: value,
                              })
                          )}
                        </div>
                        <div>
                          <Label className="text-xs">Attribute</Label>
                          <Select
                            value={attr.attribute}
                            onValueChange={(value) =>
                              updateConditionalAttribute(attrIndex, {
                                ...attr,
                                attribute: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="src">src (image source)</SelectItem>
                              <SelectItem value="href">href (link)</SelectItem>
                              <SelectItem value="alt">alt (alt text)</SelectItem>
                              <SelectItem value="title">title</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConditionalAttribute(attrIndex)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {attr.conditions.map((condition, conditionIndex) => (
                      <div
                        key={conditionIndex}
                        className="border rounded-md p-3 space-y-3 bg-blue-50"
                      >
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-xs">When value</Label>
                            <Select
                              value={condition.operator}
                              onValueChange={(value) =>
                                updateAttributeCondition(attrIndex, conditionIndex, {
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
                                updateAttributeCondition(attrIndex, conditionIndex, {
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
                            onClick={() => removeAttributeCondition(attrIndex, conditionIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div>
                          <Label className="text-xs">Set {attr.attribute} to</Label>
                          <Input
                            className="h-8"
                            value={condition.attributeValue}
                            onChange={(e) =>
                              updateAttributeCondition(attrIndex, conditionIndex, {
                                ...condition,
                                attributeValue: e.target.value,
                              })
                            }
                            placeholder={`Enter ${attr.attribute} value (e.g., /icons/star.svg)`}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAttributeCondition(attrIndex)}
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
                onClick={addConditionalAttribute}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Conditional Attribute Rule
              </Button>
            </div>
          )}

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
