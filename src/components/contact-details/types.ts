
import { LucideIcon } from "lucide-react";

export interface AssessmentEntry {
  type: string;
  custom_reason?: string;
  assessment_reasoning: string;
  review_evidence: string;
}

export interface AssessmentData {
  complaints: AssessmentEntry[];
  vulnerabilities: AssessmentEntry[];
}

export interface AssessmentCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  flag: boolean;
  reasoning?: string | null;
  bothFlagsTrue: boolean;
  isAIAssessment?: boolean;
  onFlagChange?: (value: boolean) => void;
  onReasoningChange?: (value: string) => void;
  contactId?: string;
  snippetIds?: string[];
  onSnippetClick?: (snippetId: string) => void;
  isVulnerability?: boolean;
  selectedCategories?: string[];
  otherCategory?: string;
  onCategoriesChange?: (categories: string[]) => void;
  onOtherCategoryChange?: (value: string) => void;
  selectedReasons?: string[];
  otherReason?: string;
  onReasonsChange?: (reasons: string[]) => void;
  onOtherReasonChange?: (value: string) => void;
  reviewEvidence?: string;
  onReviewEvidenceChange?: (value: string) => void;
}

export interface ComplaintAssessmentState {
  hasComplaints: boolean;
  selectedReasons: string[];
  otherReason: string;
  assessments: {
    [key: string]: {
      reasoning: string;
      evidence: string;
    };
  };
  customReasons: string[];
  newCustomReason: string;
}

export interface VulnerabilityAssessmentState {
  hasVulnerability: boolean;
  selectedCategories: string[];
  otherCategory: string;
  assessments: {
    [key: string]: {
      reasoning: string;
      evidence: string;
    };
  };
  customCategories: string[];
  newCustomCategory: string;
}

export interface AssessmentFormState {
  transcript: string;
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  complaints: ComplaintAssessmentState;
  vulnerabilities: VulnerabilityAssessmentState;
}

export interface ComplaintAssessmentFormProps {
  selectedReasons: string[];
  otherReason: string;
  onReasonsChange: (categories: string[]) => void;
  onOtherReasonChange: (value: string) => void;
  state: ComplaintAssessmentState;
  onStateChange: (updates: Partial<ComplaintAssessmentState>) => void;
}

export interface VulnerabilityAssessmentFormProps {
  selectedCategories: string[];
  otherCategory: string;
  onCategoriesChange: (categories: string[]) => void;
  onOtherCategoryChange: (value: string) => void;
  state: VulnerabilityAssessmentState;
  onStateChange: (updates: Partial<VulnerabilityAssessmentState>) => void;
}

export const initialComplaintState: ComplaintAssessmentState = {
  hasComplaints: false,
  selectedReasons: [],
  otherReason: "",
  assessments: {},
  customReasons: [],
  newCustomReason: ""
};

export const initialVulnerabilityState: VulnerabilityAssessmentState = {
  hasVulnerability: false,
  selectedCategories: [],
  otherCategory: "",
  assessments: {},
  customCategories: [],
  newCustomCategory: ""
};

export const initialAssessmentFormState: AssessmentFormState = {
  transcript: "",
  contactId: "",
  evaluator: "",
  isSpecialServiceTeam: "no",
  complaints: initialComplaintState,
  vulnerabilities: initialVulnerabilityState
};
