
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient } from "@/integrations/supabase/client";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { ContactFormHeader } from "@/components/contact-details/ContactFormHeader";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const ManualContactDetails = () => {
  const { loadFromStorage, saveToStorage, clearStorage } = useSessionStorage();
  const initialData = loadFromStorage();

  const [transcript, setTranscript] = useState(initialData.transcript);
  const [contactId, setContactId] = useState(initialData.contactId);
  const [evaluator, setEvaluator] = useState(initialData.evaluator);
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState(initialData.isSpecialServiceTeam);
  const [overallSummary, setOverallSummary] = useState(initialData.overallSummary);
  const [detailedSummaryPoints, setDetailedSummaryPoints] = useState(initialData.detailedSummaryPoints);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [newContactId, setNewContactId] = useState("");
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();

  const navigate = useNavigate();
  const { toast } = useToast();

  // Save to session storage when data changes
  useEffect(() => {
    saveToStorage({
      contactId,
      evaluator,
      transcript,
      isSpecialServiceTeam,
      overallSummary,
      detailedSummaryPoints,
    });
  }, [contactId, evaluator, transcript, isSpecialServiceTeam, overallSummary, detailedSummaryPoints]);

  // AI Assessment query with streaming support
  const { data: aiAssessment } = useQuery({
    queryKey: ['ai-assessment', contactId],
    queryFn: async () => {
      if (!contactId) return null;
      
      const response = await apiClient.invoke('contact-assessment', {
        contact_id: contactId
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch AI assessment");
      }

      return response.data;
    },
    enabled: !!contactId
  });

  // Track form changes
  useEffect(() => {
    if (transcript || evaluator || isSpecialServiceTeam !== "no") {
      setHasUnsavedChanges(true);
    }
  }, [transcript, evaluator, isSpecialServiceTeam]);

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
    clearStorage();
  };

  const handleSnippetClick = (snippetId: string) => {
    setHighlightedSnippetId(snippetId);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await apiClient.invoke("upload-details", {
        data: [{
          contact_id: contactId,
          evaluator: evaluator,
          transcript: transcript,
          admin_id: null,
          special_service_team: isSpecialServiceTeam === "yes"
        }]
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to save contact details");
      }

      clearStorage();
      setHasUnsavedChanges(false);

      toast({
        title: "Success",
        description: "Contact details saved successfully",
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
      console.error("Error saving contact details:", error);
      toast({
        title: "Error",
        description: "Failed to save contact details",
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
            />
            
            <TranscriptCard
              transcript={transcript}
              onTranscriptChange={setTranscript}
              snippetsMetadata={aiAssessment?.snippets}
              highlightedSnippetId={highlightedSnippetId}
            />
          </div>
        </CollapsibleSection>

        <AssessmentSection 
          complaints={aiAssessment?.complaints?.items || []}
          vulnerabilities={aiAssessment?.vulnerability?.items || []}
          contactId={contactId}
          transcript={transcript || ""}
          onSnippetClick={handleSnippetClick}
          specialServiceTeam={isSpecialServiceTeam === "yes"}
        />

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
            <AlertDialogAction onClick={handleProceedWithoutSaving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Proceed Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManualContactDetails;
