
import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}

export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  action
}: CollapsibleSectionProps) => {
  return (
    <Collapsible defaultOpen={defaultOpen} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </CollapsibleTrigger>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {action}
      </div>
      <CollapsibleContent className={cn("space-y-4")}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
