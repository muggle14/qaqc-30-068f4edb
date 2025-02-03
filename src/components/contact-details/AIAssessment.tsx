import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
      
      const { data, error } = await supabase.functions.invoke('contact-assessment', {
        body: { contact_id: contactId }
      })

      if (error) {
        console.error("Error fetching assessment:", error);
        throw error;
      }

      console.log("AI assessment data:", data);
      
      return {
        complaints_flag: data.complaints?.complaints_flag || false,
        complaints_reasoning: data.complaints?.complaints_reasoning,
        relevant_snippet_ids: data.complaints?.relevant_snippet_ids || [],
        physical_disability_flag: data.complaints?.physical_disability_flag || false,
        physical_disability_reasoning: data.complaints?.physical_disability_reasoning,
        vulnerability_flag: data.vulnerability?.vulnerability_flag || false,
        vulnerability_reasoning: data.vulnerability?.vulnerability_reasoning,
        vulnerability_snippet_ids: data.vulnerability?.relevant_snippet_ids || []
      };
    },
    retry: 1
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
      <Card className="w-full min-h-[600px] container mx-auto">
        <CardContent className="flex flex-col items-center justify-center h-[600px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div className="text-lg font-semibold text-gray-900">Error Loading Assessment</div>
          <div className="text-sm text-gray-500 max-w-md text-center">
            {error instanceof Error ? error.message : 'An unexpected error occurred while loading the assessment data'}
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