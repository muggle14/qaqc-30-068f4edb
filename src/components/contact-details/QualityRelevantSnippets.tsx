import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export const QualityRelevantSnippets = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Quality Review Evidence:</h4>
      </div>
      <ScrollArea className="h-[187.5px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <p className="italic mb-2">Document conversation evidence:</p>
            <ul className="space-y-2 list-disc pl-4">
              <li>Click to add relevant conversation excerpts</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};