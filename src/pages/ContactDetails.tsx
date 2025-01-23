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

  // Dummy summary for demonstration
  const overallSummary = "Customer called regarding billing discrepancy on their recent invoice. Expressed frustration about unexpected charges. Agent provided detailed explanation of charges and offered to review the account for potential adjustments.";

  // Dummy detailed summary points
  const detailedSummaryPoints = [
    "Customer initially reported unexpected charges on their latest invoice",
    "Identified three specific charges that were questioned: monthly service fee ($29.99), equipment rental ($15), and late payment fee ($10)",
    "Agent explained the monthly service fee is part of the standard package",
    "Equipment rental charge was verified as correct based on the customer's current plan",
    "Late payment fee was due to payment received 5 days after the due date",
    "Customer expressed they were unaware of the payment due date",
    "Agent offered to set up automatic payments to prevent future late fees",
    "Customer declined automatic payments but requested email reminders",
    "Agent set up payment reminder notifications for 5 days before due date",
    "Late fee was waived as a one-time courtesy",
    "Customer expressed satisfaction with the resolution",
    "Follow-up email confirmation was sent with all discussed details"
  ];

  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <div className="grid grid-cols-[1.2fr,1fr] gap-6">
        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Overall Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{overallSummary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                <ul className="list-disc pl-4 space-y-2">
                  {detailedSummaryPoints.map((point, index) => (
                    <li key={index} className="text-sm text-gray-600">{point}</li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

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