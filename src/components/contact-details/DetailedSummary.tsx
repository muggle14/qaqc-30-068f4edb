
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detailed Summary Points</CardTitle>
        {onChange && (
          <Button
            onClick={handleAddPoint}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryPoints.map((point, index) => (
          <div key={index} className="flex gap-2">
            {onChange ? (
              <>
                <Input
                  value={point}
                  onChange={(e) => handlePointChange(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                />
                <Button
                  onClick={() => handleRemovePoint(index)}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-gray-600">{point}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
