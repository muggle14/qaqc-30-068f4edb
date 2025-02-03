import { Button } from "@/components/ui/button";

interface Snippet {
  id: string;
  content: string;
  timestamp: string | null;
}

interface SnippetsListProps {
  snippets: Snippet[];
  onSnippetClick?: (snippetId: string) => void;
}

export const SnippetsList = ({ snippets, onSnippetClick }: SnippetsListProps) => {
  return (
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
              <p className="text-sm px-2 pb-2 whitespace-pre-wrap break-words">{snippet.content}</p>
            </div>
          </Button>
        </li>
      ))}
    </ul>
  );
};