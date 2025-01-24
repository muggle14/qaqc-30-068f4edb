import { LucideIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface CardHeaderProps {
  title: string;
  icon: LucideIcon;
  isAIAssessment: boolean;
  flag: boolean;
  onFlagChange?: (value: boolean) => void;
}

export const CardHeader = ({
  title,
  icon: Icon,
  isAIAssessment,
  flag,
  onFlagChange,
}: CardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-gray-500" />
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            {isAIAssessment && (
              <Badge 
                variant={flag ? "destructive" : "secondary"}
                className={`text-base px-3 py-1 ${
                  flag 
                    ? 'bg-red-100 text-red-700 border-red-200' 
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                {flag ? "Yes" : "No"}
              </Badge>
            )}
          </div>
        </div>
        {onFlagChange && (
          <RadioGroup 
            value={flag ? "yes" : "no"} 
            className="flex items-center space-x-4 ml-8"
            onValueChange={(value) => onFlagChange(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="no" 
                id={`${title.toLowerCase()}-no`}
                className={!flag ? 'border-green-500 text-green-500' : 'border-gray-300'}
              />
              <label 
                htmlFor={`${title.toLowerCase()}-no`}
                className={`text-sm ${!flag ? 'text-green-500 font-medium' : 'text-gray-500'}`}
              >
                No
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="yes" 
                id={`${title.toLowerCase()}-yes`}
                className={flag ? 'border-red-500 text-red-500' : 'border-gray-300'}
              />
              <label 
                htmlFor={`${title.toLowerCase()}-yes`}
                className={`text-sm ${flag ? 'text-red-500 font-medium' : 'text-gray-500'}`}
              >
                Yes
              </label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
};