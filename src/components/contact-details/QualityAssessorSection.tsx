import { useState } from "react";
import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium">Complaints Flag:</h3>
          <RadioGroup 
            value={complaintsFlag ? "yes" : "no"} 
            className="flex items-center space-x-4"
            onValueChange={(value) => setComplaintsFlag(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="no" 
                id="complaints-no"
                className={!complaintsFlag ? 'border-green-500 text-green-500' : 'border-gray-300'}
              />
              <label 
                htmlFor="complaints-no" 
                className={`text-sm ${!complaintsFlag ? 'text-green-500 font-medium' : 'text-gray-500'}`}
              >
                No
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="yes" 
                id="complaints-yes"
                className={complaintsFlag ? 'border-red-500 text-red-500' : 'border-gray-300'}
              />
              <label 
                htmlFor="complaints-yes" 
                className={`text-sm ${complaintsFlag ? 'text-red-500 font-medium' : 'text-gray-500'}`}
              >
                Yes
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-4">
          <h3 className="font-medium">Vulnerability Flag:</h3>
          <RadioGroup 
            value={vulnerabilityFlag ? "yes" : "no"} 
            className="flex items-center space-x-4"
            onValueChange={(value) => setVulnerabilityFlag(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="no" 
                id="vulnerability-no"
                className={!vulnerabilityFlag ? 'border-green-500 text-green-500' : 'border-gray-300'}
              />
              <label 
                htmlFor="vulnerability-no" 
                className={`text-sm ${!vulnerabilityFlag ? 'text-green-500 font-medium' : 'text-gray-500'}`}
              >
                No
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="yes" 
                id="vulnerability-yes"
                className={vulnerabilityFlag ? 'border-red-500 text-red-500' : 'border-gray-300'}
              />
              <label 
                htmlFor="vulnerability-yes" 
                className={`text-sm ${vulnerabilityFlag ? 'text-red-500 font-medium' : 'text-gray-500'}`}
              >
                Yes
              </label>
            </div>
          </RadioGroup>
        </div>
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
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          onFlagChange={setComplaintsFlag}
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
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          onFlagChange={setVulnerabilityFlag}
        />
      </div>
    </div>
  );
};