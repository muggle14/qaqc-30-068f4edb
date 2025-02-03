import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptView } from "./TranscriptView";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TranscriptCardProps {
  transcript: string | null;
  snippetsMetadata?: {
    id: string;
    timestamp: string;
    content: string;
  }[] | null;
  highlightedSnippetId?: string;
}

export const TranscriptCard = ({ transcript, snippetsMetadata, highlightedSnippetId }: TranscriptCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="h-[600px]"> {/* Changed from h-full to fixed height */}
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
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
      </CardHeader>
      <CardContent className="h-[calc(100%-8rem)] pt-0">
        <ScrollArea className="h-full pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <TranscriptView 
            transcript={transcript} 
            searchQuery={searchQuery}
            snippetsMetadata={snippetsMetadata}
            highlightedSnippetId={highlightedSnippetId}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};