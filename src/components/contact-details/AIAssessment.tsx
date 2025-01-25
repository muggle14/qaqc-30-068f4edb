import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PhysicalDisabilitySection } from "./PhysicalDisabilitySection";
import { AIAssessmentSection } from "./AIAssessmentSection";

interface AIAssessmentProps {
  complaints: string[];
  vulnerabilities: string[];
  hasPhysicalDisability: boolean;
  contactId: string;
}

export const AIAssessment = ({ 
  complaints, 
  vulnerabilities, 
  contactId 
}: AIAssessmentProps) => {
  const { data: aiAssessment, isLoading } = useQuery({
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
    }
  });

  const bothFlagsTrue = aiAssessment?.complaints_flag && aiAssessment?.vulnerability_flag;

  if (isLoading) {
    return <div>Loading assessment...</div>;
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
          />
        </div>
      </CardContent>
    </Card>
  );
};