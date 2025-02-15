
import { LucideIcon, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CardHeaderProps {
  title: string;
  icon: LucideIcon;
  isAIAssessment: boolean;
  flag: boolean;
  onFlagChange?: (value: boolean) => void;
}

const SOP_INFO = {
  "Complaints Assessment": "SOP Guidelines for Complaints Assessment:\n• Review customer interactions for explicit complaints\n• Assess agent responses to customer concerns\n• Document any escalations or follow-up actions",
  "Vulnerability Assessment": "SOP Guidelines for Vulnerability Assessment:\n• Check for signs of financial, emotional, or physical vulnerability\n• Note any disclosed health conditions or disabilities\n• Review agent's handling of vulnerable customer situations",
  "Complaints": "Key Complaints Indicators:\n• Direct expressions of dissatisfaction\n• Requests for escalation\n• Multiple contact attempts for the same issue",
  "Vulnerability": "Vulnerability Detection Guidance:\n• Listen for mentions of health conditions\n• Note any difficulties with communication\n• Identify financial hardship indicators",
};

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
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-xl text-gray-700">{title}</h3>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center rounded-full p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    aria-label={`View ${title} guidelines`}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="max-w-xs p-3 text-sm whitespace-pre-line bg-white"
                >
                  {SOP_INFO[title as keyof typeof SOP_INFO]}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isAIAssessment && (
              <Badge 
                variant={flag ? "destructive" : "secondary"}
                className={`text-base px-3 py-1 ${
                  flag 
                    ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' 
                    : 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
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
