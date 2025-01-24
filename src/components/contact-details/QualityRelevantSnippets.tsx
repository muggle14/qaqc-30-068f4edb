import { ScrollArea } from "@/components/ui/scroll-area";

export const QualityRelevantSnippets = () => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Relevant Snippets:</h4>
      <ScrollArea className="h-[150px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="text-sm text-gray-600">
          No quality assessment relevant snippets found.
        </div>
      </ScrollArea>
    </div>
  );
};