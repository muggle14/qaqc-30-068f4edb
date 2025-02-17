
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SummaryCardWrapper } from "./summary/SummaryCardWrapper";
import { SummaryTitle } from "./summary/SummaryTitle";
import { DetailedSummaryPoint } from "./summary/DetailedSummaryPoint";

interface DetailedSummaryProps {
  summaryPoints: string[];
  onChange?: (points: string[]) => void;
}

export const DetailedSummary = ({ summaryPoints, onChange }: DetailedSummaryProps) => {
  const handleAddPoint = () => {
    if (onChange) {
      onChange([...summaryPoints, ""]);
    }
  };

  const handleRemovePoint = (index: number) => {
    if (onChange) {
      onChange(summaryPoints.filter((_, i) => i !== index));
    }
  };

  const handlePointChange = (index: number, value: string) => {
    if (onChange) {
      const newPoints = [...summaryPoints];
      newPoints[index] = value;
      onChange(newPoints);
    }
  };

  const header = (
    <div className="flex flex-row items-center justify-between">
      <SummaryTitle title="Detailed Summary Points" />
      {onChange && (
        <Button
          onClick={handleAddPoint}
          variant="outline"
          size="icon"
          className="h-8 w-8 border-[#e1e1e3]"
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <SummaryCardWrapper header={header}>
      <div className="space-y-3">
        {summaryPoints.map((point, index) => (
          <DetailedSummaryPoint
            key={index}
            point={point}
            index={index}
            onChange={onChange ? handlePointChange : undefined}
            onRemove={onChange ? handleRemovePoint : undefined}
          />
        ))}
      </div>
    </SummaryCardWrapper>
  );
};
