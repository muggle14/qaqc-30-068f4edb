interface TranscriptViewProps {
  transcript: string | null;
  searchQuery: string;
}

export const TranscriptView = ({ transcript, searchQuery }: TranscriptViewProps) => {
  if (!transcript) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
          No transcript available
        </pre>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
          {transcript}
        </pre>
      </div>
    );
  }

  // Split text by search query and highlight matches
  const parts = transcript.split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
        {parts.map((part, i) => (
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </pre>
    </div>
  );
};