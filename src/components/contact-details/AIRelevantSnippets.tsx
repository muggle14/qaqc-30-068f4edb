import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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

      const { data: conversationData, error } = await supabase
        .from('contact_conversations')
        .select('snippets_metadata')
        .eq('contact_id', contactId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching conversation data:", error);
        throw error;
      }

      console.log("Raw conversation data:", conversationData);

      if (!conversationData?.snippets_metadata) {
        console.log("No snippets metadata found");
        return [];
      }

      // Ensure snippets_metadata is treated as an array of the correct type
      const allSnippets = (conversationData.snippets_metadata as Array<{
        id: string;
        content: string;
        timestamp: string | null;
      }>) || [];

      console.log("All available snippets:", allSnippets);
      console.log("Looking for snippet IDs:", snippetIds);

      const relevantSnippets = allSnippets.filter(snippet => 
        snippetIds.includes(snippet.id)
      );

      console.log("Filtered relevant snippets:", relevantSnippets);
      return relevantSnippets;
    },
    enabled: !!contactId && snippetIds.length > 0
  });

  if (error) {
    console.error("Error in AIRelevantSnippets:", error);
    return (
      <div className="text-red-500">
        Error loading snippets: {error.message}
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
            {isLoading ? (
              <p>Loading snippets...</p>
            ) : snippets && snippets.length > 0 ? (
              <ul className="space-y-3 list-disc pl-4">
                {snippets.map((snippet, index) => (
                  <li key={index} className="text-gray-700">
                    <Button
                      variant="ghost"
                      className="h-auto p-2 hover:bg-gray-100 w-full text-left"
                      onClick={() => onSnippetClick?.(snippet.id)}
                    >
                      <div className="bg-white rounded border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1 px-2 pt-2">
                          [{snippet.timestamp || 'No timestamp'}]
                        </div>
                        <p className="text-sm px-2 pb-2">{snippet.content}</p>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">
                {snippetIds.length === 0 
                  ? "No evidence IDs provided for this assessment"
                  : "No matching evidence found in the conversation"}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};