import { useLocation } from "react-router-dom";
import { NotFoundState } from "@/components/contact-details/NotFoundState";
import { ContactHeader } from "@/components/contact-details/ContactHeader";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { ContactSection } from "@/components/contact-details/ContactSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['contact-assessment-data', contactData.contact_id],
    queryFn: async () => {
      console.log("Fetching assessment data for contact:", contactData.contact_id);
      
      const [complaintsResponse, vulnerabilityResponse] = await Promise.all([
        supabase
          .from('ai_assess_complaints')
          .select('complaints_list, overall_summary, detailed_summary_points')
          .eq('contact_id', contactData.contact_id)
          .single(),
        supabase
          .from('ai_assess_vulnerability')
          .select('vulnerabilities_list')
          .eq('contact_id', contactData.contact_id)
          .single()
      ]);

      if (complaintsResponse.error) {
        console.error("Error fetching complaints:", complaintsResponse.error);
        throw complaintsResponse.error;
      }

      if (vulnerabilityResponse.error) {
        console.error("Error fetching vulnerabilities:", vulnerabilityResponse.error);
        throw vulnerabilityResponse.error;
      }

      console.log("Assessment data fetched:", {
        complaints: complaintsResponse.data,
        vulnerabilities: vulnerabilityResponse.data
      });

      return {
        complaints: complaintsResponse.data.complaints_list || [],
        overallSummary: complaintsResponse.data.overall_summary || "",
        detailedSummaryPoints: complaintsResponse.data.detailed_summary_points || [],
        vulnerabilities: vulnerabilityResponse.data.vulnerabilities_list || []
      };
    }
  });

  if (isLoading) {
    return <div>Loading assessment data...</div>;
  }

  return (
    <div className="min-h-screen bg-canvas-bg">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <ContactHeader />
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-6">
            <div className="space-y-4">
              <ContactSection 
                contactId={contactData.contact_id}
                evaluator={contactData.evaluator}
              />
              <SummarySection 
                overallSummary={assessmentData?.overallSummary || ""}
                detailedSummaryPoints={assessmentData?.detailedSummaryPoints || []}
              />
            </div>
            <TranscriptCard transcript={contactData.transcript} />
          </div>

          <AssessmentSection
            complaints={assessmentData?.complaints || []}
            vulnerabilities={assessmentData?.vulnerabilities || []}
            contactId={contactData.contact_id}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;