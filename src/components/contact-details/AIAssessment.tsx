import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PhysicalDisabilityCard } from "./PhysicalDisabilityCard";
import { AssessmentCard } from "./AssessmentCard";

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
        ...complaintsData,
        vulnerability_flag: vulnerabilityData?.vulnerability_flag || false,
        vulnerability_reasoning: vulnerabilityData?.vulnerability_reasoning
      };
    }
  });

  const bothFlagsTrue = aiAssessment?.complaints_flag && aiAssessment?.vulnerability_flag;

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Assessment & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <PhysicalDisabilityCard
              physicalDisabilityFlag={aiAssessment?.physical_disability_flag || false}
              physicalDisabilityReasoning={aiAssessment?.physical_disability_reasoning}
            />

            <div className="grid grid-cols-2 gap-6">
              <AssessmentCard
                title="Complaints"
                icon={AlertCircle}
                items={complaints}
                flag={aiAssessment?.complaints_flag || false}
                reasoning={aiAssessment?.complaints_reasoning}
                bothFlagsTrue={bothFlagsTrue}
                isAIAssessment={true}
              />

              <AssessmentCard
                title="Vulnerabilities"
                icon={Shield}
                items={vulnerabilities}
                flag={aiAssessment?.vulnerability_flag || false}
                reasoning={aiAssessment?.vulnerability_reasoning}
                bothFlagsTrue={bothFlagsTrue}
                isAIAssessment={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quality Assessor Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <AssessmentCard
              title="Strengths"
              icon={AlertCircle}
              items={[
                "Clear communication throughout the call",
                "Proper identification verification",
                "Effective problem resolution",
                "Professional tone maintained"
              ]}
              flag={false}
              reasoning={"Agent demonstrated strong customer service skills"}
              bothFlagsTrue={false}
              isAIAssessment={false}
            />

            <AssessmentCard
              title="Areas for Improvement"
              icon={Shield}
              items={[
                "Could have offered additional services",
                "Missed opportunity for feedback collection",
                "Longer than average handling time",
                "Follow-up documentation incomplete"
              ]}
              flag={false}
              reasoning={"Some opportunities for process optimization identified"}
              bothFlagsTrue={false}
              isAIAssessment={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};