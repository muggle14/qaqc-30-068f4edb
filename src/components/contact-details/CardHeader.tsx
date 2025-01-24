import { LucideIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {onFlagChange && (
          <RadioGroup 
            value={flag ? "yes" : "no"} 
            className="flex items-center space-x-4"
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