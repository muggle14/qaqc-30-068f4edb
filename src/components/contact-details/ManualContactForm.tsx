
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { ContactFormHeader } from "./ContactFormHeader";
import { TranscriptSection } from "./TranscriptSection";
import { AssessmentSection } from "./AssessmentSection";
import { QualityAssessorSection } from "./QualityAssessorSection";
import { AssessmentFormData, initialFormState } from "./types";

interface ManualContactFormProps {
  initialData: Partial<AssessmentFormData>;
  onSaveToStorage: (data: Partial<AssessmentFormData>) => void;
  onClearStorage: () => void;
}

export const ManualContactForm = ({
  initialData,
  onSaveToStorage,
  onClearStorage,
}: ManualContactFormProps) => {
  const [formState, setFormState] = useState<AssessmentFormData>({
    ...initialFormState,
    ...initialData
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const hasCriticalChanges = 
      formState.transcript !== initialData.transcript ||
      formState.evaluator !== initialData.evaluator ||
      formState.isSpecialServiceTeam !== initialData.isSpecialServiceTeam;

    setHasUnsavedChanges(hasCriticalChanges);
  }, [formState, initialData]);

  const resetForm = () => {
    setFormState(prevState => ({
      ...initialFormState,
      // Preserve contact ID as it's typically needed for reference
      contactId: prevState.contactId
    }));
    setHasUnsavedChanges(false);
    onClearStorage();
  };

  const handleFormUpdate = (updates: Partial<AssessmentFormData>) => {
    setFormState(prev => {
      const newState = { ...prev, ...updates };
      onSaveToStorage(newState);
      return newState;
    });
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    if (!formState.transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide the conversation transcript",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.contactId) {
      toast({
        title: "Missing AWS Ref ID",
        description: "Please enter the AWS Ref ID",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.evaluator) {
      toast({
        title: "Missing TrackSmart ID",
        description: "Please enter your TrackSmart ID",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm() || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await apiClient.saveAssessmentDetails({
        awsRefId: formState.contactId,
        tracksmartId: formState.evaluator,
        transcript: formState.transcript,
        specialServiceTeam: formState.isSpecialServiceTeam === "yes",
        complaints: formState.complaints,
        vulnerabilities: formState.vulnerabilities
      });

      toast({
        title: "Success",
        description: "Assessment details saved successfully",
        variant: "success",
      });

      resetForm();
    } catch (error) {
      console.error("Error saving assessment details:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContactFormHeader
        contactId={formState.contactId}
        evaluator={formState.evaluator}
        isSpecialServiceTeam={formState.isSpecialServiceTeam}
        onContactIdChange={(e) => handleFormUpdate({ contactId: e.target.value })}
        onEvaluatorChange={(e) => handleFormUpdate({ evaluator: e.target.value })}
        onSpecialServiceTeamChange={(value) => handleFormUpdate({ isSpecialServiceTeam: value })}
      />

      <TranscriptSection
        transcript={formState.transcript}
        contactId={formState.contactId}
        isSpecialServiceTeam={formState.isSpecialServiceTeam === "yes"}
        onTranscriptChange={(newTranscript) => handleFormUpdate({ transcript: newTranscript })}
      />

      <AssessmentSection 
        complaints={formState.complaints}
        vulnerabilities={formState.vulnerabilities}
        contactId={formState.contactId}
        transcript={formState.transcript}
        specialServiceTeam={formState.isSpecialServiceTeam === "yes"}
        onComplaintsChange={(updates) => 
          handleFormUpdate({ 
            complaints: { ...formState.complaints, ...updates } 
          })
        }
        onVulnerabilitiesChange={(updates) => 
          handleFormUpdate({ 
            vulnerabilities: { ...formState.vulnerabilities, ...updates } 
          })
        }
      />

      <QualityAssessorSection />

      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Assessment Details"}
        </Button>
      </div>
    </form>
  );
};
