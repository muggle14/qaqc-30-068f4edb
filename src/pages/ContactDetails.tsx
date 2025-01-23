import { useLocation, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactHeader } from "@/components/contact-details/ContactHeader";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { TranscriptView } from "@/components/contact-details/TranscriptView";
import { NotFoundState } from "@/components/contact-details/NotFoundState";

interface LocationState {
  contactData: {
    contact_id: string;
    evaluator: string;
    transcript: string | null;
  };
}

const ContactDetails = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  console.log("Contact details state:", state);

  if (!state?.contactData) {
    console.log("No contact data in state, showing NotFoundState");
    return <NotFoundState />;
  }

  const { contactData } = state;

  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <div className="grid grid-cols-[1fr,2fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInfo
              contactId={contactData.contact_id}
              evaluator={contactData.evaluator}
            />
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                <TranscriptView transcript={contactData.transcript} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetails;