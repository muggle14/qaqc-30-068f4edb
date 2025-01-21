import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

const ContactDetails = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();

  const { data: contactDetails, isLoading } = useQuery({
    queryKey: ["contact-details", contactId],
    queryFn: async () => {
      console.log("Fetching contact details for:", contactId);
      
      // Use maybeSingle() instead of single() to handle no results case
      const { data: conversations, error: conversationsError } = await supabase
        .from("contact_conversations")
        .select("*")
        .eq("contact_id", contactId)
        .maybeSingle();

      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
        throw conversationsError;
      }

      // If no conversation found, try to at least get upload details
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
        throw new Error("Contact not found");
      }

      return {
        ...conversations,
        evaluator: uploadDetails.evaluator,
        upload_timestamp: uploadDetails.upload_timestamp,
      };
    },
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!contactDetails) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Contact not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Contact ID</h3>
              <p>{contactDetails.contact_id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Evaluator</h3>
              <p>{contactDetails.evaluator}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Upload Date</h3>
              <p>
                {contactDetails.upload_timestamp
                  ? format(new Date(contactDetails.upload_timestamp), "PPpp")
                  : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Last Updated</h3>
              <p>
                {contactDetails.updated_at
                  ? format(new Date(contactDetails.updated_at), "PPpp")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-2">
              Transcript
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {contactDetails.transcript || "No transcript available"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetails;