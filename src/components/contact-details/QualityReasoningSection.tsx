import { Input } from "@/components/ui/input";

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
      <h4 className="font-medium text-gray-700">Reasoning:</h4>
      <Input
        value={reasoning || ""}
        onChange={(e) => onReasoningChange?.(e.target.value)}
        placeholder="Enter reasoning..."
        className="w-full border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};