
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      onReasonsChange([...selectedReasons, reason]);
    } else {
      onReasonsChange(selectedReasons.filter(r => r !== reason));
    }
  };

  return (
    <div className="space-y-2">
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
    </div>
  );
};
