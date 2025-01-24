interface AIReasoningSectionProps {
  reasoning: string | null;
}

export const AIReasoningSection = ({ reasoning }: AIReasoningSectionProps) => {
  if (!reasoning) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Reasoning:</h4>
      <p className="text-sm text-gray-600">{reasoning}</p>
    </div>
  );
};