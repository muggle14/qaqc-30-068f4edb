
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OverallSummaryProps {
  summary: string;
  onChange?: (summary: string) => void;
}

export const OverallSummary = ({ summary, onChange }: OverallSummaryProps) => {
  return (
    <Card className="h-[calc(50vh-8rem)]">
      <CardHeader>
        <CardTitle>Overall Summary</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-auto">
        {onChange ? (
          <Textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            className="h-full resize-none"
            placeholder="Enter overall summary..."
          />
        ) : (
          <p className="text-sm text-gray-600">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
};
