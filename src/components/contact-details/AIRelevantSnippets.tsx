import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

export const AIRelevantSnippets = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">AI Analysis Snippets:</h4>
      </div>
      <ScrollArea className="h-[150px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-2">
          <div className="text-sm text-gray-600 italic">
            AI assessment will analyze the conversation and highlight relevant snippets here.
          </div>
          <div className="text-xs text-gray-500">
            This section will be populated with AI-identified key moments from the conversation that influenced the assessment.
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};