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
          {transcript.split('\n').map((line, index) => {
            const timestampMatch = line.match(/^\[([\d:]+)\]/);
            if (timestampMatch) {
              const [fullTimestamp, time] = timestampMatch;
              const content = line.slice(fullTimestamp.length);
              return (
                <div key={index} className="mb-2">
                  <span className="text-gray-500 mr-2">[{time}]</span>
                  <span>{content}</span>
                </div>
              );
            }
            return <div key={index} className="mb-2">{line}</div>;
          })}
        </pre>
      </div>
    );
  }

  // Split text by search query and highlight matches while preserving timestamps
  const lines = transcript.split('\n');
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
        {lines.map((line, lineIndex) => {
          const timestampMatch = line.match(/^\[([\d:]+)\]/);
          if (timestampMatch) {
            const [fullTimestamp, time] = timestampMatch;
            const content = line.slice(fullTimestamp.length);
            const parts = content.split(new RegExp(`(${searchQuery})`, 'gi'));
            
            return (
              <div key={lineIndex} className="mb-2">
                <span className="text-gray-500 mr-2">[{time}]</span>
                {parts.map((part, i) => (
                  part.toLowerCase() === searchQuery.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 px-0.5 rounded">
                      {part}
                    </mark>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                ))}
              </div>
            );
          }
          return <div key={lineIndex} className="mb-2">{line}</div>;
        })}
      </pre>
    </div>
  );
};