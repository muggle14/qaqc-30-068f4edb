
import { CollapsibleSection } from "./CollapsibleSection";
import { TranscriptCard } from "./TranscriptCard";
import { SummarySection } from "./SummarySection";
import { AIGenerationControls } from "./AIGenerationControls";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/lib/api";
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
        short_summary: response.short_summary,
        detailed_bullet_summary: response.detailed_bullet_summary
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
      await refetchSummary();
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
