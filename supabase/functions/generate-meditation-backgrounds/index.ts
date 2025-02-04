import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting background generation process')
    const { sessionId } = await req.json()
    
    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    console.log('Generating background for session:', sessionId)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle()

    if (sessionError) {
      console.error('Error fetching session:', sessionError)
      throw sessionError
    }

    if (!session) {
      throw new Error('Session not found')
    }

    console.log('Found session:', session.title)

    // Generate image with DALL-E
    const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Meditation scene for ${session.type} meditation. ${session.title}. Style: Serene, minimalist, zen-inspired meditation visual. High quality, peaceful atmosphere.`,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const imageData = await openAiResponse.json()
    console.log('Image generated successfully')

    // Update the session with the new background
    const { error: updateError } = await supabase
      .from('meditation_sessions')
      .update({ background_image_url: imageData.data[0].url })
      .eq('id', sessionId)

    if (updateError) {
      console.error('Error updating session:', updateError)
      throw updateError
    }

    console.log('Session updated with new background')

    return new Response(
      JSON.stringify({ success: true, url: imageData.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating meditation background:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})