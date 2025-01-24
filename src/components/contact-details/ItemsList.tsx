import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemsListProps {
  items: string[];
}

export const ItemsList = ({ items }: ItemsListProps) => {
  return (
    <ScrollArea className="h-[150px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <ul className="list-disc pl-4 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-600">{item}</li>
        ))}
      </ul>
    </ScrollArea>
  );
};