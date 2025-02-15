
import { useState } from "react";
import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/integrations/supabase/client";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [otherCategory, setOtherCategory] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [complaintsEvidence, setComplaintsEvidence] = useState("");
  const [vulnerabilityEvidence, setVulnerabilityEvidence] = useState("");

  const handleSave = async () => {
    try {
      console.log("Saving quality assessor feedback...");
      const response = await apiClient.invoke("qa-feedback", {
        contact_id: state.contactData.contact_id,
        evaluator: state.contactData.evaluator,
        complaints_flag: complaintsFlag,
        vulnerability_flag: vulnerabilityFlag,
        complaints_reasoning: complaintsReasoning,
        vulnerability_reasoning: vulnerabilityReasoning,
        vulnerability_categories: selectedCategories,
        other_vulnerability_category: otherCategory,
        complaints_reasons: selectedReasons,
        other_complaints_reason: otherReason,
        complaints_evidence: complaintsEvidence,
        vulnerability_evidence: vulnerabilityEvidence,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to save feedback");
      }

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
    <div className="space-y-2">
      <div className="flex justify-end mb-1">
        <Button onClick={handleSave} size="sm" className="flex items-center gap-1.5">
          <Save className="h-3.5 w-3.5" />
          Save Feedback
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 h-full">
        <AssessmentCard
          title="Complaints"
          icon={AlertCircle}
          items={[]}
          flag={complaintsFlag}
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          onFlagChange={setComplaintsFlag}
          reasoning={complaintsReasoning}
          onReasoningChange={setComplaintsReasoning}
          selectedReasons={selectedReasons}
          otherReason={otherReason}
          onReasonsChange={setSelectedReasons}
          onOtherReasonChange={setOtherReason}
          reviewEvidence={complaintsEvidence}
          onReviewEvidenceChange={setComplaintsEvidence}
        />

        <AssessmentCard
          title="Vulnerability"
          icon={Shield}
          items={[]}
          flag={vulnerabilityFlag}
          bothFlagsTrue={complaintsFlag && vulnerabilityFlag}
          onFlagChange={setVulnerabilityFlag}
          reasoning={vulnerabilityReasoning}
          onReasoningChange={setVulnerabilityReasoning}
          isVulnerability={true}
          selectedCategories={selectedCategories}
          otherCategory={otherCategory}
          onCategoriesChange={setSelectedCategories}
          onOtherCategoryChange={setOtherCategory}
          reviewEvidence={vulnerabilityEvidence}
          onReviewEvidenceChange={setVulnerabilityEvidence}
        />
      </div>
    </div>
  );
};
