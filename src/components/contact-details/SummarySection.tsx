
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummarySectionProps {
  overallSummary: string;
  detailedSummaryPoints: string[];
  isLoading?: boolean;
}

export const SummarySection = ({ 
  overallSummary, 
  detailedSummaryPoints,
  isLoading 
}: SummarySectionProps) => {
  console.log('SummarySection rendered with:', {
    overallSummary,
    detailedSummaryPoints,
    isLoading
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Generating summary...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Overall Summary</h3>
          <p className="text-sm text-muted-foreground">
            {overallSummary || "No summary available"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Detailed Summary Points</h3>
          {detailedSummaryPoints && detailedSummaryPoints.length > 0 ? (
            <ul className="list-disc pl-4 space-y-2">
              {detailedSummaryPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No bullet points available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
