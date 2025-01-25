import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { contact_id } = await req.json()

    if (!contact_id) {
      throw new Error('contact_id is required')
    }

    console.log("Processing assessment for contact:", contact_id)

    // Fetch complaints assessment
    const { data: complaintsData, error: complaintsError } = await supabaseClient
      .from('ai_assess_complaints')
      .select('*')
      .eq('contact_id', contact_id)
      .maybeSingle()

    if (complaintsError) {
      console.error("Error fetching complaints:", complaintsError)
      throw complaintsError
    }

    console.log("Complaints data:", complaintsData)

    // Fetch vulnerability assessment
    const { data: vulnerabilityData, error: vulnerabilityError } = await supabaseClient
      .from('ai_assess_vulnerability')
      .select('*')
      .eq('contact_id', contact_id)
      .maybeSingle()

    if (vulnerabilityError) {
      console.error("Error fetching vulnerability:", vulnerabilityError)
      throw vulnerabilityError
    }

    console.log("Vulnerability data:", vulnerabilityData)

    // Fetch conversation snippets if needed
    const snippetIds = [
      ...(complaintsData?.relevant_snippet_ids || []),
      ...(vulnerabilityData?.relevant_snippet_ids || [])
    ]

    let snippetsData = []
    if (snippetIds.length > 0) {
      const { data: snippets, error: snippetsError } = await supabaseClient
        .rpc('get_conversation_snippets', {
          p_contact_id: contact_id,
          p_snippet_ids: snippetIds
        })

      if (snippetsError) {
        console.error("Error fetching snippets:", snippetsError)
        throw snippetsError
      }
      snippetsData = snippets
    }

    console.log("Snippets data:", snippetsData)

    const response = {
      complaints: complaintsData,
      vulnerability: vulnerabilityData,
      snippets: snippetsData
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})