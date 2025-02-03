import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const assets = [
      {
        name: 'pufferfish',
        prompt: 'A cute, cartoon-style pufferfish character with big eyes, perfect for a children\'s game. The pufferfish should be centered and facing right, with a transparent background.',
      },
      {
        name: 'bubbles',
        prompt: 'Simple, cartoon-style air bubbles of various sizes with a transparent background, suitable for an underwater game scene.',
      },
      {
        name: 'seaweed',
        prompt: 'Cartoon-style green seaweed plants swaying in water, with a transparent background, for an underwater game scene.',
      },
      {
        name: 'smallFish',
        prompt: 'Small, cute cartoon fish in bright colors with a transparent background, perfect as collectible items in an underwater game.',
      },
      {
        name: 'predator',
        prompt: 'A cartoon-style shark or barracuda as an obstacle, not too scary but clearly a predator, with a transparent background.',
      },
      {
        name: 'background',
        prompt: 'A peaceful underwater scene background with light blue water, some distant coral reefs, and subtle light rays coming from above.',
      },
    ]

    const generatedAssets = []

    for (const asset of assets) {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: asset.prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Failed to generate ${asset.name}: ${data.error?.message}`)
      }

      const imageUrl = data.data[0].url
      const imageResponse = await fetch(imageUrl)
      const imageBlob = await imageResponse.blob()

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('game-assets')
        .upload(`pufferfish/${asset.name}.png`, imageBlob, {
          contentType: 'image/png',
          upsert: true
        })

      if (uploadError) {
        throw new Error(`Failed to upload ${asset.name}: ${uploadError.message}`)
      }

      generatedAssets.push({
        name: asset.name,
        path: uploadData.path
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Assets generated and uploaded successfully',
        assets: generatedAssets
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating assets:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})