interface TranscriptViewProps {
  transcript: string | null;
}

export const TranscriptView = ({ transcript }: TranscriptViewProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
      {transcript || "No transcript available"}
    </div>
  );
};