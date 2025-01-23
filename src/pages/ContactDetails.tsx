import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactHeader } from "@/components/contact-details/ContactHeader";
import { ContactInfo } from "@/components/contact-details/ContactInfo";
import { TranscriptView } from "@/components/contact-details/TranscriptView";
import { LoadingState } from "@/components/contact-details/LoadingState";
import { NotFoundState } from "@/components/contact-details/NotFoundState";

const ContactDetails = () => {
  const params = useParams<{ contactId: string }>();
  const contactId = params.contactId;

  console.log("Contact ID from params:", contactId);

  if (!contactId || contactId === ":contactId") {
    console.log("Invalid contact ID, showing NotFoundState");
    return <NotFoundState />;
  }

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["contact-details", contactId],
    queryFn: async () => {
      console.log("Starting data fetch for contact ID:", contactId);
      
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

      return {
        contact_id: uploadDetails.contact_id,
        evaluator: uploadDetails.evaluator,
        transcript: conversation?.transcript || null,
      };
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
      <div className="grid grid-cols-[1fr,2fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInfo
              contactId={contactDetails.contact_id}
              evaluator={contactDetails.evaluator}
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
                <TranscriptView transcript={contactDetails.transcript} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetails;