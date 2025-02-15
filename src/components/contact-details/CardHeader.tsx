
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

const SOP_URLS = {
  "Complaints Assessment": "https://docs.example.com/sop/complaints-assessment",
  "Vulnerability Assessment": "https://docs.example.com/sop/vulnerability-assessment",
  "Complaints": "https://docs.example.com/sop/complaints",
  "Vulnerability": "https://docs.example.com/sop/vulnerability",
};

export const CardHeader = ({
  title,
  icon: Icon,
  isAIAssessment,
  flag,
  onFlagChange,
}: CardHeaderProps) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = SOP_URLS[title as keyof typeof SOP_URLS];
    // Open in a new tab with security features enabled
    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-gray-500" />
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                    onDoubleClick={handleDoubleClick}
                    aria-label={`View ${title} guidelines (double-click for full documentation)`}
                  >
                    <h3 className="font-semibold text-xl">{title}</h3>
                    <Info 
                      className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="max-w-xs p-3 text-sm whitespace-pre-line bg-white"
                >
                  <div>
                    {SOP_INFO[title as keyof typeof SOP_INFO]}
                    <div className="mt-2 text-xs text-gray-500 italic">
                      Double-click to view full documentation
                    </div>
                  </div>
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
