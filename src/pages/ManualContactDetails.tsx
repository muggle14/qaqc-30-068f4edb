
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LoadingState } from "@/components/contact-details/LoadingState";
import { NotFoundState } from "@/components/contact-details/NotFoundState";
import { apiClient } from "@/integrations/supabase/client";
import { ContactDetails } from "@/components/contact-details/ContactDetails";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ManualContactDetails() {
  const [searchParams] = useSearchParams();
  const contactId = searchParams.get("id") || "";
  const [isSaving, setIsSaving] = useState(false);

  const { 
    data: contact, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: async () => {
      if (!contactId) throw new Error("Contact ID is required");
      const response = await apiClient.get(`/contacts/${contactId}`);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch contact");
      }
      return response.data;
    },
    enabled: !!contactId,
  });

  const mutation = useMutation({
    mutationFn: async ({ contactId, transcript }: { contactId: string, transcript: string }) => {
      const result = await apiClient.invoke("contact-assessment", {
        contactId,
        transcript
      });
      if (!result.success) {
        throw new Error("The server at http://localhost:7071/api/vAndCAssessment is returning an error. Please check your v & c assessment function, verify the endpoint, and ensure it's deployed and running.");
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assessment saved successfully",
      });
      refetch();
    },
    onError: (error: Error) => {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSaving(false);
    }
  });

  const onTranscriptChange = (transcript: string) => {
    if (contact) {
      // Update local state immediately
      contact.transcript = transcript;
    }
  };

  const onSave = async () => {
    if (!contact?.transcript) {
      toast({
        title: "Error",
        description: "Please enter a transcript",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    mutation.mutate({
      contactId: contact.id,
      transcript: contact.transcript
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    console.error("Error loading contact:", error);
    return (
      <div className="container mx-auto p-6 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading contact</h3>
          <p className="text-red-600 mt-1">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (!contact) {
    return <NotFoundState />;
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
