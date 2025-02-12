
import { useState } from "react";
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
import { Save } from "lucide-react";

const ManualContactDetails = () => {
  const [transcript, setTranscript] = useState("");
  const [contactId, setContactId] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [overallSummary, setOverallSummary] = useState("No summary available yet");
  const [detailedSummaryPoints, setDetailedSummaryPoints] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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
          admin_id: null
        }]
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to save contact details");
      }

      toast({
        title: "Success",
        description: "Contact details saved successfully",
      });

      // Navigate to contact details view with the saved data
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
                <Label htmlFor="contactId">Contact ID</Label>
                <div className="w-3/4">
                  <Input
                    id="contactId"
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    placeholder="Enter contact ID"
                    maxLength={30}
                    required
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluator">Evaluator</Label>
                <div className="w-3/4">
                  <Input
                    id="evaluator"
                    value={evaluator}
                    onChange={(e) => setEvaluator(e.target.value)}
                    placeholder="Enter evaluator name"
                    maxLength={30}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <SummarySection 
            overallSummary={overallSummary}
            detailedSummaryPoints={detailedSummaryPoints}
          />
          
          <Card className="h-[calc(50vh-8rem)]">
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter conversation transcript"
                className="h-full font-mono border-0 rounded-t-none resize-none"
                required
              />
            </CardContent>
          </Card>
        </div>

        <AssessmentSection 
          complaints={[]}
          vulnerabilities={[]}
          contactId={contactId || "pending"}
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Contact Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManualContactDetails;
