
import { AIAssessment } from "./AIAssessment";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVAndCAssessment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ComplaintAssessmentForm } from "./ComplaintAssessmentForm";
import { VulnerabilityAssessmentForm } from "./VulnerabilityAssessmentForm";
import { ComplaintAssessmentState, VulnerabilityAssessmentState } from "./types";

interface AssessmentSectionProps {
  complaints: ComplaintAssessmentState;
  vulnerabilities: VulnerabilityAssessmentState;
  contactId: string;
  transcript: string;
  specialServiceTeam: boolean;
  onComplaintsChange: (updates: Partial<ComplaintAssessmentState>) => void;
  onVulnerabilitiesChange: (updates: Partial<VulnerabilityAssessmentState>) => void;
}

export const AssessmentSection = ({ 
  complaints, 
  vulnerabilities, 
  contactId,
  transcript,
  specialServiceTeam,
  onComplaintsChange,
  onVulnerabilitiesChange,
}: AssessmentSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { toast } = useToast();

  const { 
    isLoading: isAssessmentLoading,
    refetch: refetchAssessment,
    error: assessmentError
  } = useQuery({
    queryKey: ['vAndCAssessment', transcript],
    queryFn: async () => {
      if (!transcript) {
        throw new Error("Transcript is required");
      }
      return await getVAndCAssessment(transcript);
    },
    enabled: false,
    retry: 1,
  });

  const handleGenerateAssessment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!transcript) {
      toast({
        title: "Missing Transcript",
        description: "Please provide a conversation transcript first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingMessage("Generating assessment...");
      setLoadingProgress(25);

      const result = await refetchAssessment();
      
      if (assessmentError) {
        throw assessmentError;
      }

      if (result.data) {
        // Update complaints and vulnerabilities based on AI assessment
        onComplaintsChange({
          hasComplaints: result.data.complaint,
          selectedReasons: result.data.complaint ? ['Explicit complaints'] : [],
          assessments: {
            'Explicit complaints': {
              reasoning: result.data.complaint_reason || '',
              evidence: result.data.complaint_snippet || ''
            }
          }
        });

        onVulnerabilitiesChange({
          hasVulnerability: result.data.financial_vulnerability,
          selectedCategories: result.data.financial_vulnerability ? ['Financial'] : [],
          assessments: {
            'Financial': {
              reasoning: result.data.vulnerability_reason || '',
              evidence: result.data.vulnerability_snippet || ''
            }
          }
        });
      }

      toast({
        title: "Success",
        description: "Assessment generated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Assessment generation failed:", error);
      setLoadingMessage("");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate assessment",
        variant: "destructive",
      });
    } finally {
      setLoadingProgress(0);
      setLoadingMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
              </Button>
            </CollapsibleTrigger>
            <h2 className="text-xl font-semibold">Assessment</h2>
          </div>
          <Button 
            onClick={handleGenerateAssessment} 
            disabled={isAssessmentLoading || !transcript}
            className="flex items-center gap-2"
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${isAssessmentLoading ? 'animate-spin' : ''}`} />
            {isAssessmentLoading ? 'Generating...' : 'Generate Assessment'}
          </Button>
        </div>

        {isAssessmentLoading && loadingMessage && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            <Progress value={loadingProgress} className="h-1" />
          </div>
        )}

        <CollapsibleContent className="mt-4 space-y-6">
          <ComplaintAssessmentForm
            complaints={complaints}
            onChange={onComplaintsChange}
          />
          
          <VulnerabilityAssessmentForm
            vulnerabilities={vulnerabilities}
            onChange={onVulnerabilitiesChange}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
