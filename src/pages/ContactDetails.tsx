
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/integrations/supabase/client";
import { ContactSection } from "@/components/contact-details/ContactSection";
import { AssessmentSection } from "@/components/contact-details/AssessmentSection";
import { SummarySection } from "@/components/contact-details/SummarySection";
import { LoadingState } from "@/components/contact-details/LoadingState";
import { NotFoundState } from "@/components/contact-details/NotFoundState";
import { TranscriptCard } from "@/components/contact-details/TranscriptCard";
import { AlertCircle } from "lucide-react";

interface LocationState {
  contactData: {
    contact_id: string;
    evaluator: string;
  };
}

const ContactDetails = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [highlightedSnippetId, setHighlightedSnippetId] = useState<string>();
  const [isSpecialServiceTeam, setIsSpecialServiceTeam] = useState<"yes" | "no">("no");

  console.log("ContactDetails: Initial state:", state);

  if (!state?.contactData?.contact_id) {
    console.log("No contact data in state, showing NotFoundState");
    return <NotFoundState />;
  }

  const { data: contactAssessment, isLoading: isLoadingAssessment, error: assessmentError } = useQuery({
    queryKey: ['contact-assessment', state.contactData.contact_id],
    queryFn: async () => {
      console.log("Fetching assessment for contact:", state.contactData.contact_id);
      const response = await apiClient.get(`assessment/${state.contactData.contact_id}`);
      console.log("Assessment data:", response);
      return response || { 
        complaints: [], 
        vulnerabilities: [],
        complaints_rationale: null,
        vulnerability_rationale: null
      };
    },
    enabled: !!state.contactData.contact_id,
    retry: 1
  });

  const { data: aiAssessment, isLoading: isLoadingAIAssessment } = useQuery({
    queryKey: ['ai-assessment', state.contactData.contact_id],
    queryFn: async () => {
      const response = await apiClient.get(`assessment-ai/${state.contactData.contact_id}`);
      if (!response) {
        throw new Error("Failed to fetch AI assessment");
      }
      return response;
    },
    enabled: !!state.contactData.contact_id
  });

  const { data: conversation, isLoading: isLoadingConversation, error: conversationError } = useQuery({
    queryKey: ['conversation', state.contactData.contact_id],
    queryFn: async () => {
      console.log("Fetching conversation for contact:", state.contactData.contact_id);
      const response = await apiClient.get(`conversations/${state.contactData.contact_id}`);
      console.log("Conversation data:", response);
      return response;
    },
    enabled: !!state.contactData.contact_id,
    retry: 1
  });

  if (isLoadingAssessment || isLoadingConversation || isLoadingAIAssessment) {
    console.log("Data is loading, showing LoadingState");
    return <LoadingState />;
  }

  if (assessmentError || conversationError) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Error Loading Data</h2>
          <p className="text-gray-500 text-center max-w-md">
            {assessmentError instanceof Error 
              ? assessmentError.message 
              : conversationError instanceof Error 
                ? conversationError.message 
                : 'An unexpected error occurred while loading the data.'}
          </p>
        </div>
      </div>
    );
  }

  const rawSnippets = conversation?.snippets_metadata || [];
  const snippetsMetadata = Array.isArray(rawSnippets) 
    ? rawSnippets.map(snippet => {
        const jsonSnippet = snippet as JsonSnippet;
        return {
          id: jsonSnippet.id || '',
          content: jsonSnippet.content || '',
          timestamp: jsonSnippet.timestamp
        };
      })
    : [];

  console.log("Processed snippets metadata:", snippetsMetadata);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ContactSection 
        contactId={state.contactData.contact_id} 
        evaluator={state.contactData.evaluator}
        isSpecialServiceTeam={isSpecialServiceTeam}
        onSpecialServiceTeamChange={setIsSpecialServiceTeam}
      />
      
      <div className="grid grid-cols-2 gap-6">
        <SummarySection 
          overallSummary={aiAssessment?.overall_summary || "No overall summary available"}
          detailedSummaryPoints={aiAssessment?.detailed_summary_points || []}
        />
        
        <TranscriptCard 
          transcript={conversation?.transcript || ""} 
          onTranscriptChange={() => {}} 
          isLoading={isLoadingConversation}
        />
      </div>

      <AssessmentSection 
        complaints={contactAssessment?.complaints || []}
        vulnerabilities={contactAssessment?.vulnerabilities || []}
        contactId={state.contactData.contact_id}
        transcript={conversation?.transcript || ""}
        onSnippetClick={setHighlightedSnippetId}
        specialServiceTeam={isSpecialServiceTeam === "yes"}
      />
    </div>
  );
};

interface JsonSnippet {
  id: string | null;
  content: string | null;
  timestamp: string | null;
}

export default ContactDetails;
