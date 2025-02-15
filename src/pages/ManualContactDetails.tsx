
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/integrations/supabase/client";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { CollapsibleSection } from "@/components/contact-details/CollapsibleSection";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ManualContactDetails = () => {
  const [transcript, setTranscript] = useState("");
  const [contactId, setContactId] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState<"yes" | "no">("no");
  const [overallSummary, setOverallSummary] = useState("No summary available yet");
  const [detailedSummaryPoints, setDetailedSummaryPoints] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();

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

  useEffect(() => {
    const cachedTranscript = sessionStorage.getItem('cachedTranscript');
    if (cachedTranscript) {
      setTranscript(cachedTranscript);
    }
  }, []);

  const handleSnippetClick = (snippetId: string) => {
    setHighlightedSnippetId(snippetId);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transcript || !contactId || !evaluator) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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

      sessionStorage.removeItem('cachedTranscript');

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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactId">AWS Ref ID</Label>
                <div className="w-3/4">
                  <Input
                    id="contactId"
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    placeholder="Enter AWS Ref ID"
                    maxLength={30}
                    required
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluator">TrackSmart ID</Label>
                <div className="w-3/4">
                  <Input
                    id="evaluator"
                    value={evaluator}
                    onChange={(e) => setEvaluator(e.target.value)}
                    placeholder="Enter TrackSmart ID"
                    maxLength={30}
                    required
                  />
                </div>
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
    </div>
  );
};

export default ManualContactDetails;
