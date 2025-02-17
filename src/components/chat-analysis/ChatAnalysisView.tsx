
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { VulnerabilityCategories } from "@/components/contact-details/VulnerabilityCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Assessment {
  transcript: string;
  overallSummary: string;
  detailedSummaryPoints: string[];
  vulnerabilityCategories: string[];
  otherVulnerability: string;
}

export const ChatAnalysisView = () => {
  const [assessment, setAssessment] = useState<Assessment>({
    transcript: "",
    overallSummary: "",
    detailedSummaryPoints: [],
    vulnerabilityCategories: [],
    otherVulnerability: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSummary = async () => {
    if (!assessment.transcript) {
      toast({
        title: "Error",
        description: "Please enter a transcript first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("https://chat-summary.azurewebsites.net/api/chat-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: assessment.transcript }),
      });

      if (!response.ok) throw new Error("Failed to fetch summary");

      const data = await response.json();
      setAssessment(prev => ({
        ...prev,
        overallSummary: data.overallSummary,
        detailedSummaryPoints: data.detailedPoints,
      }));

      toast({
        title: "Success",
        description: "Summary generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive",
      });
    }
  };

  const fetchVulnerabilityAssessment = async () => {
    if (!assessment.transcript) {
      toast({
        title: "Error",
        description: "Please enter a transcript first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("https://chat-summary.azurewebsites.net/api/vAndCAssessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: assessment.transcript }),
      });

      if (!response.ok) throw new Error("Failed to fetch vulnerability assessment");

      const data = await response.json();
      setAssessment(prev => ({
        ...prev,
        vulnerabilityCategories: data.vulnerabilities || [],
      }));

      toast({
        title: "Success",
        description: "Vulnerability assessment completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assess vulnerabilities",
        variant: "destructive",
      });
    }
  };

  const saveAssessment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://chat-summary.azurewebsites.net/api/save-assessment-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment),
      });

      if (!response.ok) throw new Error("Failed to save assessment");

      toast({
        title: "Success",
        description: "Assessment saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <TranscriptCard
            transcript={assessment.transcript}
            onTranscriptChange={(value) => 
              setAssessment(prev => ({ ...prev, transcript: value }))
            }
          />
          <div className="flex gap-2">
            <Button onClick={fetchSummary}>Generate Summary</Button>
            <Button onClick={fetchVulnerabilityAssessment}>Assess Vulnerabilities</Button>
          </div>
        </div>

        <div className="space-y-4">
          <SummarySection
            overallSummary={assessment.overallSummary}
            detailedSummaryPoints={assessment.detailedSummaryPoints}
            onOverallSummaryChange={(summary) => 
              setAssessment(prev => ({ ...prev, overallSummary: summary }))
            }
            onDetailedSummaryPointsChange={(points) => 
              setAssessment(prev => ({ ...prev, detailedSummaryPoints: points }))
            }
          />
          
          <Card className="border-[#e1e1e3] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#2C2C2C]">
                Vulnerability Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VulnerabilityCategories
                selectedCategories={assessment.vulnerabilityCategories}
                otherCategory={assessment.otherVulnerability}
                onCategoriesChange={(categories) => 
                  setAssessment(prev => ({ ...prev, vulnerabilityCategories: categories }))
                }
                onOtherCategoryChange={(value) => 
                  setAssessment(prev => ({ ...prev, otherVulnerability: value }))
                }
              />
            </CardContent>
          </Card>

          <Button 
            onClick={saveAssessment} 
            className="w-full"
            disabled={isLoading || !assessment.transcript}
          >
            Save Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};
