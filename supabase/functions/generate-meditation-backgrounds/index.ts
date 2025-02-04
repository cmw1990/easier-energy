import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json()
    console.log('Generating background for session:', sessionId)

    // Get session details to customize the prompt
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: session } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (!session) {
      throw new Error('Session not found')
    }

    // Generate image with DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
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

    const data = await response.json()
    console.log('Image generated successfully')

    // Update the session with the new background
    const { error: updateError } = await supabase
      .from('meditation_sessions')
      .update({ background_image_url: data.data[0].url })
      .eq('id', sessionId)

    if (updateError) throw updateError
    console.log('Session updated with new background')

    return new Response(
      JSON.stringify({ success: true, url: data.data[0].url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating meditation background:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})