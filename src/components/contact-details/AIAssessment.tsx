
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
  const { data: aiAssessment, isLoading: internalIsLoading, error } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      console.log("Fetching V&C assessment for contact:", contactId);
      
      try {
        const response = await getVAndCAssessment(contactId);
        console.log("V&C assessment data:", response);
        
        return {
          complaints_flag: response.complaint || false,
          complaints_reasoning: response.complaint_reason,
          relevant_snippet_ids: response.complaint_snippet ? [response.complaint_snippet] : [],
          physical_disability_flag: false,
          physical_disability_reasoning: "",
          vulnerability_flag: response.financial_vulnerability || false,
          vulnerability_reasoning: response.vulnerability_reason,
          vulnerability_snippet_ids: response.vulnerability_snippet ? [response.vulnerability_snippet] : []
        };
      } catch (error) {
        console.error("V&C Assessment Error Details:", {
          error,
          contactId,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    retry: 2,
    enabled: !!contactId && !complaintsData && !vulnerabilityData
  });

  const isLoading = externalIsLoading || internalIsLoading;
  const bothFlagsTrue = (complaintsData?.hasComplaints || aiAssessment?.complaints_flag) && 
                       (vulnerabilityData?.hasVulnerability || aiAssessment?.vulnerability_flag);

  if (isLoading) {
    return (
      <Card className="w-full min-h-[600px]">
        <CardContent className="flex items-center justify-center h-[600px]">
          <div className="text-gray-500">Loading assessment...</div>
        </CardContent>
      </Card>
    );
  }

  if (error && !complaintsData && !vulnerabilityData) {
    return (
      <Card className="w-full min-h-[600px]">
        <CardContent className="flex flex-col items-center justify-center h-[600px] space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="text-red-500 font-medium">Error loading assessment</div>
          <div className="text-sm text-gray-500 max-w-md text-center">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-[600px]">
      <CardContent>
        <div className="space-y-6">
          <PhysicalDisabilitySection
            physicalDisabilityFlag={aiAssessment?.physical_disability_flag || false}
            physicalDisabilityReasoning={aiAssessment?.physical_disability_reasoning}
          />

          <AIAssessmentSection
            complaints={complaints}
            vulnerabilities={vulnerabilities}
            complaintsFlag={complaintsData?.hasComplaints || aiAssessment?.complaints_flag || false}
            vulnerabilityFlag={vulnerabilityData?.hasVulnerability || aiAssessment?.vulnerability_flag || false}
            complaintsReasoning={complaintsData?.reasoning || aiAssessment?.complaints_reasoning}
            vulnerabilityReasoning={vulnerabilityData?.reasoning || aiAssessment?.vulnerability_reasoning}
            bothFlagsTrue={bothFlagsTrue}
            contactId={contactId}
            complaintsSnippetIds={complaintsData?.snippets || aiAssessment?.relevant_snippet_ids || []}
            vulnerabilitySnippetIds={vulnerabilityData?.snippets || aiAssessment?.vulnerability_snippet_ids || []}
            onSnippetClick={onSnippetClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
