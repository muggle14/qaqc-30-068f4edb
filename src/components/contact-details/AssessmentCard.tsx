import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

interface AssessmentCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  flag: boolean;
  reasoning?: string | null;
  bothFlagsTrue: boolean;
}

export const AssessmentCard = ({
  title,
  icon: Icon,
  items,
  flag,
  reasoning,
  bothFlagsTrue,
}: AssessmentCardProps) => {
  return (
    <Card className="border-2 border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-lg">{title}:</h3>
            <Badge 
              variant={flag ? "destructive" : "secondary"}
              className={`text-lg font-semibold ${bothFlagsTrue ? 'bg-red-500' : ''}`}
            >
              {flag ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Reasoning:</h4>
        </div>

        <ScrollArea className="h-[200px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="list-disc pl-4 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">{item}</li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </Card>
  );
};