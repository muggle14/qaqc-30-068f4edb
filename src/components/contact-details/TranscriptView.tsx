interface TranscriptViewProps {
  transcript: string | null;
  searchQuery: string;
  snippetsMetadata?: {
    id: string;
    timestamp: string;
    content: string;
  }[] | null;
  highlightedSnippetId?: string;
}

export const TranscriptView = ({ 
  transcript, 
  searchQuery, 
  snippetsMetadata,
  highlightedSnippetId 
}: TranscriptViewProps) => {
  if (!transcript) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
          No transcript available
        </pre>
      </div>
    );
  }

  if (!snippetsMetadata) {
    console.log("No snippets metadata provided, falling back to transcript parsing");
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

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-canvas-border">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-canvas-text font-sans">
        {snippetsMetadata.map((snippet) => {
          const isHighlighted = snippet.id === highlightedSnippetId;
          const className = `mb-2 p-2 rounded transition-colors ${
            isHighlighted ? 'bg-yellow-100' : ''
          }`;

          if (!searchQuery) {
            return (
              <div key={snippet.id} className={className} data-snippet-id={snippet.id}>
                <span className="text-gray-500 mr-2">[{snippet.timestamp}]</span>
                <span>{snippet.content}</span>
              </div>
            );
          }

          const parts = snippet.content.split(new RegExp(`(${searchQuery})`, 'gi'));
          
          return (
            <div key={snippet.id} className={className} data-snippet-id={snippet.id}>
              <span className="text-gray-500 mr-2">[{snippet.timestamp}]</span>
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
        })}
      </pre>
    </div>
  );
};