import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

interface ItemsListProps {
  items: string[];
}

export const ItemsList = ({ items }: ItemsListProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <h4 className="font-medium text-gray-700">AI Analysis Reasoning:</h4>
      </div>
      <ScrollArea className="h-[150px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ul className="list-disc pl-4 space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-sm text-gray-600">{item}</li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};