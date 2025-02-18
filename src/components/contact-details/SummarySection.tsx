
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }

    const summaryPoints = Array.isArray(detailedSummaryPoints) 
      ? detailedSummaryPoints 
      : [];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Overall Summary</h3>
          <p className="text-sm text-muted-foreground">
            {overallSummary || "No summary available"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Detailed Summary Points</h3>
          {summaryPoints.length > 0 ? (
            <ul className="list-disc pl-4 space-y-2">
              {summaryPoints.map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {point}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No bullet points available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
