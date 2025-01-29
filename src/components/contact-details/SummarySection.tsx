import { DetailedSummary } from "./DetailedSummary";
import { OverallSummary } from "./OverallSummary";

interface SummarySectionProps {
  overallSummary: string;
  detailedSummaryPoints: string[];
}

export const SummarySection = ({ 
  overallSummary, 
  detailedSummaryPoints 
}: SummarySectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <OverallSummary summary={overallSummary} />
      <DetailedSummary summaryPoints={detailedSummaryPoints} />
    </div>
  );
};