interface TranscriptViewProps {
  transcript: string | null;
}

export const TranscriptView = ({ transcript }: TranscriptViewProps) => {
  return (
    <div>
      <h3 className="font-semibold text-sm text-gray-500 mb-2">
        Transcript
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
        {transcript || "No transcript available"}
      </div>
    </div>
  );
};