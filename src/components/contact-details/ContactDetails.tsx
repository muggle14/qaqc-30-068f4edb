
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Contact {
  id: string;
  transcript: string;
}

interface ContactDetailsProps {
  contact: Contact;
  onTranscriptChange: (transcript: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const ContactDetails = ({ 
  contact, 
  onTranscriptChange, 
  onSave, 
  isSaving 
}: ContactDetailsProps) => {
  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={contact.transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Enter transcript..."
            className="min-h-[200px]"
          />
          <Button 
            onClick={onSave} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Assessment"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
