
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { PhysicalDisabilitySection } from "./PhysicalDisabilitySection";
import { AIAssessmentSection } from "./AIAssessmentSection";
import { AlertCircle } from "lucide-react";
import { getVAndCAssessment } from "@/lib/api";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
  hasPhysicalDisability: boolean;
  contactId: string;
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

export const AIAssessment = ({ 
  complaints, 
  vulnerabilities, 
  contactId,
  onSnippetClick,
  complaintsData,
  vulnerabilityData,
  isLoading: externalIsLoading
}: AIAssessmentProps) => {
  console.log('AIAssessment rendered with:', {
    complaintsData,
    vulnerabilityData,
    externalIsLoading
  });

  if (externalIsLoading) {
    return (
      <Card className="w-full min-h-[600px]">
        <CardContent className="flex items-center justify-center h-[600px]">
          <div className="text-gray-500">Loading assessment...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-[600px]">
      <CardContent>
        <div className="space-y-6">
          <AIAssessmentSection
            complaints={complaints}
            vulnerabilities={vulnerabilities}
            complaintsFlag={complaintsData?.hasComplaints || false}
            vulnerabilityFlag={vulnerabilityData?.hasVulnerability || false}
            complaintsReasoning={complaintsData?.reasoning || "No complaint reasoning provided"}
            vulnerabilityReasoning={vulnerabilityData?.reasoning || "No vulnerability reasoning provided"}
            bothFlagsTrue={!!(complaintsData?.hasComplaints && vulnerabilityData?.hasVulnerability)}
            contactId={contactId}
            complaintsSnippetIds={complaintsData?.snippets || []}
            vulnerabilitySnippetIds={vulnerabilityData?.snippets || []}
            onSnippetClick={onSnippetClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
