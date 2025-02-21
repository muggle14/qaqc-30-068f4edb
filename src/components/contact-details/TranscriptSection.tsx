
import { CollapsibleSection } from "./CollapsibleSection";
import { TranscriptCard } from "./TranscriptCard";
import { SummarySection } from "./SummarySection";
import { AIGenerationControls } from "./AIGenerationControls";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
  const [hasShownSuccessMessage, setHasShownSuccessMessage] = useState(false);
  const { toast } = useToast();

  const { data: summaryData, isLoading: isSummaryLoading, refetch: refetchSummary, error: summaryError } = useQuery({
    queryKey: ['chat-summary', transcript],
    queryFn: async () => {
      const response = await getSummary(transcript);
      return {
        short_summary: response.short_summary,
        detailed_bullet_summary: response.detailed_bullet_summary
      };
    },
    enabled: false,
    retry: 1,
  });

  // Effect to show success message only after summary data is available and rendered
  useEffect(() => {
    const hasValidSummaryData = Boolean(
      summaryData?.short_summary &&
      !isSummaryLoading &&
      !isGenerating
    );

    if (hasValidSummaryData && !hasShownSuccessMessage) {
      toast({
        title: "Assessment Generated",
        description: "The AI assessment has been successfully generated!",
        variant: "success",
      });
      setHasShownSuccessMessage(true);
    }
  }, [summaryData, isSummaryLoading, isGenerating, hasShownSuccessMessage, toast]);

  // Reset the success message flag when transcript changes
  useEffect(() => {
    setHasShownSuccessMessage(false);
  }, [transcript]);

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
    setHasShownSuccessMessage(false);
    
    try {
      console.log('Starting assessment generation with transcript:', transcript);
      await refetchSummary();
      
      if (summaryError) {
        throw summaryError;
      }
      
      console.log('Assessment generation completed:', { summaryData });
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

  return (
    <CollapsibleSection 
      title="Summary & Transcript"
      action={
        <AIGenerationControls
          transcript={transcript}
          contactId={contactId}
          specialServiceTeam={isSpecialServiceTeam}
          onAssessmentGenerated={handleGenerateAssessment}
          onTranscriptFormatted={onTranscriptChange}
        />
      }
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        <SummarySection
          overallSummary={summaryData?.short_summary || ""}
          detailedSummaryPoints={summaryData?.detailed_bullet_summary || []}
          isLoading={isSummaryLoading || isGenerating}
        />
        <TranscriptCard
          transcript={transcript}
          onTranscriptChange={onTranscriptChange}
          isLoading={isSummaryLoading || isGenerating}
        />
      </div>
    </CollapsibleSection>
  );
};
