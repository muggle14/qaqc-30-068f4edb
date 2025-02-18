
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Save } from "lucide-react";

export function ManualContactDetails() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [awsRefId, setAwsRefId] = useState("");
  const [tracksmartId, setTracksmartId] = useState("");
  const [specialServiceTeam, setSpecialServiceTeam] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Query for chat summary
  const summaryQuery = useQuery({
    queryKey: ['chat-summary', transcript],
    queryFn: () => api.getChatSummary(transcript),
    enabled: transcript.length > 0,
  });

  // Query for V&C assessment
  const vcAssessmentQuery = useQuery({
    queryKey: ['vc-assessment', transcript],
    queryFn: () => api.getVCAssessment(transcript),
    enabled: transcript.length > 0,
  });

  // Mutation for saving assessment
  const saveMutation = useMutation({
    mutationFn: (data: any) => api.saveAssessmentDetails(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assessment saved successfully",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
      console.error("Save error:", error);
    },
  });

  const handleSave = () => {
    if (!awsRefId || !tracksmartId || !transcript) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!summaryQuery.data || !vcAssessmentQuery.data) {
      toast({
        title: "Error",
        description: "Please wait for AI assessment to complete",
        variant: "destructive",
      });
      return;
    }

    const assessmentData = {
      awsRefId,
      tracksmartId,
      specialServiceTeamFlag: specialServiceTeam,
      transcript,
      overallSummary: summaryQuery.data.short_summary,
      detailedSummary: summaryQuery.data.detailed_bullet_summary,
      complaints: {
        hasComplaints: vcAssessmentQuery.data.complaint,
        reason: vcAssessmentQuery.data.complaint_reason,
        analysisEvidence: vcAssessmentQuery.data.complaint_snippet,
      },
      vulnerability: {
        hasVulnerability: vcAssessmentQuery.data.financial_vulnerability,
        reason: vcAssessmentQuery.data.vulnerability_reason,
        analysisEvidence: vcAssessmentQuery.data.vulnerability_snippet,
      },
    };

    saveMutation.mutate(assessmentData);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <ContactInfo
            contactId=""
            evaluator=""
            isSpecialServiceTeam={specialServiceTeam ? "yes" : "no"}
            onSpecialServiceTeamChange={(value) => setSpecialServiceTeam(value === "yes")}
          />
          
          <div className="grid grid-cols-2 gap-6">
            <TranscriptCard
              transcript={transcript}
              onTranscriptChange={setTranscript}
            />
            <SummarySection
              overallSummary={summaryQuery.data?.short_summary || ""}
              detailedSummaryPoints={summaryQuery.data?.detailed_bullet_summary || []}
            />
          </div>

          <AssessmentSection
            complaints={[]}
            vulnerabilities={[]}
            contactId=""
            transcript={transcript}
            specialServiceTeam={specialServiceTeam}
          />

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Assessment Details"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
