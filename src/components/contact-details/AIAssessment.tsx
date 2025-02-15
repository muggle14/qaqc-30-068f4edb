
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/integrations/supabase/client";
import { PhysicalDisabilitySection } from "./PhysicalDisabilitySection";
import { AIAssessmentSection } from "./AIAssessmentSection";
import { AlertCircle } from "lucide-react";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
  hasPhysicalDisability: boolean;
  contactId: string;
  onSnippetClick?: (snippetId: string) => void;
}

export const AIAssessment = ({ 
  complaints, 
  vulnerabilities, 
  contactId,
  onSnippetClick
}: AIAssessmentProps) => {
  const { data: aiAssessment, isLoading, error } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      console.log("Fetching AI assessment for contact:", contactId);
      
      const response = await apiClient.invoke('contact-assessment', {
        contact_id: contactId
      });

      if (!response.success) {
        console.error("Error fetching assessment:", response.error);
        throw new Error(response.error || "Failed to fetch assessment");
      }

      console.log("AI assessment data:", response.data);
      
      return {
        complaints_flag: response.data.complaints?.complaints_flag || false,
        complaints_reasoning: response.data.complaints?.complaints_reasoning,
        relevant_snippet_ids: response.data.complaints?.relevant_snippet_ids || [],
        physical_disability_flag: response.data.complaints?.physical_disability_flag || false,
        physical_disability_reasoning: response.data.complaints?.physical_disability_reasoning,
        vulnerability_flag: response.data.vulnerability?.vulnerability_flag || false,
        vulnerability_reasoning: response.data.vulnerability?.vulnerability_reasoning,
        vulnerability_snippet_ids: response.data.vulnerability?.relevant_snippet_ids || []
      };
    },
    retry: 1,
    enabled: !!contactId
  });

  const bothFlagsTrue = aiAssessment?.complaints_flag && aiAssessment?.vulnerability_flag;

  if (isLoading) {
    return (
      <Card className="w-full min-h-[600px]">
        <CardContent className="flex items-center justify-center h-[600px]">
          <div className="text-gray-500">Loading assessment...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
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
            complaintsFlag={aiAssessment?.complaints_flag || false}
            vulnerabilityFlag={aiAssessment?.vulnerability_flag || false}
            complaintsReasoning={aiAssessment?.complaints_reasoning}
            vulnerabilityReasoning={aiAssessment?.vulnerability_reasoning}
            bothFlagsTrue={bothFlagsTrue}
            contactId={contactId}
            complaintsSnippetIds={aiAssessment?.relevant_snippet_ids || []}
            vulnerabilitySnippetIds={aiAssessment?.vulnerability_snippet_ids || []}
            onSnippetClick={onSnippetClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
