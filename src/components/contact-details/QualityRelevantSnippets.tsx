import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export const QualityRelevantSnippets = () => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-gray-500" />
        <h4 className="text-sm font-medium text-gray-700">Quality Review Evidence:</h4>
      </div>
      <ScrollArea className="h-[100px] pr-4 border rounded-md p-2 bg-gray-50">
        <div className="space-y-1.5">
          <div className="text-xs text-gray-600">
            <p className="italic mb-1.5">Document conversation evidence:</p>
            <ul className="space-y-1.5 list-disc pl-4">
              <li>Click to add relevant conversation excerpts</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};