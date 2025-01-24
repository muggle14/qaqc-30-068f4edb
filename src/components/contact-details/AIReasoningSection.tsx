import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

interface AIReasoningSectionProps {
  reasoning?: string | null;
}

export const AIReasoningSection = ({ reasoning }: AIReasoningSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">AI Analysis Reasoning:</h4>
      </div>
      <ScrollArea className="h-[100px] pr-4 border rounded-md p-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          {reasoning || "AI reasoning will be displayed here."}
        </p>
      </ScrollArea>
    </div>
  );
};