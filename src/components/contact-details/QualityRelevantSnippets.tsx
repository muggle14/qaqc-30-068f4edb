import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const QualityRelevantSnippets = () => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");

  const addSnippet = () => {
    if (currentInput.trim()) {
      console.log("Adding new snippet:", currentInput);
      setSnippets([...snippets, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const removeSnippet = (index: number) => {
    console.log("Removing snippet at index:", index);
    setSnippets(snippets.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSnippet();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">Review Evidence:</h4>
      </div>
      <ScrollArea className="h-[187.5px] pr-4 border rounded-md p-3 bg-gray-50">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add evidence from conversation..."
              className="flex-1"
            />
            <Button 
              onClick={addSnippet}
              size="sm"
              variant="outline"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ul className="space-y-2 list-disc pl-4">
            {snippets.map((snippet, index) => (
              <li key={index} className="flex items-start group">
                <span className="flex-1 break-words whitespace-pre-wrap">{snippet}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeSnippet(index)}
                >
                  <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
                </Button>
              </li>
            ))}
            {snippets.length === 0 && (
              <li className="text-gray-500 italic">
                Add relevant conversation excerpts above
              </li>
            )}
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
};