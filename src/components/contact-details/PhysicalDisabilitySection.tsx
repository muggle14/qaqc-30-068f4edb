
import { Card } from "@/components/ui/card";
import { PhysicalDisabilityCard } from "./PhysicalDisabilityCard";

interface PhysicalDisabilitySectionProps {
  physicalDisabilityFlag: boolean;
  physicalDisabilityReasoning: string | null;
}

export const PhysicalDisabilitySection = ({
  physicalDisabilityFlag,
  physicalDisabilityReasoning,
}: PhysicalDisabilitySectionProps) => {
  return (
    <div className="my-4">
      <PhysicalDisabilityCard
        physicalDisabilityFlag={physicalDisabilityFlag}
        physicalDisabilityReasoning={physicalDisabilityReasoning}
      />
    </div>
  );
};
