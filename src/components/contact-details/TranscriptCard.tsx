import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptView } from "./TranscriptView";

interface TranscriptCardProps {
  transcript: string | null;
}

export const TranscriptCard = ({ transcript }: TranscriptCardProps) => {
  return (
    <Card className="h-[calc(100vh-24rem)]">
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)]">
        <ScrollArea className="h-full pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <TranscriptView transcript={transcript} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};