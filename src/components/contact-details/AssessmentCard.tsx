
import { LucideIcon } from "lucide-react";
import { QualityReasoningSection } from "./QualityReasoningSection";
import { CardHeader } from "./CardHeader";
import { ItemsList } from "./ItemsList";
import { AIRelevantSnippets } from "./AIRelevantSnippets";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { VulnerabilityCategories } from "./VulnerabilityCategories";

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
  reviewEvidence = "",
  onReviewEvidenceChange,
}: AssessmentCardProps) => {
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
            {isVulnerability && onCategoriesChange && onOtherCategoryChange && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Vulnerability Categories:</Label>
                <VulnerabilityCategories 
                  selectedCategories={selectedCategories}
                  otherCategory={otherCategory}
                  onCategoriesChange={onCategoriesChange}
                  onOtherCategoryChange={onOtherCategoryChange}
                />
              </div>
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
