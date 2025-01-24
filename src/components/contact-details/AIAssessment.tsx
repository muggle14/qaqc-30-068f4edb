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
  const { data: aiAssessment } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      console.log("Fetching AI assessment for contact:", contactId);
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('ai_assess_complaints')
        .select('*')
        .eq('contact_id', contactId)
        .maybeSingle();

      if (complaintsError) {
        console.error("Error fetching complaints assessment:", complaintsError);
        throw complaintsError;
      }

      const { data: vulnerabilityData, error: vulnerabilityError } = await supabase
        .from('ai_assess_vulnerability')
        .select('*')
        .eq('contact_id', contactId)
        .maybeSingle();

      if (vulnerabilityError) {
        console.error("Error fetching vulnerability assessment:", vulnerabilityError);
        throw vulnerabilityError;
      }

      console.log("AI assessment data:", { complaintsData, vulnerabilityData });
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
    }
  });

  const bothFlagsTrue = aiAssessment?.complaints_flag && aiAssessment?.vulnerability_flag;

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