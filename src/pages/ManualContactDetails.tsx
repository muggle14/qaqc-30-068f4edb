
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient } from "@/integrations/supabase/client";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { ContactFormHeader } from "@/components/contact-details/ContactFormHeader";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { getSummary, getVAndCAssessment } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const ManualContactDetails = () => {
  const { loadFromStorage, saveToStorage, clearStorage } = useSessionStorage();
  const initialData = loadFromStorage();

  const [transcript, setTranscript] = useState(initialData.transcript || "");
  const [contactId, setContactId] = useState(initialData.contactId || "");
  const [evaluator, setEvaluator] = useState(initialData.evaluator || "");
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState(initialData.isSpecialServiceTeam || "no");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [newContactId, setNewContactId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Query setup with manual triggering
  const { data: summaryData, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['chat-summary', transcript],
    queryFn: () => getSummary(transcript),
    enabled: false, // Don't auto-fetch
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("Summary Query Error:", error);
          toast({
            title: "Summary Generation Failed",
            description: error instanceof Error ? error.message : "Failed to generate summary",
            variant: "destructive",
          });
        }
      }
    }
  });

  const { data: vcAssessment, isLoading: isVCLoading, error: vcError, refetch: refetchVC } = useQuery({
    queryKey: ['vc-assessment', transcript],
    queryFn: () => getVAndCAssessment(transcript),
    enabled: false, // Don't auto-fetch
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error("V&C Assessment Query Error:", error);
          toast({
            title: "Assessment Failed",
            description: error instanceof Error ? error.message : "Failed to generate assessment",
            variant: "destructive",
          });
        }
      }
    }
  });

  const handleGenerateAssessment = async () => {
    if (!transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a conversation transcript first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await Promise.all([refetchSummary(), refetchVC()]);
    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save to session storage when data changes
  useEffect(() => {
    saveToStorage({
      contactId,
      evaluator,
      transcript,
      isSpecialServiceTeam,
      overallSummary: summaryData?.short_summary || "",
      detailedSummaryPoints: summaryData?.detailed_bullet_summary || [],
    });
  }, [contactId, evaluator, transcript, isSpecialServiceTeam, summaryData]);

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

  const renderSummaryContent = () => {
    if (isSummaryLoading || isVCLoading) {
      return (
        <Card className="h-full">
          <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Generating assessment...</p>
          </CardContent>
        </Card>
      );
    }

    if (summaryError || vcError) {
      return (
        <Card className="h-full">
          <CardContent className="h-full flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500 font-medium">Failed to generate assessment</p>
            <p className="text-sm text-gray-500 max-w-md text-center">
              {(summaryError || vcError) instanceof Error 
                ? (summaryError || vcError)?.message 
                : 'An unexpected error occurred while generating the assessment'}
            </p>
            <p className="text-xs text-gray-400">
              Please check the console for more details
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <SummarySection
        overallSummary={summaryData?.short_summary || ""}
        detailedSummaryPoints={summaryData?.detailed_bullet_summary || []}
        isLoading={isSummaryLoading || isVCLoading}
      />
    );
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

        <CollapsibleSection 
          title="Summary & Transcript"
          action={
            <Button
              type="button"
              onClick={handleGenerateAssessment}
              disabled={isGenerating || !transcript}
              className="ml-auto"
            >
              Generate AI Assessment
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            {renderSummaryContent()}
            <TranscriptCard
              transcript={transcript}
              onTranscriptChange={setTranscript}
              isLoading={isSummaryLoading || isVCLoading}
            />
          </div>
        </CollapsibleSection>

        <AssessmentSection 
          complaints={[]}
          vulnerabilities={[]}
          contactId={contactId}
          transcript={transcript}
          specialServiceTeam={isSpecialServiceTeam === "yes"}
          complaintsData={vcAssessment ? {
            hasComplaints: vcAssessment.complaint || false,
            reasoning: vcAssessment.complaint_reason || "",
            snippets: vcAssessment.complaint_snippet ? [vcAssessment.complaint_snippet] : []
          } : undefined}
          vulnerabilityData={vcAssessment ? {
            hasVulnerability: vcAssessment.financial_vulnerability || false,
            reasoning: vcAssessment.vulnerability_reason || "",
            snippets: vcAssessment.vulnerability_snippet ? [vcAssessment.vulnerability_snippet] : []
          } : undefined}
          isLoading={isSummaryLoading || isVCLoading}
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
