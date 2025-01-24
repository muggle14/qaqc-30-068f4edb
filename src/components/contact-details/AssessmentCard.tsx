import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
            <h3 className="font-semibold text-lg">Complaints & Vulnerabilities</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={flag}
                disabled
                className={`${flag 
                  ? 'bg-red-500 hover:bg-red-500' 
                  : 'bg-green-500 hover:bg-green-500'
                } ${bothFlagsTrue ? 'bg-red-600' : ''}`}
              />
              <span className="text-sm text-gray-600">
                {flag ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Reasoning:</h4>
        </div>

        <ScrollArea className="h-[150px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <ul className="list-disc pl-4 space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">{item}</li>
            ))}
          </ul>
        </ScrollArea>

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Relevant Snippets:</h4>
          <ScrollArea className="h-[150px] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="text-sm text-gray-600">
              No relevant snippets found.
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};