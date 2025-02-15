
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptView } from "./TranscriptView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptCardProps {
  transcript: string | null;
  onTranscriptChange?: (value: string) => void;
  snippetsMetadata?: {
    id: string;
    timestamp: string;
    content: string;
  }[] | null;
  highlightedSnippetId?: string;
}

export const TranscriptCard = ({ 
  transcript, 
  onTranscriptChange,
  snippetsMetadata,
  highlightedSnippetId 
}: TranscriptCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTranscriptSaved, setIsTranscriptSaved] = useState(!!sessionStorage.getItem('cachedTranscript'));
  const { toast } = useToast();

  const handleSave = () => {
    if (transcript) {
      sessionStorage.setItem('cachedTranscript', transcript);
      setIsTranscriptSaved(true);
      toast({
        title: "Transcript saved",
        description: "Your transcript has been saved locally and will be retained during your session.",
      });
    }
  };

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTranscriptChange) {
      onTranscriptChange(e.target.value);
    }
  };

  return (
    <Card className="h-full min-h-[calc(100vh-16rem+4px)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Transcript</CardTitle>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
            variant="outline"
            size="sm"
          >
            <Save className="h-4 w-4" />
            Save locally
          </Button>
        </div>
        {isTranscriptSaved && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className={`h-[calc(100%-${isTranscriptSaved ? '8rem' : '5rem'})] pt-0`}>
        {!isTranscriptSaved ? (
          <Textarea
            value={transcript || ""}
            onChange={handleTranscriptChange}
            placeholder="Paste or type your transcript here..."
            className="h-full min-h-[500px] resize-none font-mono text-sm"
          />
        ) : (
          <ScrollArea className="h-full pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <TranscriptView 
              transcript={transcript} 
              searchQuery={searchQuery}
              snippetsMetadata={snippetsMetadata}
              highlightedSnippetId={highlightedSnippetId}
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
