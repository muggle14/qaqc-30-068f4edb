
import { CardTitle } from "@/components/ui/card";

interface SummaryTitleProps {
  title: string;
}

export const SummaryTitle = ({ title }: SummaryTitleProps) => {
  return (
    <CardTitle className="text-lg font-semibold text-[#2C2C2C]">{title}</CardTitle>
  );
};
