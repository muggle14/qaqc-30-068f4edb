import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { contact_id } = await req.json()

    // Fetch complaints assessment
    const { data: complaintsData, error: complaintsError } = await supabaseClient
      .from('ai_assess_complaints')
      .select('*')
      .eq('contact_id', contact_id)
      .maybeSingle()

    if (complaintsError) throw complaintsError

    // Fetch vulnerability assessment
    const { data: vulnerabilityData, error: vulnerabilityError } = await supabaseClient
      .from('ai_assess_vulnerability')
      .select('*')
      .eq('contact_id', contact_id)
      .maybeSingle()

    if (vulnerabilityError) throw vulnerabilityError

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

      if (snippetsError) throw snippetsError
      snippetsData = snippets
    }

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})