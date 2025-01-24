import { Card, CardContent } from "@/components/ui/card";
import { QualityAssessorSection } from "./QualityAssessorSection";

export const QualityAssessmentCard = () => {
  return (
    <Card className="w-full">
      <CardContent>
        <QualityAssessorSection />
      </CardContent>
    </Card>
  );
};