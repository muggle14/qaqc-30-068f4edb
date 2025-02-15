
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContactInfoProps {
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  onSpecialServiceTeamChange: (value: "yes" | "no") => void;
}

export const ContactInfo = ({
  contactId,
  evaluator,
  isSpecialServiceTeam,
  onSpecialServiceTeamChange,
}: ContactInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium text-canvas-muted">AWS Ref ID</h3>
          <p className="text-base font-medium text-canvas-text">{contactId}</p>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium text-canvas-muted">TrackSmart ID</h3>
          <p className="text-base font-medium text-canvas-text">{evaluator}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Special Service Team Flag</Label>
        <RadioGroup
          value={isSpecialServiceTeam}
          onValueChange={(value: "yes" | "no") => onSpecialServiceTeamChange(value)}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="special-service-yes" />
            <Label htmlFor="special-service-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="special-service-no" />
            <Label htmlFor="special-service-no">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
