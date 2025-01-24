interface TranscriptViewProps {
  transcript: string | null;
}

export const TranscriptView = ({ transcript }: TranscriptViewProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
        {transcript || "No transcript available"}
      </pre>
    </div>
  );
};