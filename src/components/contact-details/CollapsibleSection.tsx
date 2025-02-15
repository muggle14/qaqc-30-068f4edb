
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CollapsibleSection = ({ title, children }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 mb-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
          </Button>
        </CollapsibleTrigger>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <CollapsibleContent className="transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
