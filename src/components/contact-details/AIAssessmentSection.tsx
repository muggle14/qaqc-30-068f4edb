import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield } from "lucide-react";
import { useState } from "react";

interface AIAssessmentSectionProps {
  complaints: string[];
  vulnerabilities: string[];
  complaintsFlag: boolean;
  vulnerabilityFlag: boolean;
  complaintsReasoning: string | null;
  vulnerabilityReasoning: string | null;
  bothFlagsTrue: boolean;
  contactId: string;
  complaintsSnippetIds: string[];
  vulnerabilitySnippetIds: string[];
  onSnippetClick?: (snippetId: string) => void;
}

export const AIAssessmentSection = ({
  complaints,
  vulnerabilities,
  complaintsFlag,
  vulnerabilityFlag,
  complaintsReasoning,
  vulnerabilityReasoning,
  bothFlagsTrue,
  contactId,
  complaintsSnippetIds,
  vulnerabilitySnippetIds,
  onSnippetClick,
}: AIAssessmentSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AssessmentCard
        title="Complaints Assessment"
        icon={AlertCircle}
        items={complaints}
        flag={complaintsFlag}
        reasoning={complaintsReasoning}
        bothFlagsTrue={bothFlagsTrue}
        isAIAssessment={true}
        contactId={contactId}
        snippetIds={complaintsSnippetIds}
        onSnippetClick={onSnippetClick}
      />

      <AssessmentCard
        title="Vulnerability Assessment"
        icon={Shield}
        items={vulnerabilities}
        flag={vulnerabilityFlag}
        reasoning={vulnerabilityReasoning}
        bothFlagsTrue={bothFlagsTrue}
        isAIAssessment={true}
        contactId={contactId}
        snippetIds={vulnerabilitySnippetIds}
        onSnippetClick={onSnippetClick}
      />
    </div>
  );
};