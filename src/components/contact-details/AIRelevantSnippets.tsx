
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/integrations/supabase/client";
import { SnippetsContent } from "./snippets/SnippetsContent";

interface AIRelevantSnippetsProps {
  contactId: string;
  snippetIds: string[];
  onSnippetClick?: (snippetId: string) => void;
}

export const AIRelevantSnippets = ({ 
  contactId, 
  snippetIds,
  onSnippetClick 
}: AIRelevantSnippetsProps) => {
  console.log("AIRelevantSnippets rendered with:", { contactId, snippetIds });

  const { data: snippets, isLoading, error } = useQuery({
    queryKey: ['ai-snippets', contactId, snippetIds],
    queryFn: async () => {
      console.log("Fetching snippets for contact:", contactId);
      console.log("Snippet IDs to fetch:", snippetIds);

      if (!snippetIds || snippetIds.length === 0) {
        console.log("No snippet IDs provided");
        return [];
      }

      try {
        const response = await apiClient.invoke('vAndCAssessment', {
          conversation: snippetIds.join('\n'),
          contact_id: contactId
        });

        // Transform the response into the expected format
        const snippetsData = snippetIds.map(id => ({
          id,
          content: id,
          timestamp: null
        }));

        console.log("Snippets data:", snippetsData);
        return snippetsData;
      } catch (error) {
        console.error("Error processing snippets:", error);
        throw error;
      }
    },
    enabled: !!contactId && snippetIds.length > 0
  });

  if (error) {
    console.error("Error in AIRelevantSnippets:", error);
    return (
      <div className="text-red-500">
        Error loading snippets: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Analysis Evidence:</h4>
      </div>
      <ScrollArea className="h-[200px] pr-4 border rounded-md p-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <SnippetsContent 
              isLoading={isLoading}
              snippets={snippets}
              snippetIds={snippetIds}
              onSnippetClick={onSnippetClick}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
