
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TranscriptCardProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  isLoading?: boolean;
}

export const TranscriptCard = ({ 
  transcript, 
  onTranscriptChange,
  isLoading 
}: TranscriptCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder="Paste or type your transcript here..."
          className="h-[calc(100vh-16rem)] resize-none font-mono text-sm"
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  );
};
