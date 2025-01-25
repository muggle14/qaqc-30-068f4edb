import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AIRelevantSnippetsProps {
  contactId: string;
  snippetIds: string[];
}

export const AIRelevantSnippets = ({ contactId, snippetIds }: AIRelevantSnippetsProps) => {
  const { data: snippetsData, isLoading } = useQuery({
    queryKey: ['ai-snippets', contactId, snippetIds],
    queryFn: async () => {
      console.log("Fetching AI assessment snippets for contact:", contactId);
      console.log("Snippet IDs to fetch:", snippetIds);

      if (!snippetIds.length) {
        return [];
      }

      const { data: complaintsData } = await supabase
        .from('ai_assess_complaints')
        .select('relevant_snippet_ids')
        .eq('contact_id', contactId)
        .single();

      const { data: vulnerabilityData } = await supabase
        .from('ai_assess_vulnerability')
        .select('relevant_snippet_ids')
        .eq('contact_id', contactId)
        .single();

      const allSnippets = [
        ...(complaintsData?.relevant_snippet_ids || []),
        ...(vulnerabilityData?.relevant_snippet_ids || [])
      ];

      console.log("Retrieved snippets:", allSnippets);
      return allSnippets;
    },
    enabled: !!contactId && snippetIds.length > 0
  });

  if (!snippetIds.length) {
    return null;
  }

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
            ) : snippetsData && snippetsData.length > 0 ? (
              <ul className="space-y-3 list-disc pl-4">
                {snippetsData.map((snippet: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="text-sm">{snippet}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No snippets found for this assessment</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};