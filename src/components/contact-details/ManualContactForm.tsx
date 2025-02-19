
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { ContactFormHeader } from "./ContactFormHeader";
import { TranscriptSection } from "./TranscriptSection";
import { AssessmentSection } from "./AssessmentSection";
import { QualityAssessorSection } from "./QualityAssessorSection";

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
  const [transcript, setTranscript] = useState(initialData.transcript || "");
  const [contactId, setContactId] = useState(initialData.contactId || "");
  const [evaluator, setEvaluator] = useState(initialData.evaluator || "");
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState(initialData.isSpecialServiceTeam || "no");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const hasCriticalChanges = 
      transcript !== initialData.transcript ||
      evaluator !== initialData.evaluator ||
      isSpecialServiceTeam !== initialData.isSpecialServiceTeam;

    setHasUnsavedChanges(hasCriticalChanges);
  }, [transcript, evaluator, isSpecialServiceTeam, initialData]);

  const resetForm = () => {
    setTranscript("");
    setContactId("");
    setEvaluator("");
    setIsSpecialServiceTeam("no");
    setHasUnsavedChanges(false);
    onClearStorage();
  };

  const handleContactIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setContactId(newId);
    onSaveToStorage({
      ...initialData,
      contactId: newId,
    });
  };

  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
    setHasUnsavedChanges(true);
  };

  const handleEvaluatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvaluator(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSpecialServiceTeamChange = (value: "yes" | "no") => {
    setIsSpecialServiceTeam(value);
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    if (!transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide the conversation transcript",
        variant: "destructive",
      });
      return false;
    }

    if (!contactId) {
      toast({
        title: "Missing AWS Ref ID",
        description: "Please enter the AWS Ref ID",
        variant: "destructive",
      });
      return false;
    }

    if (!evaluator) {
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
      const response = await apiClient.saveAssessmentDetails({
        awsRefId: contactId,
        tracksmartId: evaluator,
        transcript: transcript,
        specialServiceTeam: isSpecialServiceTeam === "yes"
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
        contactId={contactId}
        evaluator={evaluator}
        isSpecialServiceTeam={isSpecialServiceTeam}
        onContactIdChange={handleContactIdChange}
        onEvaluatorChange={handleEvaluatorChange}
        onSpecialServiceTeamChange={handleSpecialServiceTeamChange}
      />

      <TranscriptSection
        transcript={transcript}
        contactId={contactId}
        isSpecialServiceTeam={isSpecialServiceTeam === "yes"}
        onTranscriptChange={handleTranscriptChange}
      />

      <AssessmentSection 
        complaints={[]}
        vulnerabilities={[]}
        contactId={contactId}
        transcript={transcript}
        specialServiceTeam={isSpecialServiceTeam === "yes"}
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
