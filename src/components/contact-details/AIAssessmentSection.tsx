import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield } from "lucide-react";

interface AIAssessmentSectionProps {
  complaints: string[];
  vulnerabilities: string[];
  complaintsFlag: boolean;
  vulnerabilityFlag: boolean;
  complaintsReasoning: string | null;
  vulnerabilityReasoning: string | null;
  bothFlagsTrue: boolean;
}

export const AIAssessmentSection = ({
  complaints,
  vulnerabilities,
  complaintsFlag,
  vulnerabilityFlag,
  complaintsReasoning,
  vulnerabilityReasoning,
  bothFlagsTrue,
}: AIAssessmentSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AssessmentCard
        title="Complaints"
        icon={AlertCircle}
        items={complaints}
        flag={complaintsFlag}
        reasoning={complaintsReasoning}
        bothFlagsTrue={bothFlagsTrue}
        isAIAssessment={false}
      />

      <AssessmentCard
        title="Vulnerabilities"
        icon={Shield}
        items={vulnerabilities}
        flag={vulnerabilityFlag}
        reasoning={vulnerabilityReasoning}
        bothFlagsTrue={bothFlagsTrue}
        isAIAssessment={false}
      />
    </div>
  );
};