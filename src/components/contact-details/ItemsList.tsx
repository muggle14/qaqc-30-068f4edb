import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemsListProps {
  items: string[];
  reasoning?: string | null;
}

export const ItemsList = ({ items, reasoning }: ItemsListProps) => {
  console.log("ItemsList rendering with reasoning:", reasoning);
  console.log("ItemsList items:", items);

  return (
    <Card className="border border-canvas-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Assessment Reasoning</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[180px] pr-4">
          <div className="space-y-4">
            {reasoning ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{reasoning}</p>
                {items && items.length > 0 && (
                  <>
                    <h4 className="font-medium text-sm text-gray-900">Key Points:</h4>
                    <ul className="space-y-2 list-disc pl-4">
                      {items.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No assessment reasoning provided</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};