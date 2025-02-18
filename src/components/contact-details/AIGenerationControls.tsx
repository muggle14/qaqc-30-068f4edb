
import { Button } from "@/components/ui/button";
import { Brain, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "@/services/apiClient";
import { useToast } from "@/hooks/use-toast";

interface AIGenerationControlsProps {
  transcript: string;
  contactId: string;
  specialServiceTeam: boolean;
  onAssessmentGenerated?: () => void;
  onTranscriptFormatted?: (formattedTranscript: string) => void;
}

export const AIGenerationControls = ({ 
  transcript, 
  contactId,
  specialServiceTeam,
  onAssessmentGenerated,
  onTranscriptFormatted
}: AIGenerationControlsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const { toast } = useToast();

  // Check transcript format whenever transcript changes
  useEffect(() => {
    if (transcript) {
      setIsFormatted(isTranscriptFormatted(transcript));
    } else {
      setIsFormatted(false);
    }
  }, [transcript]);

  const isTranscriptFormatted = (text: string): boolean => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.length > 0 && lines.every(line => 
      line.trim().startsWith("Agent:") || line.trim().startsWith("Customer:")
    );
  };

  const getButtonDisabledReason = (): string | null => {
    if (!transcript.trim()) return "Please enter a transcript";
    if (!contactId) return "Please enter a contact ID";
    if (!isFormatted) return "Please format the transcript first";
    if (isGenerating) return "Assessment generation in progress";
    return null;
  };

  const handleFormatTranscript = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please enter a transcript before formatting.",
        variant: "destructive",
      });
      return;
    }

    if (isTranscriptFormatted(transcript)) {
      toast({
        title: "Already Formatted",
        description: "The transcript is already in the correct format.",
        variant: "info",
      });
      setIsFormatted(true);
      return;
    }

    setIsFormatting(true);
    try {
      const formattedTranscript = await apiClient.formatTranscript(transcript);
      
      if (onTranscriptFormatted) {
        onTranscriptFormatted(formattedTranscript);
        console.log("Transcript formatted successfully");
      }
      
      setIsFormatted(true);
      toast({
        title: "Success",
        description: "Transcript has been formatted successfully. You can now generate the AI assessment.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error formatting transcript:", error);
      setIsFormatted(false);
      toast({
        title: "Formatting Issue",
        description: "Please ensure each line of dialogue is on a new line and try again.",
        variant: "warning",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleGenerateAssessment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!transcript || !contactId) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have entered a transcript and contact ID.",
        variant: "destructive",
      });
      return;
    }

    if (!isFormatted) {
      toast({
        title: "Unformatted Transcript",
        description: "Please format the transcript before generating the assessment.",
        variant: "info",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiClient.invoke("generate-assessment", {
        contact_id: contactId,
        transcript: transcript,
        special_service_team: specialServiceTeam,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate assessment");
      }

      toast({
        title: "Assessment Generated",
        description: "The AI assessment has been generated successfully.",
        variant: "success",
      });

      if (onAssessmentGenerated) {
        onAssessmentGenerated();
      }
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isGenerateDisabled = Boolean(getButtonDisabledReason());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleFormatTranscript}
          disabled={isFormatting || !transcript.trim()}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          variant="outline"
          size="lg"
          type="button"
        >
          <FileText className="h-4 w-4" />
          {isFormatting ? "Formatting..." : "Format & Parse Transcript"}
        </Button>
        <Button
          onClick={handleGenerateAssessment}
          disabled={isGenerateDisabled}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
          type="button"
          title={getButtonDisabledReason() || "Generate AI assessment"}
        >
          <Brain className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate AI Assessment"}
        </Button>
      </div>
      {isGenerateDisabled && (
        <p className="text-sm text-muted-foreground text-right italic">
          {getButtonDisabledReason()}
        </p>
      )}
    </div>
  );
};
