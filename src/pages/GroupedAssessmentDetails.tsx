import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactFormHeader } from "@/components/contact-details/ContactFormHeader";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { apiClient } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AssessmentQuestion {
  id: string;
  aiAssessment: string;
  assessorFeedback: string;
}

const GroupedAssessmentDetails = () => {
  const { loadFromStorage, saveToStorage, clearStorage } = useSessionStorage();
  const initialData = loadFromStorage();

  // Basic form states
  const [contactId, setContactId] = useState(initialData.contactId || "");
  const [evaluator, setEvaluator] = useState(initialData.evaluator || "");
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState<"yes" | "no">(
    initialData.isSpecialServiceTeam || "no"
  );
  const [transcript, setTranscript] = useState(initialData.transcript || "");
  const [overallSummary, setOverallSummary] = useState(initialData.overallSummary || "");
  const [detailedSummaryPoints, setDetailedSummaryPoints] = useState<string[]>(
    initialData.detailedSummaryPoints || []
  );

  // Assessment questions state
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>(
    initialData.assessmentQuestions || [
      { id: "Q1", aiAssessment: "", assessorFeedback: "" },
      { id: "Q2", aiAssessment: "", assessorFeedback: "" },
      { id: "Q3", aiAssessment: "", assessorFeedback: "" },
    ]
  );

  // UI states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [newContactId, setNewContactId] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch AI assessment
  const { data: aiAssessment, isLoading: isLoadingAI } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      const response = await apiClient.invoke('ai-assess-complaints', {
        contact_id: contactId
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch AI assessment");
      }
      return response.data;
    },
    enabled: !!contactId
  });

  // Update effect to set summary from AI assessment
  useEffect(() => {
    if (aiAssessment) {
      setOverallSummary(aiAssessment.overall_summary || "");
      setDetailedSummaryPoints(aiAssessment.detailed_summary_points || []);
    }
  }, [aiAssessment]);

  // Track changes
  useEffect(() => {
    if (transcript || evaluator || isSpecialServiceTeam !== "no" || 
        assessmentQuestions.some(q => q.assessorFeedback)) {
      setHasUnsavedChanges(true);
    }
  }, [transcript, evaluator, isSpecialServiceTeam, assessmentQuestions]);

  // Save to session storage
  useEffect(() => {
    saveToStorage({
      contactId,
      evaluator,
      transcript,
      isSpecialServiceTeam,
      overallSummary,
      detailedSummaryPoints,
      assessmentQuestions
    });
  }, [contactId, evaluator, transcript, isSpecialServiceTeam, assessmentQuestions, overallSummary, detailedSummaryPoints]);

  const handleContactIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    if (hasUnsavedChanges) {
      setNewContactId(newId);
      setShowUnsavedDialog(true);
    } else {
      setContactId(newId);
    }
  };

  const handleProceedWithoutSaving = () => {
    setShowUnsavedDialog(false);
    setContactId(newContactId);
    setHasUnsavedChanges(false);
    setTranscript("");
    setEvaluator("");
    setIsSpecialServiceTeam("no");
    setOverallSummary("");
    setDetailedSummaryPoints([]);
    setAssessmentQuestions([
      { id: "Q1", aiAssessment: "", assessorFeedback: "" },
      { id: "Q2", aiAssessment: "", assessorFeedback: "" },
      { id: "Q3", aiAssessment: "", assessorFeedback: "" },
    ]);
    clearStorage();
  };

  const validateForm = () => {
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

    if (!transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide the conversation transcript",
        variant: "destructive",
      });
      return false;
    }

    if (!assessmentQuestions.some(q => q.assessorFeedback)) {
      toast({
        title: "Missing Feedback",
        description: "Please provide at least one assessment feedback",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await apiClient.saveAssessmentDetails({
        awsRefId: contactId,
        tracksmartId: evaluator,
        transcript: transcript,
        specialServiceTeam: isSpecialServiceTeam === "yes",
        assessmentQuestions
      });

      clearStorage();
      setHasUnsavedChanges(false);

      toast({
        title: "Success",
        description: "Assessment details saved successfully",
      });

      navigate("/contact/view", {
        state: {
          contactData: {
            contact_id: contactId,
            evaluator: evaluator,
          }
        }
      });
    } catch (error) {
      console.error("Error saving assessment details:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <form onSubmit={handleSave}>
        <ContactFormHeader
          contactId={contactId}
          evaluator={evaluator}
          isSpecialServiceTeam={isSpecialServiceTeam}
          onContactIdChange={handleContactIdChange}
          onEvaluatorChange={(e) => setEvaluator(e.target.value)}
          onSpecialServiceTeamChange={setIsSpecialServiceTeam}
        />

        <CollapsibleSection title="Summary & Transcript">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <SummarySection
              overallSummary={overallSummary}
              detailedSummaryPoints={detailedSummaryPoints}
              isLoading={isLoadingAI}
            />
            <TranscriptCard
              transcript={transcript}
              onTranscriptChange={setTranscript}
              isLoading={isLoadingAI}
            />
          </div>
        </CollapsibleSection>

        {assessmentQuestions.map((question, index) => (
          <CollapsibleSection key={question.id} title={`Assessment Question ${index + 1}`}>
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">AI Assessment</h3>
                <p className="text-sm text-gray-600">
                  {question.aiAssessment || "No AI assessment available"}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Assessor Feedback</h3>
                <textarea
                  value={question.assessorFeedback}
                  onChange={(e) => {
                    const newQuestions = [...assessmentQuestions];
                    newQuestions[index].assessorFeedback = e.target.value;
                    setAssessmentQuestions(newQuestions);
                  }}
                  className="w-full h-32 p-2 border rounded-md"
                  placeholder="Enter your feedback here..."
                />
              </div>
            </div>
          </CollapsibleSection>
        ))}

        <div className="flex justify-end mt-6">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Assessment Details
          </Button>
        </div>
      </form>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Your responses are not yet saved to the database. Do you want to save your changes before proceeding?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedWithoutSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Proceed Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupedAssessmentDetails;
