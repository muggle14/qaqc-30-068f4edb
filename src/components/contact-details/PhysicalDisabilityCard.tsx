import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility } from "lucide-react";

interface PhysicalDisabilityCardProps {
  physicalDisabilityFlag: boolean;
  physicalDisabilityReasoning?: string | null;
}

export const PhysicalDisabilityCard = ({ 
  physicalDisabilityFlag, 
  physicalDisabilityReasoning 
}: PhysicalDisabilityCardProps) => {
  return (
    <Card className="h-auto w-full border-2 border-gray-200 p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-lg">Physical Disability Status</h3>
          </div>
          <Badge 
            variant={physicalDisabilityFlag ? "destructive" : "secondary"} 
            className="text-sm"
          >
            {physicalDisabilityFlag ? "Yes" : "No"}
          </Badge>
        </div>
        {physicalDisabilityReasoning && (
          <p className="text-sm text-gray-600 mt-2">
            {physicalDisabilityReasoning}
          </p>
        )}
      </div>
    </Card>
  );
};