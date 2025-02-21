
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { ContactFormHeader } from "./ContactFormHeader";
import { TranscriptSection } from "./TranscriptSection";
import { AssessmentSection } from "./AssessmentSection";
import { QualityAssessorSection } from "./QualityAssessorSection";

interface FormState {
  transcript: string;
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  assessmentKey: number;
  complaints: any[];
  vulnerabilities: any[];
}

const initialFormState: FormState = {
  transcript: "",
  contactId: "",
  evaluator: "",
  isSpecialServiceTeam: "no",
  assessmentKey: 0,
  complaints: [],
  vulnerabilities: [],
};

interface ManualContactFormProps {
  initialData: any;
  onSaveToStorage: (data: any) => void;
  onClearStorage: () => void;
}

export const ManualContactForm = ({
  initialData,
  onSaveToStorage,
  onClearStorage,
}: ManualContactFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    ...initialFormState,
    ...initialData,
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
    setFormState(initialFormState);
    setHasUnsavedChanges(false);
    onClearStorage();
  };

  const handleContactIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setFormState(prev => ({ ...prev, contactId: newId }));
    onSaveToStorage({
      ...initialData,
      contactId: newId,
    });
  };

  const handleTranscriptChange = (newTranscript: string) => {
    setFormState(prev => ({ ...prev, transcript: newTranscript }));
    setHasUnsavedChanges(true);
  };

  const handleEvaluatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, evaluator: e.target.value }));
    setHasUnsavedChanges(true);
  };

  const handleSpecialServiceTeamChange = (value: "yes" | "no") => {
    setFormState(prev => ({ ...prev, isSpecialServiceTeam: value }));
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
        specialServiceTeam: formState.isSpecialServiceTeam === "yes"
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
        onContactIdChange={handleContactIdChange}
        onEvaluatorChange={handleEvaluatorChange}
        onSpecialServiceTeamChange={handleSpecialServiceTeamChange}
      />

      <TranscriptSection
        transcript={formState.transcript}
        contactId={formState.contactId}
        isSpecialServiceTeam={formState.isSpecialServiceTeam === "yes"}
        onTranscriptChange={handleTranscriptChange}
      />

      <AssessmentSection 
        complaints={formState.complaints}
        vulnerabilities={formState.vulnerabilities}
        contactId={formState.contactId}
        transcript={formState.transcript}
        specialServiceTeam={formState.isSpecialServiceTeam === "yes"}
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
