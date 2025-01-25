import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface Snippet {
  id: string;
  timestamp: string;
  text: string;
}

interface AIRelevantSnippetsProps {
  contactId: string;
  snippetIds: string[];
}

export const AIRelevantSnippets = ({ contactId, snippetIds }: AIRelevantSnippetsProps) => {
  const { data: conversationData, isLoading } = useQuery({
    queryKey: ['conversation-snippets', contactId, snippetIds],
    queryFn: async () => {
      console.log("Fetching conversation data for contact:", contactId);
      console.log("Looking for snippet IDs:", snippetIds);
      
      const { data, error } = await supabase
        .from('contact_conversations')
        .select('snippets_metadata')
        .eq('contact_id', contactId)
        .single();

      if (error) {
        console.error("Error fetching conversation data:", error);
        throw error;
      }

      console.log("Retrieved conversation data:", data);
      return data;
    },
    enabled: !!contactId && snippetIds.length > 0
  });

  // Safely type and filter the snippets
  const relevantSnippets = Array.isArray(conversationData?.snippets_metadata) 
    ? (conversationData.snippets_metadata as unknown as Snippet[]).filter(
        (snippet: Snippet) => snippetIds.includes(snippet.id)
      )
    : [];

  console.log("Filtered relevant snippets:", relevantSnippets);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Analysis Evidence:</h4>
      </div>
      <ScrollArea className="h-[200px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <p className="italic mb-2">Key conversation moments identified by AI:</p>
            {isLoading ? (
              <p>Loading snippets...</p>
            ) : relevantSnippets.length > 0 ? (
              <ul className="space-y-3 list-disc pl-4">
                {relevantSnippets.map((snippet: Snippet) => (
                  <li key={snippet.id} className="text-gray-700">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <span className="text-xs text-gray-400 block mb-1">
                        Snippet ID: {snippet.id}
                      </span>
                      <p className="text-sm">{snippet.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No AI-identified snippets available</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};