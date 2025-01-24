import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

interface QualityReasoningSectionProps {
  reasoning?: string | null;
  onReasoningChange?: (value: string) => void;
}

export const QualityReasoningSection = ({ 
  reasoning, 
  onReasoningChange 
}: QualityReasoningSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Quality Assessment Reasoning:</h4>
      </div>
      <Input
        value={reasoning || ""}
        onChange={(e) => onReasoningChange?.(e.target.value)}
        placeholder="Enter your assessment reasoning..."
        className="w-full border-gray-200 focus:border-gray-300 focus:ring-gray-200"
      />
    </div>
  );
};