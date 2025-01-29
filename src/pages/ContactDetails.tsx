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

const ContactDetails = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();

  const { data: contactAssessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['contact-assessment', state?.contactData?.contact_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_assessments')
        .select('*')
        .eq('contact_id', state.contactData.contact_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!state?.contactData?.contact_id
  });

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['conversation', state?.contactData?.contact_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_conversations')
        .select('*')
        .eq('contact_id', state.contactData.contact_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!state?.contactData?.contact_id
  });

  if (!state?.contactData) {
    return <NotFoundState />;
  }

  if (isLoadingAssessment || isLoadingConversation) {
    return <LoadingState />;
  }

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
          transcript={conversation?.transcript} 
          snippetsMetadata={conversation?.snippets_metadata as { id: string; timestamp: string; content: string; }[] || []}
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