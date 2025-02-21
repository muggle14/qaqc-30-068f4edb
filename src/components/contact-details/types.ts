
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

export interface FormState {
  transcript: string;
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  assessmentKey: number;
  complaints: string[];
  vulnerabilities: string[];
}

export const initialFormState: FormState = {
  transcript: "",
  contactId: "",
  evaluator: "",
  isSpecialServiceTeam: "no",
  assessmentKey: 0,
  complaints: [],
  vulnerabilities: []
};
