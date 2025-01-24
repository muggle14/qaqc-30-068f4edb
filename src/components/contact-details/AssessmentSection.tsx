import { AIAssessment } from "./AIAssessment";
import { QualityAssessmentCard } from "./QualityAssessmentCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [isAIOpen, setIsAIOpen] = useState(true);
  const [isQualityOpen, setIsQualityOpen] = useState(true);

  return (
    <div className="space-y-6">
      <Collapsible open={isAIOpen} onOpenChange={setIsAIOpen}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">AI Assessment & Feedback</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isAIOpen ? "" : "-rotate-90"}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="transition-all">
          <AIAssessment 
            complaints={complaints}
            vulnerabilities={vulnerabilities}
            hasPhysicalDisability={false}
            contactId={contactId}
          />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isQualityOpen} onOpenChange={setIsQualityOpen}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Quality Assessor Feedback</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isQualityOpen ? "" : "-rotate-90"}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="transition-all">
          <QualityAssessmentCard />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};