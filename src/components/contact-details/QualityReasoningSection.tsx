
import { CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface QualityReasoningSectionProps {
  reasoning?: string | null;
  onReasoningChange?: (value: string) => void;
}

export const QualityReasoningSection = ({ 
  reasoning, 
  onReasoningChange 
}: QualityReasoningSectionProps) => {
  console.log("QualityReasoningSection rendering with reasoning:", reasoning);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Assessment Reasoning:</h4>
      </div>
      <Textarea
        value={reasoning || ""}
        onChange={(e) => {
          console.log("Input changed:", e.target.value);
          onReasoningChange?.(e.target.value);
        }}
        placeholder="Enter your assessment reasoning..."
        className="min-h-[240px] w-full resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-200 whitespace-pre-wrap break-words"
      />
    </div>
  );
};
