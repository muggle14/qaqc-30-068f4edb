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
import { QualityAssessorSection } from "@/components/contact-details/QualityAssessorSection";

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

  const testSummaryData = async () => {
    console.log('Testing summary data update...');
    try {
      const testResponse = {
        short_summary: "This is a test summary",
        detailed_bullet_summary: ["Test bullet 1", "Test bullet 2"]
      };
      console.log('Setting test data:', testResponse);
      const result = await refetchSummary();
      console.log('Test data result:', result);
    } catch (error) {
      console.error('Test data error:', error);
    }
  };

  const { data: summaryData, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['chat-summary', transcript],
    queryFn: async () => {
      const response = await getSummary(transcript);
      console.log('Raw summary response:', response);
      return {
        short_summary: response.short_summary || "",
        detailed_bullet_summary: Array.isArray(response.detailed_bullet_summary) 
          ? response.detailed_bullet_summary 
          : []
      };
    },
    enabled: false,
  });

  const { data: vcAssessment, isLoading: isVCLoading, error: vcError, refetch: refetchVC } = useQuery({
    queryKey: ['vc-assessment', transcript],
    queryFn: async () => {
      const response = await getVAndCAssessment(transcript);
      console.log('Raw V&C assessment response:', response);
      return {
        complaint: response.complaint || false,
        complaint_reason: response.complaint_reason || "",
        financial_vulnerability: response.financial_vulnerability || false,
        vulnerability_reason: response.vulnerability_reason || "",
        complaint_snippet: response.complaint_snippet || "",
        vulnerability_snippet: response.vulnerability_snippet || ""
      };
    },
    enabled: false,
  });

  useEffect(() => {
    console.log('Summary data updated:', summaryData);
  }, [summaryData]);

  useEffect(() => {
    console.log('V&C Assessment data updated:', vcAssessment);
  }, [vcAssessment]);

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
      console.log('Starting assessment generation...');
      const [summaryResult, vcResult] = await Promise.all([refetchSummary(), refetchVC()]);
      console.log('Assessment generation completed:', {
        summaryData: summaryResult.data,
        vcData: vcResult.data
      });
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

  const renderSummaryContent = () => {
    console.log('Rendering summary content with:', {
      summaryData,
      isLoading: isSummaryLoading || isVCLoading
    });

    if (isSummaryLoading || isVCLoading) {
      return (
        <Card className="h-full">
          <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Generating assessment...</p>
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

  useEffect(() => {
    const dataToSave = {
      contactId,
      evaluator,
      transcript,
      isSpecialServiceTeam,
      overallSummary: summaryData?.short_summary || "",
      detailedSummaryPoints: summaryData?.detailed_bullet_summary || [],
    };
    console.log('Saving to storage:', dataToSave);
    saveToStorage(dataToSave);
  }, [contactId, evaluator, transcript, isSpecialServiceTeam, summaryData]);

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
      const response = await apiClient.saveAssessmentDetails({
        awsRefId: contactId,
        tracksmartId: evaluator,
        transcript: transcript,
        specialServiceTeam: isSpecialServiceTeam === "yes"
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

  const handleTranscriptFormatted = (formattedTranscript: string) => {
    setTranscript(formattedTranscript);
    setHasUnsavedChanges(true);
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
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={testSummaryData}
                variant="outline"
                size="sm"
                className="hidden"
              >
                Test Data
              </Button>
              <AIGenerationControls
                transcript={transcript}
                contactId={contactId}
                specialServiceTeam={isSpecialServiceTeam === "yes"}
                onAssessmentGenerated={handleGenerateAssessment}
                onTranscriptFormatted={handleTranscriptFormatted}
              />
            </div>
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
            hasComplaints: vcAssessment.complaint,
            reasoning: vcAssessment.complaint_reason,
            snippets: vcAssessment.complaint_snippet ? [vcAssessment.complaint_snippet] : []
          } : undefined}
          vulnerabilityData={vcAssessment ? {
            hasVulnerability: vcAssessment.financial_vulnerability,
            reasoning: vcAssessment.vulnerability_reason,
            snippets: vcAssessment.vulnerability_snippet ? [vcAssessment.vulnerability_snippet] : []
          } : undefined}
          isLoading={isSummaryLoading || isVCLoading}
        />

        <CollapsibleSection title="Quality Assessor Feedback">
          <QualityAssessorSection />
        </CollapsibleSection>

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
