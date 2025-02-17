
import { DetailedSummary } from "./DetailedSummary";
import { OverallSummary } from "./OverallSummary";

interface SummarySectionProps {
  overallSummary: string;
  detailedSummaryPoints: string[];
  onOverallSummaryChange?: (summary: string) => void;
  onDetailedSummaryPointsChange?: (points: string[]) => void;
}

export const SummarySection = ({ 
  overallSummary, 
  detailedSummaryPoints,
  onOverallSummaryChange,
  onDetailedSummaryPointsChange
}: SummarySectionProps) => {
  return (
    <div className="space-y-4 h-full">
      <OverallSummary 
        summary={overallSummary} 
        onChange={onOverallSummaryChange}
      />
      <DetailedSummary 
        summaryPoints={detailedSummaryPoints}
        onChange={onDetailedSummaryPointsChange}
      />
    </div>
  );
};
