import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverallSummaryProps {
  summary: string;
}

export const OverallSummary = ({ summary }: OverallSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{summary}</p>
      </CardContent>
    </Card>
  );
};