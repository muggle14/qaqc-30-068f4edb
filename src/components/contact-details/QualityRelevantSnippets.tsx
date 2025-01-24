import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export const QualityRelevantSnippets = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Quality Review Evidence:</h4>
      </div>
      <ScrollArea className="h-[150px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-2">
          <div className="text-sm text-gray-600 italic">
            Quality assessors can add conversation excerpts here to support their evaluation.
          </div>
          <div className="text-xs text-gray-500">
            Use this section to document specific parts of the conversation that demonstrate quality concerns or exemplary service.
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};