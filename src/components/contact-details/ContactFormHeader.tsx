
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ContactInfo } from "./ContactInfo";

interface ContactFormHeaderProps {
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  onContactIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEvaluatorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpecialServiceTeamChange: (value: "yes" | "no") => void;
}

export const ContactFormHeader = ({
  contactId,
  evaluator,
  isSpecialServiceTeam,
  onContactIdChange,
  onEvaluatorChange,
  onSpecialServiceTeamChange,
}: ContactFormHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactId">AWS Ref ID</Label>
            <Input
              id="contactId"
              value={contactId}
              onChange={onContactIdChange}
              placeholder="Enter AWS Ref ID"
              maxLength={30}
              required
              className="font-mono w-3/4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evaluator">TrackSmart ID</Label>
            <Input
              id="evaluator"
              value={evaluator}
              onChange={onEvaluatorChange}
              placeholder="Enter TrackSmart ID"
              maxLength={30}
              required
              className="w-3/4"
            />
          </div>
        </div>
        <ContactInfo 
          contactId={contactId}
          evaluator={evaluator}
          isSpecialServiceTeam={isSpecialServiceTeam}
          onSpecialServiceTeamChange={onSpecialServiceTeamChange}
        />
      </CardContent>
    </Card>
  );
};
