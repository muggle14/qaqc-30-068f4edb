
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OverallSummaryProps {
  summary: string;
  onChange?: (summary: string) => void;
}

export const OverallSummary = ({ summary, onChange }: OverallSummaryProps) => {
  return (
    <Card className="h-[calc(50vh-8rem)] border-[#e1e1e3] bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#2C2C2C]">Overall Summary</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-auto">
        {onChange ? (
          <Textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            className="h-full resize-none border-[#e1e1e3] bg-white font-normal text-[#2C2C2C]"
            placeholder="Enter overall summary..."
          />
        ) : (
          <p className="text-sm text-[#555555]">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
};
