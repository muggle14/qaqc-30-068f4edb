import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface ComplaintsResult {
  complaints_flag: boolean;
  complaints_reasoning: string | null;
  physical_disability_flag: boolean;
  physical_disability_reasoning: string | null;
  relevant_snippet_ids: string[];
}

interface VulnerabilityResult {
  vulnerability_flag: boolean;
  vulnerability_reasoning: string | null;
  relevant_snippet_ids: string[];
}

interface Snippet {
  id: string;
  content: string;
  timestamp: string | null;
}

async function findRelevantSnippets(
  supabase: SupabaseClient,
  contactId: string,
  keywords: string[]
): Promise<string[]> {
  console.log("Finding relevant snippets for contact:", contactId);
  console.log("Using keywords:", keywords);

  const { data: conversationData, error } = await supabase
    .from('contact_conversations')
    .select('snippets_metadata')
    .eq('contact_id', contactId)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return [];
  }

  if (!conversationData?.snippets_metadata) {
    console.log("No snippets found in conversation");
    return [];
  }

  const snippets = conversationData.snippets_metadata as Snippet[];
  console.log("Found snippets:", snippets);

  const relevantSnippetIds = snippets
    .filter(snippet => 
      keywords.some(keyword => 
        snippet.content.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    .map(snippet => snippet.id);

  console.log("Identified relevant snippet IDs:", relevantSnippetIds);
  return relevantSnippetIds;
}

export async function assess_complaints(
  supabase: SupabaseClient,
  contactId: string,
  transcript: string
): Promise<ComplaintsResult> {
  console.log("Starting complaints assessment for transcript");
  
  const complaintKeywords = ['complaint', 'issue', 'problem', 'unhappy', 'dissatisfied'];
  const disabilityKeywords = ['disability', 'wheelchair', 'mobility', 'assistance'];
  
  const hasComplaints = complaintKeywords.some(keyword => 
    transcript.toLowerCase().includes(keyword)
  );
  
  const hasDisability = disabilityKeywords.some(keyword => 
    transcript.toLowerCase().includes(keyword)
  );

  const relevantSnippetIds = await findRelevantSnippets(
    supabase,
    contactId,
    [...complaintKeywords, ...disabilityKeywords]
  );

  return {
    complaints_flag: hasComplaints,
    complaints_reasoning: hasComplaints ? 
      "The conversation contains mentions of complaints or issues." : 
      "No significant complaints detected in the conversation.",
    physical_disability_flag: hasDisability,
    physical_disability_reasoning: hasDisability ? 
      "The conversation indicates presence of physical disability." : 
      "No clear indicators of physical disability found.",
    relevant_snippet_ids: relevantSnippetIds
  };
}

export async function assess_vulnerability(
  supabase: SupabaseClient,
  contactId: string,
  transcript: string
): Promise<VulnerabilityResult> {
  console.log("Starting vulnerability assessment for transcript");
  
  const vulnerabilityKeywords = [
    'vulnerable',
    'help',
    'assistance',
    'support',
    'difficulty',
    'struggle'
  ];
  
  const hasVulnerability = vulnerabilityKeywords.some(keyword => 
    transcript.toLowerCase().includes(keyword)
  );

  const relevantSnippetIds = await findRelevantSnippets(
    supabase,
    contactId,
    vulnerabilityKeywords
  );

  return {
    vulnerability_flag: hasVulnerability,
    vulnerability_reasoning: hasVulnerability ? 
      "The conversation indicates potential vulnerability." : 
      "No clear vulnerability indicators detected.",
    relevant_snippet_ids: relevantSnippetIds
  };
}

export async function store_assessment_results(
  supabase: SupabaseClient,
  contact_id: string,
  complaints_result: ComplaintsResult,
  vulnerability_result: VulnerabilityResult
) {
  console.log("Storing assessment results for contact:", contact_id);

  try {
    // Store complaints assessment
    const { data: complaintsData, error: complaintsError } = await supabase
      .from('ai_assess_complaints')
      .upsert({
        contact_id,
        complaints_flag: complaints_result.complaints_flag,
        complaints_reasoning: complaints_result.complaints_reasoning,
        physical_disability_flag: complaints_result.physical_disability_flag,
        physical_disability_reasoning: complaints_result.physical_disability_reasoning,
        relevant_snippet_ids: complaints_result.relevant_snippet_ids
      })
      .select()
      .single();

    if (complaintsError) throw complaintsError;

    // Store vulnerability assessment
    const { data: vulnerabilityData, error: vulnerabilityError } = await supabase
      .from('ai_assess_vulnerability')
      .upsert({
        contact_id,
        vulnerability_flag: vulnerability_result.vulnerability_flag,
        vulnerability_reasoning: vulnerability_result.vulnerability_reasoning,
        relevant_snippet_ids: vulnerability_result.relevant_snippet_ids
      })
      .select()
      .single();

    if (vulnerabilityError) throw vulnerabilityError;

    return {
      complaints: complaintsData,
      vulnerability: vulnerabilityData
    };
  } catch (error) {
    console.error("Error storing assessment results:", error);
    throw new Error("Failed to store assessment results");
  }
}