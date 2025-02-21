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

export interface ComplaintsFormState {
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

export interface VulnerabilitiesFormState {
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
  newCustomReason: string;
}

export interface AssessmentFormData {
  complaints: ComplaintsFormState;
  vulnerabilities: VulnerabilitiesFormState;
  transcript: string;
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
}

export const initialComplaintsState: ComplaintsFormState = {
  hasComplaints: false,
  selectedReasons: [],
  otherReason: "",
  assessments: {},
  customReasons: [],
  newCustomReason: ""
};

export const initialVulnerabilitiesState: VulnerabilitiesFormState = {
  hasVulnerability: false,
  selectedCategories: [],
  otherCategory: "",
  assessments: {},
  customCategories: [],
  newCustomReason: ""
};

export const initialFormState: AssessmentFormData = {
  transcript: "",
  contactId: "",
  evaluator: "",
  isSpecialServiceTeam: "no",
  complaints: initialComplaintsState,
  vulnerabilities: initialVulnerabilitiesState
};

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
