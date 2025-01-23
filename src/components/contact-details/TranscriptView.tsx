interface TranscriptViewProps {
  transcript: string | null;
}

export const TranscriptView = ({ transcript }: TranscriptViewProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
        {transcript || "No transcript available"}
      </pre>
    </div>
  );
};