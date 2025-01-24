import { OverallSummary } from "./OverallSummary";
import { DetailedSummary } from "./DetailedSummary";

interface SummarySectionProps {
  overallSummary: string;
  detailedSummaryPoints: string[];
}

export const SummarySection = ({ 
  overallSummary, 
  detailedSummaryPoints 
}: SummarySectionProps) => {
  return (
    <div className="space-y-6">
      <OverallSummary summary={overallSummary} />
      <DetailedSummary summaryPoints={detailedSummaryPoints} />
    </div>
  );
};