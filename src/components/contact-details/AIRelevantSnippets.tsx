import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIRelevantSnippetsProps {
  contactId: string;
  snippetIds: string[];
}

export const AIRelevantSnippets = ({ contactId, snippetIds }: AIRelevantSnippetsProps) => {
  const { data: snippets, isLoading } = useQuery({
    queryKey: ['ai-snippets', contactId, snippetIds],
    queryFn: async () => {
      console.log("Fetching snippets for contact:", contactId);
      console.log("Snippet IDs to fetch:", snippetIds);

      // Fetch the conversation data which contains the snippets
      const { data: conversationData, error } = await supabase
        .from('contact_conversations')
        .select('snippets_metadata')
        .eq('contact_id', contactId)
        .single();

      if (error) {
        console.error("Error fetching conversation data:", error);
        throw error;
      }

      if (!conversationData?.snippets_metadata) {
        console.log("No snippets metadata found");
        return [];
      }

      // Filter the snippets based on the provided snippet IDs
      const allSnippets = conversationData.snippets_metadata as Array<{
        id: string;
        content: string;
      }>;

      console.log("All available snippets:", allSnippets);
      console.log("Filtering for snippet IDs:", snippetIds);

      const relevantSnippets = allSnippets.filter(snippet => 
        snippetIds.includes(snippet.id)
      );

      console.log("Filtered relevant snippets:", relevantSnippets);
      return relevantSnippets;
    },
    enabled: !!contactId
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Analysis Evidence:</h4>
      </div>
      <ScrollArea className="h-[200px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              <p>Loading snippets...</p>
            ) : snippets && snippets.length > 0 ? (
              <ul className="space-y-3 list-disc pl-4">
                {snippets.map((snippet, index) => (
                  <li key={index} className="text-gray-700">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-sm">{snippet.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No evidence available for this assessment</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};