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

  console.log("Contact ID from params:", contactId);

  // If contactId is invalid, return early
  if (!contactId || contactId === ":contactId") {
    console.log("Invalid contact ID, showing NotFoundState");
    return <NotFoundState />;
  }

  // Only create the query if we have a valid contactId
  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["contact-details", contactId],
    queryFn: async () => {
      console.log("Starting data fetch for contact ID:", contactId);
      
      // First fetch upload details
      const { data: uploadDetails, error: uploadError } = await supabase
        .from("upload_details")
        .select()
        .eq("contact_id", contactId)
        .maybeSingle();

      console.log("Upload details response:", { data: uploadDetails, error: uploadError });

      if (uploadError) {
        console.error("Error fetching upload details:", uploadError);
        throw uploadError;
      }

      if (!uploadDetails) {
        console.log("No upload details found for contact:", contactId);
        return null;
      }

      // Then fetch conversation details
      const { data: conversation, error: conversationError } = await supabase
        .from("contact_conversations")
        .select()
        .eq("contact_id", contactId)
        .maybeSingle();

      console.log("Conversation response:", { data: conversation, error: conversationError });

      if (conversationError) {
        console.error("Error fetching conversation:", conversationError);
        throw conversationError;
      }

      const result = {
        contact_id: uploadDetails.contact_id,
        evaluator: uploadDetails.evaluator,
        upload_timestamp: uploadDetails.upload_timestamp,
        updated_at: conversation?.updated_at || null,
        transcript: conversation?.transcript || null,
      };

      console.log("Returning formatted result:", result);
      return result;
    },
  });

  console.log("Query result:", { isLoading, contactDetails });

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