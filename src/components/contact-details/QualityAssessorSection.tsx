import { AssessmentCard } from "./AssessmentCard";
import { AlertCircle, Shield } from "lucide-react";

export const QualityAssessorSection = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AssessmentCard
        title="Strengths"
        icon={AlertCircle}
        items={[
          "Clear communication throughout the call",
          "Proper identification verification",
          "Effective problem resolution",
          "Professional tone maintained"
        ]}
        flag={false}
        reasoning={"Agent demonstrated strong customer service skills"}
        bothFlagsTrue={false}
        isAIAssessment={false}
      />

      <AssessmentCard
        title="Areas for Improvement"
        icon={Shield}
        items={[
          "Could have offered additional services",
          "Missed opportunity for feedback collection",
          "Longer than average handling time",
          "Follow-up documentation incomplete"
        ]}
        flag={false}
        reasoning={"Some opportunities for process optimization identified"}
        bothFlagsTrue={false}
        isAIAssessment={false}
      />
    </div>
  );
};