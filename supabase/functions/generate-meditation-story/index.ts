import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { theme, duration } = await req.json()

    // Generate story content using GPT-4
    const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a meditation guide specializing in creating calming, peaceful stories for sleep and relaxation.'
          },
          {
            role: 'user',
            content: `Create a gentle meditation story about ${theme}. The story should be soothing and last about ${duration} minutes when read aloud. Include natural imagery and peaceful scenarios.`
          }
        ],
        temperature: 0.7,
      }),
    })

    const storyData = await storyResponse.json()
    const storyText = storyData.choices[0].message.content

    // Convert story to speech using OpenAI's TTS
    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: storyText,
        voice: 'nova',
        response_format: 'mp3',
      }),
    })

    // Convert audio buffer to base64
    const arrayBuffer = await audioResponse.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        story: storyText,
        audio: base64Audio
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error generating meditation story:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})