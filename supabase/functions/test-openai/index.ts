import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured in Supabase')
    }

    console.log('Testing OpenAI connection...')
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: "a simple test image of a small blue dot",
        n: 1,
        size: "1024x1024",
        quality: "standard",
      }),
    })

    const data = await response.json()
    console.log('OpenAI API Response:', data)

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Unknown OpenAI API error'
      console.error('OpenAI API error:', errorMessage)
      throw new Error(errorMessage)
    }

    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'OpenAI API key is working correctly!',
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error testing OpenAI connection:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})