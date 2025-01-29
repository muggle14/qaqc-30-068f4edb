import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContactSection } from "@/components/contact-details/ContactSection";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { LoadingState } from "@/components/contact-details/LoadingState";
import { NotFoundState } from "@/components/contact-details/NotFoundState";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";

interface LocationState {
  contactData: {
    contact_id: string;
    evaluator: string;
  };
}

interface SnippetMetadata {
  id: string;
  content: string;
  timestamp: string | null;
}

const ContactDetails = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();

  console.log("ContactDetails: Initial state:", state);

  const { data: contactAssessment, isLoading: isLoadingAssessment, error: assessmentError } = useQuery({
    queryKey: ['contact-assessment', state?.contactData?.contact_id],
    queryFn: async () => {
      console.log("Fetching assessment for contact:", state?.contactData?.contact_id);
      const { data, error } = await supabase
        .from('contact_assessments')
        .select('*')
        .eq('contact_id', state.contactData.contact_id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching assessment:", error);
        throw error;
      }
      
      console.log("Assessment data:", data);
      return data || { 
        complaints: [], 
        vulnerabilities: [],
        complaints_rationale: null,
        vulnerability_rationale: null
      };
    },
    enabled: !!state?.contactData?.contact_id
  });

  const { data: conversation, isLoading: isLoadingConversation, error: conversationError } = useQuery({
    queryKey: ['conversation', state?.contactData?.contact_id],
    queryFn: async () => {
      console.log("Fetching conversation for contact:", state?.contactData?.contact_id);
      const { data, error } = await supabase
        .from('contact_conversations')
        .select('*')
        .eq('contact_id', state.contactData.contact_id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching conversation:", error);
        throw error;
      }

      console.log("Conversation data:", data);
      return data;
    },
    enabled: !!state?.contactData?.contact_id
  });

  console.log("Render state:", {
    state,
    contactAssessment,
    conversation,
    isLoadingAssessment,
    isLoadingConversation,
    assessmentError,
    conversationError
  });

  if (!state?.contactData) {
    console.log("No contact data in state, showing NotFoundState");
    return <NotFoundState />;
  }

  if (isLoadingAssessment || isLoadingConversation) {
    console.log("Data is loading, showing LoadingState");
    return <LoadingState />;
  }

  if (!conversation) {
    console.log("No conversation found, showing NotFoundState");
    return <NotFoundState />;
  }

  const snippetsMetadata = conversation.snippets_metadata as SnippetMetadata[] || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ContactSection 
        contactId={state.contactData.contact_id} 
        evaluator={state.contactData.evaluator} 
      />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <AssessmentSection 
            complaints={contactAssessment?.complaints || []}
            vulnerabilities={contactAssessment?.vulnerabilities || []}
            contactId={state.contactData.contact_id}
          />
        </div>
        
        <TranscriptCard 
          transcript={conversation.transcript} 
          snippetsMetadata={snippetsMetadata}
          highlightedSnippetId={highlightedSnippetId}
        />
      </div>

      <SummarySection 
        overallSummary="Sample overall summary of the conversation"
        detailedSummaryPoints={[
          "Point 1 about the conversation",
          "Point 2 about the conversation",
          "Point 3 about the conversation"
        ]}
      />
    </div>
  );
};

export default ContactDetails;