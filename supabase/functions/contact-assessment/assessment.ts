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

export async function assess_complaints(transcript: string): Promise<ComplaintsResult> {
  console.log("Starting complaints assessment for transcript");
  
  // For now, implementing a simple assessment logic
  // This should be replaced with more sophisticated analysis
  const hasComplaints = transcript.toLowerCase().includes('complaint') || 
                       transcript.toLowerCase().includes('issue') ||
                       transcript.toLowerCase().includes('problem');
                       
  const hasDisability = transcript.toLowerCase().includes('disability') || 
                       transcript.toLowerCase().includes('wheelchair') ||
                       transcript.toLowerCase().includes('mobility');

  return {
    complaints_flag: hasComplaints,
    complaints_reasoning: hasComplaints ? 
      "The conversation contains mentions of complaints or issues." : 
      "No significant complaints detected in the conversation.",
    physical_disability_flag: hasDisability,
    physical_disability_reasoning: hasDisability ? 
      "The conversation indicates presence of physical disability." : 
      "No clear indicators of physical disability found.",
    relevant_snippet_ids: [] // In a real implementation, we would identify relevant snippets
  };
}

export async function assess_vulnerability(transcript: string): Promise<VulnerabilityResult> {
  console.log("Starting vulnerability assessment for transcript");
  
  // Simple vulnerability assessment logic
  const hasVulnerability = transcript.toLowerCase().includes('vulnerable') || 
                          transcript.toLowerCase().includes('help') ||
                          transcript.toLowerCase().includes('assistance');

  return {
    vulnerability_flag: hasVulnerability,
    vulnerability_reasoning: hasVulnerability ? 
      "The conversation indicates potential vulnerability." : 
      "No clear vulnerability indicators detected.",
    relevant_snippet_ids: [] // In a real implementation, we would identify relevant snippets
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