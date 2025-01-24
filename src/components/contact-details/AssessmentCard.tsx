import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { CardHeader } from "./CardHeader";
import { QualityRelevantSnippets } from "./QualityRelevantSnippets";

interface AssessmentCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  flag: boolean;
  bothFlagsTrue: boolean;
  isAIAssessment?: boolean;
  onFlagChange?: (value: boolean) => void;
  onReasoningChange?: (value: string) => void;
}

export const AssessmentCard = ({
  title,
  icon,
  flag,
  isAIAssessment = false,
  onFlagChange,
}: AssessmentCardProps) => {
  return (
    <Card className="border border-gray-200 p-3">
      <div className="space-y-3">
        <CardHeader 
          title={title}
          icon={icon}
          isAIAssessment={isAIAssessment}
          flag={flag}
          onFlagChange={onFlagChange}
        />
        <QualityRelevantSnippets />
      </div>
    </Card>
  );
};