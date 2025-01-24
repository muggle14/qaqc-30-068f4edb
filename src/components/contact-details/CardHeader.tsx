import { LucideIcon } from "lucide-react";

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
}: CardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
    </div>
  );
};