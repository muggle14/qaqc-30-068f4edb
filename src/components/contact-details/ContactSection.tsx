
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "./ContactInfo";

interface ContactSectionProps {
  contactId: string;
  evaluator: string;
  isSpecialServiceTeam: "yes" | "no";
  onSpecialServiceTeamChange: (value: "yes" | "no") => void;
}

export const ContactSection = ({ 
  contactId, 
  evaluator,
  isSpecialServiceTeam,
  onSpecialServiceTeamChange
}: ContactSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent>
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
