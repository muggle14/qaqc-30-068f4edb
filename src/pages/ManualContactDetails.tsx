
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";

import { apiClient } from "@/integrations/supabase/client";
import { ContactDetails } from "@/components/contact-details/ContactDetails";
import { toast } from "@/components/ui/use-toast";

export function ManualContactDetails() {
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get("id") || "";
  const [isSaving, setIsSaving] = useState(false);

  const { data: contact, mutate } = useSWR(
    contactId ? `/contacts/${contactId}` : null,
    async (url: string) => {
      const response = await apiClient.get(url);
      return response.data;
    }
  );

  const onTranscriptChange = (transcript: string) => {
    mutate({ ...contact, transcript }, false);
  };

  const onSave = async () => {
    if (!contact.transcript) {
      toast({
        title: "Error",
        description: "Please enter a transcript",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await apiClient.invoke("contact-assessment", {
        contactId: contact.id,
        transcript: contact.transcript
      });

      if (!result.success) {
        toast({
          title: "Error",
          description: "The server at http://localhost:7071/api/vAndCAssessment is returning an error. Please check your v & c assessment function, verify the endpoint, and ensure it's deployed and running.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Assessment saved successfully",
      });

      // Refresh the data
      void mutate();
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!contact) {
    return <div>Loading...</div>;
  }

  return (
    <ContactDetails
      contact={contact}
      onTranscriptChange={onTranscriptChange}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
}
