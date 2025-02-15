
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient } from "@/integrations/supabase/client";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Session storage keys
const STORAGE_KEYS = {
  CONTACT_ID: 'manual_contact_id',
  EVALUATOR: 'manual_evaluator',
  TRANSCRIPT: 'manual_transcript',
  SPECIAL_SERVICE: 'manual_special_service',
  SUMMARY: 'manual_summary',
  SUMMARY_POINTS: 'manual_summary_points',
} as const;

const ManualContactDetails = () => {
  const [transcript, setTranscript] = useState("");
  const [contactId, setContactId] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState<"yes" | "no">("no");
  const [overallSummary, setOverallSummary] = useState("No summary available yet");
  const [detailedSummaryPoints, setDetailedSummaryPoints] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [newContactId, setNewContactId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();

  // Load data from session storage on mount
  useEffect(() => {
    try {
      const storedContactId = sessionStorage.getItem(STORAGE_KEYS.CONTACT_ID);
      const storedEvaluator = sessionStorage.getItem(STORAGE_KEYS.EVALUATOR);
      const storedTranscript = sessionStorage.getItem(STORAGE_KEYS.TRANSCRIPT);
      const storedSpecialService = sessionStorage.getItem(STORAGE_KEYS.SPECIAL_SERVICE);
      const storedSummary = sessionStorage.getItem(STORAGE_KEYS.SUMMARY);
      const storedSummaryPoints = sessionStorage.getItem(STORAGE_KEYS.SUMMARY_POINTS);

      if (storedContactId) setContactId(storedContactId);
      if (storedEvaluator) setEvaluator(storedEvaluator);
      if (storedTranscript) setTranscript(storedTranscript);
      if (storedSpecialService) setIsSpecialServiceTeam(storedSpecialService as "yes" | "no");
      if (storedSummary) setOverallSummary(storedSummary);
      if (storedSummaryPoints) setDetailedSummaryPoints(JSON.parse(storedSummaryPoints));
    } catch (error) {
      console.error('Error loading from session storage:', error);
      toast({
        title: "Warning",
        description: "Failed to load saved data. Your changes may not be preserved.",
        variant: "destructive",
      });
    }
  }, []);

  // Save to session storage when data changes
  useEffect(() => {
    try {
      if (contactId) sessionStorage.setItem(STORAGE_KEYS.CONTACT_ID, contactId);
      if (evaluator) sessionStorage.setItem(STORAGE_KEYS.EVALUATOR, evaluator);
      if (transcript) sessionStorage.setItem(STORAGE_KEYS.TRANSCRIPT, transcript);
      sessionStorage.setItem(STORAGE_KEYS.SPECIAL_SERVICE, isSpecialServiceTeam);
      if (overallSummary !== "No summary available yet") {
        sessionStorage.setItem(STORAGE_KEYS.SUMMARY, overallSummary);
      }
      if (detailedSummaryPoints.length > 0) {
        sessionStorage.setItem(STORAGE_KEYS.SUMMARY_POINTS, JSON.stringify(detailedSummaryPoints));
      }
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
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
    // Clear form fields and session storage
    setTranscript("");
    setEvaluator("");
    setIsSpecialServiceTeam("no");
    Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
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

      // Clear session storage after successful save
      Object.values(STORAGE_KEYS).forEach(key => sessionStorage.removeItem(key));
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactId">AWS Ref ID</Label>
                <Input
                  id="contactId"
                  value={contactId}
                  onChange={handleContactIdChange}
                  placeholder="Enter AWS Ref ID"
                  maxLength={30}
                  required
                  className="font-mono w-3/4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluator">TrackSmart ID</Label>
                <Input
                  id="evaluator"
                  value={evaluator}
                  onChange={(e) => setEvaluator(e.target.value)}
                  placeholder="Enter TrackSmart ID"
                  maxLength={30}
                  required
                  className="w-3/4"
                />
              </div>
            </div>
            <ContactInfo 
              contactId={contactId}
              evaluator={evaluator}
              isSpecialServiceTeam={isSpecialServiceTeam}
              onSpecialServiceTeamChange={setIsSpecialServiceTeam}
            />
          </CardContent>
        </Card>

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
