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
import { ComplaintAssessmentState, VulnerabilityAssessmentState, AssessmentData } from "./types";

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
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    complaints: [],
    vulnerabilities: []
  });
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

  const handleUpdateAssessmentEntry = (
    type: 'complaints' | 'vulnerabilities',
    reasonType: string,
    field: 'assessment_reasoning' | 'review_evidence',
    value: string,
    customReason?: string
  ) => {
    const updates = [...assessmentData[type]];
    const existingIndex = updates.findIndex(entry => 
      entry.type === reasonType && (!customReason || entry.custom_reason === customReason)
    );

    if (existingIndex >= 0) {
      updates[existingIndex] = {
        ...updates[existingIndex],
        [field]: value
      };
    } else {
      updates.push({
        type: reasonType,
        custom_reason: customReason,
        assessment_reasoning: field === 'assessment_reasoning' ? value : '',
        review_evidence: field === 'review_evidence' ? value : ''
      });
    }

    setAssessmentData(prev => ({
      ...prev,
      [type]: updates
    }));
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
            selectedReasons={complaints.selectedReasons}
            otherReason={complaints.otherReason}
            onReasonsChange={(reasons) => onComplaintsChange({ selectedReasons: reasons })}
            onOtherReasonChange={(value) => onComplaintsChange({ otherReason: value })}
            assessmentData={assessmentData}
            customReasons={complaints.customReasons}
            newCustomReason={complaints.newCustomReason}
            onNewCustomReasonChange={(value) => onComplaintsChange({ newCustomReason: value })}
            onAddCustomReason={() => {
              if (complaints.newCustomReason) {
                onComplaintsChange({
                  customReasons: [...complaints.customReasons, complaints.newCustomReason],
                  newCustomReason: ''
                });
              }
            }}
            onRemoveCustomReason={(index) => {
              const newCustomReasons = [...complaints.customReasons];
              newCustomReasons.splice(index, 1);
              onComplaintsChange({ customReasons: newCustomReasons });
            }}
            onUpdateAssessmentEntry={handleUpdateAssessmentEntry}
          />
          
          <VulnerabilityAssessmentForm
            selectedCategories={vulnerabilities.selectedCategories}
            otherCategory={vulnerabilities.otherCategory}
            onCategoriesChange={(categories) => onVulnerabilitiesChange({ selectedCategories: categories })}
            onOtherCategoryChange={(value) => onVulnerabilitiesChange({ otherCategory: value })}
            assessmentData={assessmentData}
            customCategories={vulnerabilities.customCategories}
            newCustomReason={vulnerabilities.newCustomCategory}
            onNewCustomReasonChange={(value) => onVulnerabilitiesChange({ newCustomCategory: value })}
            onAddCustomReason={() => {
              if (vulnerabilities.newCustomCategory) {
                onVulnerabilitiesChange({
                  customCategories: [...vulnerabilities.customCategories, vulnerabilities.newCustomCategory],
                  newCustomCategory: ''
                });
              }
            }}
            onRemoveCustomReason={(index) => {
              const newCustomCategories = [...vulnerabilities.customCategories];
              newCustomCategories.splice(index, 1);
              onVulnerabilitiesChange({ customCategories: newCustomCategories });
            }}
            onUpdateAssessmentEntry={handleUpdateAssessmentEntry}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
