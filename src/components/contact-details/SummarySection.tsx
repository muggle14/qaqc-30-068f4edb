
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
          <p className="text-sm text-muted-foreground">{overallSummary}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Detailed Summary Points</h3>
          <ul className="list-disc pl-4 space-y-2">
            {detailedSummaryPoints.map((point, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
