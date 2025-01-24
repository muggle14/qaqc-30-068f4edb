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
}: AssessmentCardProps) => {
  return (
    <Card className="border-2 border-gray-200 p-4">
      <div className="space-y-4">
        <CardHeader 
          title={title}
          icon={icon}
          isAIAssessment={isAIAssessment}
          flag={flag}
          onFlagChange={onFlagChange}
        />

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        {!isAIAssessment && (
          <QualityReasoningSection 
            reasoning={reasoning}
            onReasoningChange={onReasoningChange}
          />
        )}

        <ItemsList items={items} />

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        {isAIAssessment ? (
          <AIRelevantSnippets />
        ) : (
          <QualityRelevantSnippets />
        )}
      </div>
    </Card>
  );
};