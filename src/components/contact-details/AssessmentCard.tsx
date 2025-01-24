import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LucideIcon } from "lucide-react";
import { AIReasoningSection } from "./AIReasoningSection";
import { QualityReasoningSection } from "./QualityReasoningSection";

interface AssessmentCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  flag: boolean;
  reasoning?: string | null;
  bothFlagsTrue: boolean;
  isAIAssessment?: boolean;
  onFlagChange?: (value: boolean) => void;
  onReasoningChange?: (value: string) => void;
}

export const AssessmentCard = ({
  title,
  icon: Icon,
  items,
  flag,
  reasoning,
  bothFlagsTrue,
  isAIAssessment = false,
  onFlagChange,
  onReasoningChange,
}: AssessmentCardProps) => {
  return (
    <Card className="border-2 border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-lg">{title}</h3>
            {isAIAssessment && (
              <div className="flex items-center space-x-4">
                <RadioGroup 
                  value={flag ? "yes" : "no"} 
                  className="flex items-center space-x-4"
                  onValueChange={(value) => onFlagChange?.(value === "yes")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="no" 
                      id="no"
                      className={!flag ? 'border-green-500 text-green-500' : 'border-gray-300'}
                    />
                    <label 
                      htmlFor="no" 
                      className={`text-sm ${!flag ? 'text-green-500 font-medium' : 'text-gray-500'}`}
                    >
                      No
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="yes" 
                      id="yes"
                      className={flag ? 'border-red-500 text-red-500' : 'border-gray-300'}
                    />
                    <label 
                      htmlFor="yes" 
                      className={`text-sm ${flag ? 'text-red-500 font-medium' : 'text-gray-500'}`}
                    >
                      Yes
                    </label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4 bg-gray-300 h-[2px]" />

        {!isAIAssessment && (
          <QualityReasoningSection 
            reasoning={reasoning}
            onReasoningChange={onReasoningChange}
          />
        )}

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