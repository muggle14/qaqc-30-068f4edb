import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemsListProps {
  items: string[];
  reasoning?: string | null;
}

export const ItemsList = ({ items, reasoning }: ItemsListProps) => {
  return (
    <Card className="border border-canvas-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Reasoning</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[180px] pr-4">
          {reasoning ? (
            <p className="text-sm text-gray-600 mb-4">{reasoning}</p>
          ) : null}
          <ul className="space-y-2 list-disc pl-4">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};