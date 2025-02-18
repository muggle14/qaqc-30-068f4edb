
import { AIAssessment } from "./AIAssessment";
import { QualityAssessmentCard } from "./QualityAssessmentCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AIGenerationControls } from "./AIGenerationControls";

interface AssessmentSectionProps {
  complaints: string[];
  vulnerabilities: string[];
  contactId: string;
  transcript: string;
  specialServiceTeam: boolean;
  onSnippetClick?: (snippetId: string) => void;
  complaintsData?: {
    hasComplaints: boolean;
    reasoning: string;
    snippets: string[];
  };
  vulnerabilityData?: {
    hasVulnerability: boolean;
    reasoning: string;
    snippets: string[];
  };
  isLoading?: boolean;
}

export const AssessmentSection = ({ 
  complaints, 
  vulnerabilities, 
  contactId,
  transcript,
  specialServiceTeam,
  onSnippetClick,
  complaintsData,
  vulnerabilityData,
  isLoading
}: AssessmentSectionProps) => {
  const location = useLocation();
  const isManualRoute = location.pathname === '/contact/manual';
  const [isAIOpen, setIsAIOpen] = useState(true);
  const [isQualityOpen, setIsQualityOpen] = useState(true);
  const [assessmentKey, setAssessmentKey] = useState(0);

  const handleAssessmentGenerated = () => {
    setAssessmentKey(prev => prev + 1);
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isAIOpen} onOpenChange={setIsAIOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAIOpen ? "" : "-rotate-90"}`} />
            </Button>
          </CollapsibleTrigger>
          <h2 className="text-xl font-semibold">AI Assessment</h2>
        </div>
        <CollapsibleContent className="mt-4">
          {!isManualRoute && (
            <AIGenerationControls
              transcript={transcript}
              contactId={contactId}
              specialServiceTeam={specialServiceTeam}
              onAssessmentGenerated={handleAssessmentGenerated}
            />
          )}
          <div className={!isManualRoute ? "mt-4" : ""}>
            <AIAssessment 
              key={assessmentKey}
              complaints={complaints}
              vulnerabilities={vulnerabilities}
              hasPhysicalDisability={false}
              contactId={contactId}
              onSnippetClick={onSnippetClick}
              complaintsData={complaintsData}
              vulnerabilityData={vulnerabilityData}
              isLoading={isLoading}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isQualityOpen} onOpenChange={setIsQualityOpen}>
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isQualityOpen ? "" : "-rotate-90"}`} />
            </Button>
          </CollapsibleTrigger>
          <h2 className="text-xl font-semibold">Assessor Feedback</h2>
        </div>
        <CollapsibleContent className="mt-4">
          <QualityAssessmentCard />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
