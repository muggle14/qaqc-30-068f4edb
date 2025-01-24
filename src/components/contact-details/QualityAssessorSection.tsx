import { useState } from "react";
import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface LocationState {
  contactData: {
    contact_id: string;
    evaluator: string;
  };
}

export const QualityAssessorSection = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { toast } = useToast();

  const [complaintsFlag, setComplaintsFlag] = useState(false);
  const [vulnerabilityFlag, setVulnerabilityFlag] = useState(false);
  const [complaintsReasoning, setComplaintsReasoning] = useState("");
  const [vulnerabilityReasoning, setVulnerabilityReasoning] = useState("");

  const handleSave = async () => {
    try {
      console.log("Saving quality assessor feedback...");
      const { error } = await supabase
        .from("quality_assessor_feedback")
        .upsert({
          contact_id: state.contactData.contact_id,
          evaluator: state.contactData.evaluator,
          complaints_flag: complaintsFlag,
          vulnerability_flag: vulnerabilityFlag,
          complaints_reasoning: complaintsReasoning,
          vulnerability_reasoning: vulnerabilityReasoning,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quality assessor feedback saved successfully",
      });
      console.log("Quality assessor feedback saved successfully");
    } catch (error) {
      console.error("Error saving quality assessor feedback:", error);
      toast({
        title: "Error",
        description: "Failed to save quality assessor feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Quality Assessor Feedback</h2>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Feedback
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <AssessmentCard
          title="Complaints"
          icon={AlertCircle}
          items={[
            "Clear communication throughout the call",
            "Proper identification verification",
            "Effective problem resolution",
            "Professional tone maintained"
          ]}
          flag={complaintsFlag}
          reasoning={complaintsReasoning}
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          isAIAssessment={true}
          onFlagChange={setComplaintsFlag}
          onReasoningChange={setComplaintsReasoning}
        />

        <AssessmentCard
          title="Vulnerability"
          icon={Shield}
          items={[
            "Could have offered additional services",
            "Missed opportunity for feedback collection",
            "Longer than average handling time",
            "Follow-up documentation incomplete"
          ]}
          flag={vulnerabilityFlag}
          reasoning={vulnerabilityReasoning}
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          isAIAssessment={true}
          onFlagChange={setVulnerabilityFlag}
          onReasoningChange={setVulnerabilityReasoning}
        />
      </div>
    </div>
  );
};