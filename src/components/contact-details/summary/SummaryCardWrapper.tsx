
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

interface SummaryCardWrapperProps {
  children: ReactNode;
  header: ReactNode;
  className?: string;
}

export const SummaryCardWrapper = ({ children, header, className = "" }: SummaryCardWrapperProps) => {
  return (
    <Card className={`border-[#e1e1e3] bg-white shadow-sm h-[calc(50vh-8rem)] ${className}`}>
      <CardHeader className="pb-2">
        {header}
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
};
