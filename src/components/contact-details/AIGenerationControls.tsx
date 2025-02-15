
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AIGenerationControlsProps {
  transcript: string;
  contactId: string;
  specialServiceTeam: boolean;
  onAssessmentGenerated?: () => void;
}

export const AIGenerationControls = ({ 
  transcript, 
  contactId,
  specialServiceTeam,
  onAssessmentGenerated 
}: AIGenerationControlsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateAssessment = async () => {
    if (!transcript || !contactId) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have entered a transcript and contact ID.",
        variant: "destructive",
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
      });

      if (onAssessmentGenerated) {
        onAssessmentGenerated();
      }
    } catch (error) {
      console.error("Error generating assessment:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate assessment",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-end">
          <Button
            onClick={handleGenerateAssessment}
            disabled={isGenerating || !transcript || !contactId}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate AI Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
