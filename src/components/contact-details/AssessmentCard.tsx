
import { LucideIcon, Plus, Trash2 } from "lucide-react";
import { QualityReasoningSection } from "./QualityReasoningSection";
import { CardHeader } from "./CardHeader";
import { ItemsList } from "./ItemsList";
import { AIRelevantSnippets } from "./AIRelevantSnippets";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VulnerabilityCategories } from "./VulnerabilityCategories";
import { ComplaintsReasons } from "./ComplaintsReasons";
import { useState, useEffect } from "react";
import { CollapsibleSection } from "./CollapsibleSection";

interface AssessmentEntry {
  type: string;
  custom_reason?: string;
  assessment_reasoning: string;
  review_evidence: string;
}

interface AssessmentData {
  complaints: AssessmentEntry[];
  vulnerabilities: AssessmentEntry[];
}

interface AssessmentCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  flag: boolean;
  reasoning?: string | null;
  bothFlagsTrue: boolean;
  isAIAssessment?: boolean;
  onFlagChange?: (value: boolean) => void;
  onReasoningChange?: (value: string) => void;
  contactId?: string;
  snippetIds?: string[];
  onSnippetClick?: (snippetId: string) => void;
  isVulnerability?: boolean;
  selectedCategories?: string[];
  otherCategory?: string;
  onCategoriesChange?: (categories: string[]) => void;
  onOtherCategoryChange?: (value: string) => void;
  selectedReasons?: string[];
  otherReason?: string;
  onReasonsChange?: (reasons: string[]) => void;
  onOtherReasonChange?: (value: string) => void;
  reviewEvidence?: string;
  onReviewEvidenceChange?: (value: string) => void;
}

export const AssessmentCard = ({
  title,
  icon,
  items,
  flag,
  reasoning,
  bothFlagsTrue,
  isAIAssessment = false,
  onFlagChange,
  onReasoningChange,
  contactId,
  snippetIds = [],
  onSnippetClick,
  isVulnerability = false,
  selectedCategories = [],
  otherCategory = "",
  onCategoriesChange,
  onOtherCategoryChange,
  selectedReasons = [],
  otherReason = "",
  onReasonsChange,
  onOtherReasonChange,
  reviewEvidence = "",
  onReviewEvidenceChange,
}: AssessmentCardProps) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    complaints: [],
    vulnerabilities: []
  });
  const [customComplaintReasons, setCustomComplaintReasons] = useState<string[]>([]);
  const [customVulnerabilityCategories, setCustomVulnerabilityCategories] = useState<string[]>([]);
  const [newCustomReason, setNewCustomReason] = useState("");

  const handleAddCustomReason = (type: 'complaint' | 'vulnerability') => {
    if (newCustomReason.trim()) {
      if (type === 'complaint') {
        setCustomComplaintReasons([...customComplaintReasons, newCustomReason]);
      } else {
        setCustomVulnerabilityCategories([...customVulnerabilityCategories, newCustomReason]);
      }
      setNewCustomReason("");
    }
  };

  const handleRemoveCustomReason = (index: number, type: 'complaint' | 'vulnerability') => {
    if (type === 'complaint') {
      setCustomComplaintReasons(customComplaintReasons.filter((_, i) => i !== index));
      // Remove associated assessment data
      setAssessmentData(prev => ({
        ...prev,
        complaints: prev.complaints.filter(c => c.custom_reason !== customComplaintReasons[index])
      }));
    } else {
      setCustomVulnerabilityCategories(customVulnerabilityCategories.filter((_, i) => i !== index));
      setAssessmentData(prev => ({
        ...prev,
        vulnerabilities: prev.vulnerabilities.filter(v => v.custom_reason !== customVulnerabilityCategories[index])
      }));
    }
  };

  const updateAssessmentEntry = (
    type: 'complaints' | 'vulnerabilities',
    reasonType: string,
    field: 'assessment_reasoning' | 'review_evidence',
    value: string,
    customReason?: string
  ) => {
    setAssessmentData(prev => {
      const entries = [...prev[type]];
      const existingIndex = entries.findIndex(entry => 
        entry.type === reasonType && (!customReason || entry.custom_reason === customReason)
      );

      if (existingIndex >= 0) {
        entries[existingIndex] = {
          ...entries[existingIndex],
          [field]: value,
        };
      } else {
        entries.push({
          type: reasonType,
          ...(customReason && { custom_reason: customReason }),
          assessment_reasoning: field === 'assessment_reasoning' ? value : '',
          review_evidence: field === 'review_evidence' ? value : '',
        });
      }

      return { ...prev, [type]: entries };
    });
  };

  return (
    <div className="bg-gray-50/50 rounded-lg p-6 h-full flex flex-col">
      <div className="space-y-6 flex-1 flex flex-col">
        <CardHeader 
          title={title}
          icon={icon}
          isAIAssessment={isAIAssessment}
          flag={flag}
          onFlagChange={onFlagChange}
        />

        <div className="h-px bg-gray-200 w-full" />

        {isAIAssessment && <ItemsList items={items} reasoning={reasoning} />}

        {!isAIAssessment && (
          <div className="flex-1 flex flex-col space-y-6">
            {!isVulnerability && (
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
                        onChange={(e) => updateAssessmentEntry('complaints', reason, 'assessment_reasoning', e.target.value)}
                        placeholder="Enter assessment reasoning..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Review Evidence:</Label>
                      <Textarea
                        value={assessmentData.complaints.find(c => c.type === reason)?.review_evidence || ""}
                        onChange={(e) => updateAssessmentEntry('complaints', reason, 'review_evidence', e.target.value)}
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
                        onChange={(e) => setNewCustomReason(e.target.value)}
                        placeholder="Enter new custom reason..."
                        className="max-w-md"
                      />
                      <Button 
                        type="button" 
                        onClick={() => handleAddCustomReason('complaint')}
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {customComplaintReasons.map((reason, index) => (
                      <div key={index} className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>{reason}</Label>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCustomReason(index, 'complaint')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Assessment Reasoning:</Label>
                          <Textarea
                            value={assessmentData.complaints.find(c => c.custom_reason === reason)?.assessment_reasoning || ""}
                            onChange={(e) => updateAssessmentEntry('complaints', 'Other', 'assessment_reasoning', e.target.value, reason)}
                            placeholder="Enter assessment reasoning..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Review Evidence:</Label>
                          <Textarea
                            value={assessmentData.complaints.find(c => c.custom_reason === reason)?.review_evidence || ""}
                            onChange={(e) => updateAssessmentEntry('complaints', 'Other', 'review_evidence', e.target.value, reason)}
                            placeholder="Enter conversation snippets..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleSection>
            )}

            {isVulnerability && (
              <CollapsibleSection title="Vulnerability Assessment">
                <VulnerabilityCategories 
                  selectedCategories={selectedCategories}
                  otherCategory={otherCategory}
                  onCategoriesChange={onCategoriesChange}
                  onOtherCategoryChange={onOtherCategoryChange}
                />
                
                {selectedCategories.map(category => (
                  <div key={category} className="mt-4 space-y-4">
                    <Label>{category}</Label>
                    <div className="space-y-2">
                      <Label className="text-sm">Assessment Reasoning:</Label>
                      <Textarea
                        value={assessmentData.vulnerabilities.find(v => v.type === category)?.assessment_reasoning || ""}
                        onChange={(e) => updateAssessmentEntry('vulnerabilities', category, 'assessment_reasoning', e.target.value)}
                        placeholder="Enter assessment reasoning..."
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Review Evidence:</Label>
                      <Textarea
                        value={assessmentData.vulnerabilities.find(v => v.type === category)?.review_evidence || ""}
                        onChange={(e) => updateAssessmentEntry('vulnerabilities', category, 'review_evidence', e.target.value)}
                        placeholder="Enter conversation snippets..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                ))}

                {selectedCategories.includes("Other") && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Input
                        value={newCustomReason}
                        onChange={(e) => setNewCustomReason(e.target.value)}
                        placeholder="Enter new custom category..."
                        className="max-w-md"
                      />
                      <Button 
                        type="button" 
                        onClick={() => handleAddCustomReason('vulnerability')}
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {customVulnerabilityCategories.map((category, index) => (
                      <div key={index} className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>{category}</Label>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCustomReason(index, 'vulnerability')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Assessment Reasoning:</Label>
                          <Textarea
                            value={assessmentData.vulnerabilities.find(v => v.custom_reason === category)?.assessment_reasoning || ""}
                            onChange={(e) => updateAssessmentEntry('vulnerabilities', 'Other', 'assessment_reasoning', e.target.value, category)}
                            placeholder="Enter assessment reasoning..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Review Evidence:</Label>
                          <Textarea
                            value={assessmentData.vulnerabilities.find(v => v.custom_reason === category)?.review_evidence || ""}
                            onChange={(e) => updateAssessmentEntry('vulnerabilities', 'Other', 'review_evidence', e.target.value, category)}
                            placeholder="Enter conversation snippets..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleSection>
            )}

            <div className="flex-1 flex flex-col space-y-6">
              <div className="flex-1 space-y-3">
                <Label className="text-base font-medium text-gray-700">Assessment Reasoning:</Label>
                <Textarea
                  value={reasoning || ""}
                  onChange={(e) => onReasoningChange?.(e.target.value)}
                  placeholder="Enter your assessment reasoning..."
                  className="flex-1 h-[calc(100vh-600px)] min-h-[200px] resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-200 bg-white"
                />
              </div>

              <div className="flex-1 space-y-3">
                <Label className="text-base font-medium text-gray-700">Review Evidence:</Label>
                <Textarea
                  value={reviewEvidence}
                  onChange={(e) => onReviewEvidenceChange?.(e.target.value)}
                  placeholder="Enter relevant conversation excerpts..."
                  className="flex-1 h-[calc(100vh-600px)] min-h-[200px] resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-200 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {isAIAssessment && (
          <AIRelevantSnippets 
            contactId={contactId || ''} 
            snippetIds={snippetIds}
            onSnippetClick={onSnippetClick}
          />
        )}
      </div>
    </div>
  );
};
