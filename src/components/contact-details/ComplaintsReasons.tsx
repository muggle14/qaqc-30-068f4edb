
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplaintsReasonsProps {
  selectedReasons: string[];
  otherReason: string;
  onReasonsChange: (reasons: string[]) => void;
  onOtherReasonChange: (value: string) => void;
}

export const COMPLAINTS_REASONS = [
  "Explicit complaints",
  "Suggested by Agent",
  "Tonality",
  "Other"
] as const;

export const ComplaintsReasons = ({
  selectedReasons,
  otherReason,
  onReasonsChange,
  onOtherReasonChange,
}: ComplaintsReasonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      onReasonsChange([...selectedReasons, reason]);
    } else {
      onReasonsChange(selectedReasons.filter(r => r !== reason));
    }
  };

  const selectedCount = selectedReasons.length;

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 p-0 hover:bg-transparent">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
            <span className="text-sm font-medium">
              {selectedCount > 0 ? `${selectedCount} selected` : "Select complaints reasons"}
            </span>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="transition-all pt-4">
          <div className="grid grid-cols-2 gap-4">
            {COMPLAINTS_REASONS.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox
                  id={`reason-${reason}`}
                  checked={selectedReasons.includes(reason)}
                  onCheckedChange={(checked) => 
                    handleReasonChange(reason, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`reason-${reason}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {reason}
                </Label>
              </div>
            ))}
          </div>

          {selectedReasons.includes("Other") && (
            <div className="mt-4">
              <Label htmlFor="other-reason" className="text-sm">
                Specify other complaint reason:
              </Label>
              <Input
                id="other-reason"
                value={otherReason}
                onChange={(e) => onOtherReasonChange(e.target.value)}
                maxLength={40}
                placeholder="Enter other complaint reason..."
                className="max-w-md mt-1"
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
