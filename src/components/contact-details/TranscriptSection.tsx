import { CollapsibleSection } from "./CollapsibleSection";
import { TranscriptCard } from "./TranscriptCard";
import { SummarySection } from "./SummarySection";
import { AIGenerationControls } from "./AIGenerationControls";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getSummary, getVAndCAssessment } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface TranscriptSectionProps {
  transcript: string;
  contactId: string;
  isSpecialServiceTeam: boolean;
  onTranscriptChange: (transcript: string) => void;
}

export const TranscriptSection = ({
  transcript,
  contactId,
  isSpecialServiceTeam,
  onTranscriptChange,
}: TranscriptSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: summaryData, isLoading: isSummaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['chat-summary', transcript],
    queryFn: async () => {
      const response = await getSummary(transcript);
      return {
        short_summary: response.short_summary || "",
        detailed_bullet_summary: Array.isArray(response.detailed_bullet_summary) 
          ? response.detailed_bullet_summary 
          : []
      };
    },
    enabled: false,
  });

  const { isLoading: isVCLoading, refetch: refetchVC } = useQuery({
    queryKey: ['vc-assessment', transcript],
    queryFn: async () => {
      const response = await getVAndCAssessment(transcript);
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

  return (
    <CollapsibleSection 
      title="Summary & Transcript"
      action={
        <div className="flex gap-2">
          <AIGenerationControls
            transcript={transcript}
            contactId={contactId}
            specialServiceTeam={isSpecialServiceTeam}
            onAssessmentGenerated={handleGenerateAssessment}
            onTranscriptFormatted={onTranscriptChange}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        {renderSummaryContent()}
        <TranscriptCard
          transcript={transcript}
          onTranscriptChange={onTranscriptChange}
          isLoading={isSummaryLoading || isVCLoading}
        />
      </div>
    </CollapsibleSection>
  );
};
