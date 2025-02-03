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
      
      // First, get the complaints assessment
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('ai_assess_complaints')
        .select('*')
        .eq('contact_id', contactId)
        .single();

      if (complaintsError) {
        console.error("Error fetching complaints assessment:", complaintsError);
        throw complaintsError;
      }

      // Then, get the vulnerability assessment
      const { data: vulnerabilityData, error: vulnerabilityError } = await supabase
        .from('ai_assess_vulnerability')
        .select('*')
        .eq('contact_id', contactId)
        .single();

      if (vulnerabilityError) {
        console.error("Error fetching vulnerability assessment:", vulnerabilityError);
        throw vulnerabilityError;
      }

      console.log("AI assessment data - Complaints:", complaintsData);
      console.log("AI assessment data - Vulnerability:", vulnerabilityData);
      
      return {
        complaints_flag: complaintsData?.complaints_flag || false,
        complaints_reasoning: complaintsData?.complaints_reasoning,
        relevant_snippet_ids: complaintsData?.relevant_snippet_ids || [],
        physical_disability_flag: complaintsData?.physical_disability_flag || false,
        physical_disability_reasoning: complaintsData?.physical_disability_reasoning,
        vulnerability_flag: vulnerabilityData?.vulnerability_flag || false,
        vulnerability_reasoning: vulnerabilityData?.vulnerability_reasoning,
        vulnerability_snippet_ids: vulnerabilityData?.relevant_snippet_ids || []
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