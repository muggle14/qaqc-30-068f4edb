
import { LucideIcon } from "lucide-react";
import { CardHeader } from "./CardHeader";
import { ItemsList } from "./ItemsList";
import { AIRelevantSnippets } from "./AIRelevantSnippets";
import { ComplaintAssessmentForm } from "./ComplaintAssessmentForm";
import { VulnerabilityAssessmentForm } from "./VulnerabilityAssessmentForm";
import { useState } from "react";
import { AssessmentCardProps, AssessmentData } from "./types";

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
              <ComplaintAssessmentForm
                selectedReasons={selectedReasons}
                otherReason={otherReason}
                onReasonsChange={onReasonsChange}
                onOtherReasonChange={onOtherReasonChange}
                assessmentData={assessmentData}
                customReasons={customComplaintReasons}
                newCustomReason={newCustomReason}
                onNewCustomReasonChange={setNewCustomReason}
                onAddCustomReason={() => handleAddCustomReason('complaint')}
                onRemoveCustomReason={(index) => handleRemoveCustomReason(index, 'complaint')}
                onUpdateAssessmentEntry={updateAssessmentEntry}
              />
            )}

            {isVulnerability && (
              <VulnerabilityAssessmentForm
                selectedCategories={selectedCategories}
                otherCategory={otherCategory}
                onCategoriesChange={onCategoriesChange}
                onOtherCategoryChange={onOtherCategoryChange}
                assessmentData={assessmentData}
                customCategories={customVulnerabilityCategories}
                newCustomReason={newCustomReason}
                onNewCustomReasonChange={setNewCustomReason}
                onAddCustomReason={() => handleAddCustomReason('vulnerability')}
                onRemoveCustomReason={(index) => handleRemoveCustomReason(index, 'vulnerability')}
                onUpdateAssessmentEntry={updateAssessmentEntry}
              />
            )}
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
