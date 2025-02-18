
import { AIAssessment } from "./AIAssessment";
import { QualityAssessmentCard } from "./QualityAssessmentCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AIGenerationControls } from "./AIGenerationControls";
import { useQuery } from "@tanstack/react-query";
import { getVAndCAssessment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface AssessmentSectionProps {
  complaints: string[];
  vulnerabilities: string[];
  contactId: string;
  transcript: string;
  specialServiceTeam: boolean;
  onSnippetClick?: (snippetId: string) => void;
  complaintsData?: {
    hasComplaints: boolean;
    reasoning: string;
    snippets: string[];
  };
  vulnerabilityData?: {
    hasVulnerability: boolean;
    reasoning: string;
    snippets: string[];
  };
  isLoading?: boolean;
}

export const AssessmentSection = ({ 
  complaints, 
  vulnerabilities, 
  contactId,
  transcript,
  specialServiceTeam,
  onSnippetClick,
  complaintsData,
  vulnerabilityData,
  isLoading: externalLoading
}: AssessmentSectionProps) => {
  const location = useLocation();
  const isManualRoute = location.pathname === '/contact/manual';
  const [isAIOpen, setIsAIOpen] = useState(true);
  const [assessmentKey, setAssessmentKey] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { toast } = useToast();

  const { 
    data: assessmentData,
    isLoading: isAssessmentLoading,
    refetch: refetchAssessment,
    error: assessmentError
  } = useQuery({
    queryKey: ['vAndCAssessment', transcript],
    queryFn: async () => {
      if (!transcript) {
        throw new Error("Transcript is required");
      }
      console.log("Fetching V&C assessment with transcript:", transcript);
      return await getVAndCAssessment(transcript);
    },
    enabled: false,
    retry: 1,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isAssessmentLoading) {
      setLoadingMessage("Fetching transcript data... Generating summary...");
      setLoadingProgress(25);

      timeoutId = setTimeout(() => {
        if (isAssessmentLoading) {
          setLoadingMessage("Still processing... This may take a few moments.");
          setLoadingProgress(75);
        }
      }, 5000);
    } else {
      setLoadingProgress(0);
      setLoadingMessage("");
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAssessmentLoading]);

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
      console.log('Starting V&C assessment generation...');
      const result = await refetchAssessment();
      
      if (assessmentError) {
        throw assessmentError;
      }

      console.log('V&C Assessment generated:', result.data);
      setAssessmentKey(prev => prev + 1);
    } catch (error) {
      console.error("V&C Assessment generation failed:", error);
      setLoadingMessage("Assessment generation failed. Please try again.");
    }
  };

  const isLoading = isAssessmentLoading || externalLoading;

  const currentComplaintsData = assessmentData ? {
    hasComplaints: assessmentData.complaint,
    reasoning: assessmentData.complaint_reason || "No complaint reasoning provided",
    snippets: assessmentData.complaint_snippet ? [assessmentData.complaint_snippet] : []
  } : complaintsData;

  const currentVulnerabilityData = assessmentData ? {
    hasVulnerability: assessmentData.financial_vulnerability,
    reasoning: assessmentData.vulnerability_reason || "No vulnerability reasoning provided",
    snippets: assessmentData.vulnerability_snippet ? [assessmentData.vulnerability_snippet] : []
  } : vulnerabilityData;

  return (
    <div className="space-y-4">
      <Collapsible open={isAIOpen} onOpenChange={setIsAIOpen}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAIOpen ? "" : "-rotate-90"}`} />
              </Button>
            </CollapsibleTrigger>
            <h2 className="text-xl font-semibold">Assessor Feedback</h2>
          </div>
          <Button 
            onClick={handleGenerateAssessment} 
            disabled={isLoading || !transcript}
            className="flex items-center gap-2"
            type="button"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Fetching V&C Assessment...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate V&C Assessment
              </>
            )}
          </Button>
        </div>

        {isLoading && loadingMessage && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            <Progress value={loadingProgress} className="h-1" />
          </div>
        )}

        <CollapsibleContent className="mt-4">
          <AIAssessment 
            key={assessmentKey}
            complaints={complaints}
            vulnerabilities={vulnerabilities}
            hasPhysicalDisability={false}
            contactId={contactId}
            onSnippetClick={onSnippetClick}
            complaintsData={currentComplaintsData}
            vulnerabilityData={currentVulnerabilityData}
            isLoading={isLoading}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
