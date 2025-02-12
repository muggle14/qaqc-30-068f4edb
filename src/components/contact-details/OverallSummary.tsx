import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverallSummaryProps {
  summary: string;
}

export const OverallSummary = ({ summary }: OverallSummaryProps) => {
  return (
    <Card className="h-[calc(50vh-8rem)]">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-auto">
        <p className="text-sm text-gray-600">{summary}</p>
      </CardContent>
    </Card>
  );
};