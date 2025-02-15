
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <Card className="border border-canvas-border shadow-sm bg-white p-3 h-full flex flex-col">
      <div className="space-y-3 flex-1 flex flex-col">
        <CardHeader 
          title={title}
          icon={icon}
          isAIAssessment={isAIAssessment}
          flag={flag}
          onFlagChange={onFlagChange}
        />

        <Separator className="bg-canvas-border" />

        {isAIAssessment && <ItemsList items={items} reasoning={reasoning} />}

        {!isAIAssessment && (
          <div className="flex-1 flex flex-col space-y-4">
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

            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Assessment Reasoning:</Label>
                <Textarea
                  value={reasoning || ""}
                  onChange={(e) => onReasoningChange?.(e.target.value)}
                  placeholder="Enter your assessment reasoning..."
                  className="h-full min-h-[200px] w-full resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-200 whitespace-pre-wrap break-words"
                />
              </div>

              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">Review Evidence:</Label>
                <Textarea
                  value={reviewEvidence}
                  onChange={(e) => onReviewEvidenceChange?.(e.target.value)}
                  placeholder="Enter relevant conversation excerpts..."
                  className="h-full min-h-[200px] w-full resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-200 whitespace-pre-wrap break-words"
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
    </Card>
  );
};
