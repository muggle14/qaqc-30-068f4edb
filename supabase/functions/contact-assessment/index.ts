import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { createClient } from '@supabase/supabase-js'
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

const env = await load();

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { contact_id } = await req.json()

    if (!contact_id) {
      throw new Error('Contact ID is required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch conversation transcript
    const { data: conversationData, error: conversationError } = await supabase
      .from('contact_conversations')
      .select('transcript')
      .eq('contact_id', contact_id)
      .single()

    if (conversationError || !conversationData) {
      throw new Error('Failed to fetch conversation transcript')
    }

    // Import and use Python assessment functions
    const { assess_complaints, assess_vulnerability, store_assessment_results } = await import('./backend/assessment.py')
    
    // Perform assessments
    const complaintsResult = await assess_complaints(conversationData.transcript)
    const vulnerabilityResult = await assess_vulnerability(conversationData.transcript)

    // Store results
    const results = await store_assessment_results(
      supabase,
      contact_id,
      complaintsResult,
      vulnerabilityResult
    )

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})