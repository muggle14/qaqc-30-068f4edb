import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactHeader } from "@/components/contact-details/ContactHeader";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { TranscriptView } from "@/components/contact-details/TranscriptView";
import { LoadingState } from "@/components/contact-details/LoadingState";
import { NotFoundState } from "@/components/contact-details/NotFoundState";

const ContactDetails = () => {
  const params = useParams<{ contactId: string }>();
  const contactId = params.contactId;

  console.log("Contact ID from params:", contactId); // Debug log

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["contact-details", contactId],
    queryFn: async () => {
      if (!contactId) {
        console.error("No contact ID provided");
        throw new Error("Contact ID is required");
      }

      console.log("Fetching contact details for:", contactId);
      
      const { data: conversations, error: conversationsError } = await supabase
        .from("contact_conversations")
        .select("*")
        .eq("contact_id", contactId)
        .maybeSingle();

      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
        throw conversationsError;
      }

      const { data: uploadDetails, error: uploadError } = await supabase
        .from("upload_details")
        .select("*")
        .eq("contact_id", contactId)
        .maybeSingle();

      if (uploadError) {
        console.error("Error fetching upload details:", uploadError);
        throw uploadError;
      }

      if (!uploadDetails) {
        console.log("No upload details found for contact:", contactId);
        return null;
      }

      return {
        ...conversations,
        evaluator: uploadDetails.evaluator,
        upload_timestamp: uploadDetails.upload_timestamp,
      };
    },
    enabled: !!contactId,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!contactDetails) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto p-6">
      <ContactHeader />
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ContactInfo
            contactId={contactDetails.contact_id}
            evaluator={contactDetails.evaluator}
            uploadTimestamp={contactDetails.upload_timestamp}
            updatedAt={contactDetails.updated_at}
          />
          <TranscriptView transcript={contactDetails.transcript} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetails;