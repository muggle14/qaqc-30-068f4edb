
import { SummaryCardWrapper } from "./summary/SummaryCardWrapper";
import { SummaryTitle } from "./summary/SummaryTitle";
import { Textarea } from "@/components/ui/textarea";

interface OverallSummaryProps {
  summary: string;
  onChange?: (summary: string) => void;
}

export const OverallSummary = ({ summary, onChange }: OverallSummaryProps) => {
  return (
    <SummaryCardWrapper
      header={<SummaryTitle title="Overall Summary" />}
    >
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
    </SummaryCardWrapper>
  );
};
