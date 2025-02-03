import { SnippetsList } from "./SnippetsList";

interface SnippetsContentProps {
  isLoading: boolean;
  snippets: Array<{
    id: string;
    content: string;
    timestamp: string | null;
  }> | undefined;
  snippetIds: string[];
  onSnippetClick?: (snippetId: string) => void;
}

export const SnippetsContent = ({ 
  isLoading, 
  snippets, 
  snippetIds,
  onSnippetClick 
}: SnippetsContentProps) => {
  if (isLoading) {
    return <p>Loading snippets...</p>;
  }

  if (!snippets || snippets.length === 0) {
    return (
      <p className="text-gray-500 italic">
        {snippetIds.length === 0 
          ? "No evidence IDs provided for this assessment"
          : "No matching evidence found in the conversation"}
      </p>
    );
  }

  return <SnippetsList snippets={snippets} onSnippetClick={onSnippetClick} />;
};