import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIRelevantSnippetsProps {
  contactId: string;
  snippetIds: string[];
}

export const AIRelevantSnippets = ({ contactId, snippetIds }: AIRelevantSnippetsProps) => {
  const { data: conversationData } = useQuery({
    queryKey: ['conversation-snippets', contactId],
    queryFn: async () => {
      console.log("Fetching conversation data for contact:", contactId);
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

  const relevantSnippets = conversationData?.snippets_metadata?.filter(
    (snippet: any) => snippetIds.includes(snippet.id)
  ) || [];

  console.log("Relevant snippets:", relevantSnippets);

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
            <ul className="space-y-2 list-disc pl-4">
              {relevantSnippets.length > 0 ? (
                relevantSnippets.map((snippet: any, index: number) => (
                  <li key={snippet.id} className="text-gray-600">
                    <span className="text-xs text-gray-400">ID: {snippet.id}</span>
                    <br />
                    {snippet.text}
                  </li>
                ))
              ) : (
                <li>No AI-identified snippets available</li>
              )}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};