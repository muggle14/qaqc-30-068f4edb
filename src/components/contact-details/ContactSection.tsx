import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactInfo } from "./ContactInfo";

interface ContactSectionProps {
  contactId: string;
  evaluator: string;
}

export const ContactSection = ({ contactId, evaluator }: ContactSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactInfo contactId={contactId} evaluator={evaluator} />
      </CardContent>
    </Card>
  );
};