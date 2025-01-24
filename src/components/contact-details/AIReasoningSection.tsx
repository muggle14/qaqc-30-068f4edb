import { ScrollArea } from "@/components/ui/scroll-area";

interface AIReasoningSectionProps {
  reasoning?: string | null;
}

export const AIReasoningSection = ({ reasoning }: AIReasoningSectionProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Reasoning:</h4>
      <div className="rounded-md bg-gray-50 p-3">
        {reasoning || "No reasoning provided."}
      </div>
    </div>
  );
};