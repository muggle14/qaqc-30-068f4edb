
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="awsRefId">AWS Ref ID</Label>
              <Input
                id="awsRefId"
                value={awsRefId}
                onChange={(e) => setAwsRefId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracksmartId">TrackSmart ID</Label>
              <Input
                id="tracksmartId"
                value={tracksmartId}
                onChange={(e) => setTracksmartId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Special Service Team Flag</Label>
            <RadioGroup
              value={specialServiceTeam ? "yes" : "no"}
              onValueChange={(value) => setSpecialServiceTeam(value === "yes")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcript</Label>
            <div className="max-h-[400px] overflow-y-auto border rounded-md">
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px] resize-none"
                placeholder="Paste conversation transcript here..."
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Summary</h3>
            {summaryQuery.isLoading ? (
              <LoadingSpinner />
            ) : summaryQuery.data ? (
              <div className="space-y-4">
                <div>
                  <Label>Overall Summary</Label>
                  <p className="mt-1 text-gray-700">{summaryQuery.data.short_summary}</p>
                </div>
                <div>
                  <Label>Detailed Summary Points</Label>
                  <ul className="mt-1 list-disc pl-4 space-y-1">
                    {summaryQuery.data.detailed_bullet_summary.map((point, index) => (
                      <li key={index} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Assessment</h3>
            {vcAssessmentQuery.isLoading ? (
              <LoadingSpinner />
            ) : vcAssessmentQuery.data ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Complaints Assessment</Label>
                  <p className="font-medium">{vcAssessmentQuery.data.complaint ? "Yes" : "No"}</p>
                  {vcAssessmentQuery.data.complaint && (
                    <>
                      <Label>Reasoning</Label>
                      <p className="text-gray-700">{vcAssessmentQuery.data.complaint_reason}</p>
                      <Label>Evidence</Label>
                      <p className="text-gray-700">{vcAssessmentQuery.data.complaint_snippet}</p>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Vulnerability Assessment</Label>
                  <p className="font-medium">
                    {vcAssessmentQuery.data.financial_vulnerability ? "Yes" : "No"}
                  </p>
                  {vcAssessmentQuery.data.financial_vulnerability && (
                    <>
                      <Label>Reasoning</Label>
                      <p className="text-gray-700">{vcAssessmentQuery.data.vulnerability_reason}</p>
                      <Label>Evidence</Label>
                      <p className="text-gray-700">{vcAssessmentQuery.data.vulnerability_snippet}</p>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>

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
