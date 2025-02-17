
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus } from "lucide-react";

interface DetailedSummaryPointProps {
  point: string;
  index: number;
  onChange?: (index: number, value: string) => void;
  onRemove?: (index: number) => void;
}

export const DetailedSummaryPoint = ({ point, index, onChange, onRemove }: DetailedSummaryPointProps) => {
  if (!onChange) {
    return <p className="text-sm text-[#555555]">{point}</p>;
  }

  return (
    <div className="flex gap-2">
      <Input
        value={point}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Point ${index + 1}`}
        className="border-[#e1e1e3] bg-white text-[#2C2C2C]"
      />
      <Button
        onClick={() => onRemove?.(index)}
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0 border-[#e1e1e3]"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};
