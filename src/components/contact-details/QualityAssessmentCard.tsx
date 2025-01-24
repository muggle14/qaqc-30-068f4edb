import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QualityAssessorSection } from "./QualityAssessorSection";

export const QualityAssessmentCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quality Assessor Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <QualityAssessorSection />
      </CardContent>
    </Card>
  );
};