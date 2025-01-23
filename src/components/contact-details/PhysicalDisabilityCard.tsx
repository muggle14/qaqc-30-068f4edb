import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility } from "lucide-react";

interface PhysicalDisabilityCardProps {
  hasPhysicalDisability: boolean;
}

export const PhysicalDisabilityCard = ({ hasPhysicalDisability }: PhysicalDisabilityCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 gap-2">
        <Accessibility className="w-6 h-6 text-gray-500" />
        <CardTitle>Physical Disability Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge 
            variant={hasPhysicalDisability ? "destructive" : "secondary"}
            className="text-sm"
          >
            {hasPhysicalDisability ? "Yes" : "No"}
          </Badge>
          <span className="text-sm text-gray-600">
            {hasPhysicalDisability 
              ? "This contact has indicated having a physical disability"
              : "No physical disabilities have been reported"
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
};