import { useLocation } from "react-router-dom";
import { NotFoundState } from "@/components/contact-details/NotFoundState";
import { ContactHeader } from "@/components/contact-details/ContactHeader";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { ContactSection } from "@/components/contact-details/ContactSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";

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

  // Dummy data for complaints and vulnerabilities
  const defaultComplaints = [
    "Billing transparency issues",
    "Unexpected late payment fees",
    "Communication gaps regarding payment due dates",
    "Confusion about service charges"
  ];

  const defaultVulnerabilities = [
    "Customer showed signs of financial stress",
    "Limited understanding of billing cycle",
    "Expressed difficulty managing payment deadlines",
    "Potential need for payment plan options"
  ];

  const overallSummary = "Customer called regarding billing discrepancy on their recent invoice. Expressed frustration about unexpected charges. Agent provided detailed explanation of charges and offered to review the account for potential adjustments.";

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
    <div className="container mx-auto p-6 space-y-6">
      <ContactHeader />
      <div className="space-y-6">
        <div className="grid grid-cols-[1.2fr,1fr] gap-6 min-h-[600px]">
          <div className="space-y-6">
            <ContactSection 
              contactId={contactData.contact_id}
              evaluator={contactData.evaluator}
            />
            <SummarySection 
              overallSummary={overallSummary}
              detailedSummaryPoints={detailedSummaryPoints}
            />
          </div>
          <TranscriptCard transcript={contactData.transcript} />
        </div>

        <AssessmentSection
          complaints={defaultComplaints}
          vulnerabilities={defaultVulnerabilities}
          contactId={contactData.contact_id}
        />
      </div>
    </div>
  );
};

export default ContactDetails;