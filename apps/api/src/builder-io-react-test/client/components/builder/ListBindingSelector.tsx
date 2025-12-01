import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, X } from "lucide-react";
import { DomElementSelector } from "./DomElementSelector";

interface ListBindingSelectorProps {
  /** Data binding path for the array */
  dataBinding: string;
  /** Item type from the schema */
  itemType: string;
  /** Callback when container and child are selected */
  onComplete: (containerPath: string, childPath: string) => void;
  /** Callback to cancel */
  onCancel: () => void;
}

export const ListBindingSelector = ({
  dataBinding,
  itemType,
  onComplete,
  onCancel,
}: ListBindingSelectorProps) => {
  const [step, setStep] = useState<"container" | "child">("container");
  const [containerPath, setContainerPath] = useState<string>("");
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null
  );
  const [childPath, setChildPath] = useState<string>("");

  const handleContainerSelect = (path: string, element: HTMLElement) => {
    setContainerPath(path);
    setContainerElement(element);
    // Move to child selection after a brief delay
    setTimeout(() => {
      setStep("child");
    }, 500);
  };

  const handleChildSelect = (path: string) => {
    setChildPath(path);
    // Complete after a brief delay
    setTimeout(() => {
      onComplete(containerPath, path);
    }, 500);
  };

  const handleBack = () => {
    setStep("container");
    setContainerPath("");
    setContainerElement(null);
  };

  return (
    <>
      {step === "container" && (
        <DomElementSelector
          dataType="array"
          dataBinding={dataBinding}
          isListSelection={true}
          onSelect={handleContainerSelect}
          onCancel={onCancel}
        />
      )}

      {step === "child" && containerElement && (
        <>
          {/* Status card showing progress */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[99]">
            <Card className="shadow-xl border-2 border-green-500 mb-2">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold">
                      Container Selected
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-blue-600">
                    Now Select Child Element
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="ml-auto"
                  >
                    Back
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <DomElementSelector
            dataType={itemType}
            dataBinding={`${dataBinding}[i]`}
            isListSelection={false}
            onSelect={handleChildSelect}
            onCancel={handleBack}
            parentElement={containerElement}
          />
        </>
      )}
    </>
  );
};
