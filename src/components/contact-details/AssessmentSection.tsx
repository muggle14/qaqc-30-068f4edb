import { AIAssessment } from "./AIAssessment";
import { QualityAssessmentCard } from "./QualityAssessmentCard";

interface AssessmentSectionProps {
  complaints: string[];
  vulnerabilities: string[];
  contactId: string;
}

export const AssessmentSection = ({ 
  complaints, 
  vulnerabilities, 
  contactId 
}: AssessmentSectionProps) => {
  return (
    <div className="space-y-6">
      <AIAssessment 
        complaints={complaints}
        vulnerabilities={vulnerabilities}
        hasPhysicalDisability={false}
        contactId={contactId}
      />
      <QualityAssessmentCard />
    </div>
  );
};