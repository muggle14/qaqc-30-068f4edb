import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";
import { QualityReasoningSection } from "./QualityReasoningSection";
import { CardHeader } from "./CardHeader";
import { ItemsList } from "./ItemsList";
import { AIRelevantSnippets } from "./AIRelevantSnippets";
import { QualityRelevantSnippets } from "./QualityRelevantSnippets";

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
}: AssessmentCardProps) => {
  return (
    <Card className="border border-canvas-border shadow-sm bg-white p-3">
      <div className="space-y-3">
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
          <QualityReasoningSection 
            reasoning={reasoning}
            onReasoningChange={onReasoningChange}
          />
        )}

        {isAIAssessment ? (
          <AIRelevantSnippets 
            contactId={contactId || ''} 
            snippetIds={snippetIds}
          />
        ) : (
          <QualityRelevantSnippets />
        )}
      </div>
    </Card>
  );
};