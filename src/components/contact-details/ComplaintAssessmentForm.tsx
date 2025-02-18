
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ComplaintsReasons } from "./ComplaintsReasons";
import { CollapsibleSection } from "./CollapsibleSection";
import { AssessmentData } from "./types";

interface ComplaintAssessmentFormProps {
  selectedReasons: string[];
  otherReason: string;
  onReasonsChange: (reasons: string[]) => void;
  onOtherReasonChange: (value: string) => void;
  assessmentData: AssessmentData;
  customReasons: string[];
  newCustomReason: string;
  onNewCustomReasonChange: (value: string) => void;
  onAddCustomReason: () => void;
  onRemoveCustomReason: (index: number) => void;
  onUpdateAssessmentEntry: (
    type: 'complaints' | 'vulnerabilities',
    reasonType: string,
    field: 'assessment_reasoning' | 'review_evidence',
    value: string,
    customReason?: string
  ) => void;
}

export const ComplaintAssessmentForm = ({
  selectedReasons,
  otherReason,
  onReasonsChange,
  onOtherReasonChange,
  assessmentData,
  customReasons,
  newCustomReason,
  onNewCustomReasonChange,
  onAddCustomReason,
  onRemoveCustomReason,
  onUpdateAssessmentEntry,
}: ComplaintAssessmentFormProps) => {
  return (
    <CollapsibleSection title="Complaints Assessment">
      <ComplaintsReasons 
        selectedReasons={selectedReasons}
        otherReason={otherReason}
        onReasonsChange={onReasonsChange}
        onOtherReasonChange={onOtherReasonChange}
      />
      
      {selectedReasons.map(reason => (
        <div key={reason} className="mt-4 space-y-4">
          <Label>{reason}</Label>
          <div className="space-y-2">
            <Label className="text-sm">Assessment Reasoning:</Label>
            <Textarea
              value={assessmentData.complaints.find(c => c.type === reason)?.assessment_reasoning || ""}
              onChange={(e) => onUpdateAssessmentEntry('complaints', reason, 'assessment_reasoning', e.target.value)}
              placeholder="Enter assessment reasoning..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Review Evidence:</Label>
            <Textarea
              value={assessmentData.complaints.find(c => c.type === reason)?.review_evidence || ""}
              onChange={(e) => onUpdateAssessmentEntry('complaints', reason, 'review_evidence', e.target.value)}
              placeholder="Enter conversation snippets..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      ))}

      {selectedReasons.includes("Other") && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={newCustomReason}
              onChange={(e) => onNewCustomReasonChange(e.target.value)}
              placeholder="Enter new custom reason..."
              className="max-w-md"
            />
            <Button 
              type="button" 
              onClick={onAddCustomReason}
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {customReasons.map((reason, index) => (
            <div key={index} className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>{reason}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveCustomReason(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Assessment Reasoning:</Label>
                <Textarea
                  value={assessmentData.complaints.find(c => c.custom_reason === reason)?.assessment_reasoning || ""}
                  onChange={(e) => onUpdateAssessmentEntry('complaints', 'Other', 'assessment_reasoning', e.target.value, reason)}
                  placeholder="Enter assessment reasoning..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Review Evidence:</Label>
                <Textarea
                  value={assessmentData.complaints.find(c => c.custom_reason === reason)?.review_evidence || ""}
                  onChange={(e) => onUpdateAssessmentEntry('complaints', 'Other', 'review_evidence', e.target.value, reason)}
                  placeholder="Enter conversation snippets..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
};
