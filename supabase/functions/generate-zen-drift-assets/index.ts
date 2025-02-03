import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

const carPrompts = [
  "A sleek Toyota AE86 in white and black, iconic drift car, digital art style, dreamy atmosphere",
  "A modified Nissan Silvia S15 in metallic blue, professional drift car, artistic rendering",
  "A classic Mazda RX-7 FD in candy red, drift-ready, ethereal digital artwork",
  "A Nissan Skyline R34 in midnight purple, drift spec, dreamlike digital illustration"
]

const backgroundPrompts = [
  "A serene mountain road with cherry blossoms, winding through misty peaks, ethereal atmosphere, digital art",
  "A peaceful countryside road at sunset, surrounded by lavender fields, dreamy digital artwork",
  "A mystical forest road with dappled sunlight, zen-like atmosphere, digital illustration",
  "A coastal mountain pass with ocean views, tranquil atmosphere, digital art style"
]

const effectPrompts = [
  "Ethereal drift smoke trails in pastel colors, digital art style",
  "Glowing particle effects for car boost, magical atmosphere, digital illustration",
  "Zen-inspired motion blur effects, peaceful color palette, digital artwork",
  "Dreamy light trails for night drifting, neon accents, digital art"
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Starting Zen Drift assets generation...')
    const assets: { [key: string]: string } = {}

    // Generate cars
    for (let i = 0; i < carPrompts.length; i++) {
      try {
        console.log(`Generating car ${i + 1}...`)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: carPrompts[i],
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`OpenAI API error for car ${i + 1}:`, errorData);
          throw new Error(`OpenAI API returned ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json()
        console.log(`OpenAI response for car ${i + 1}:`, data);

        if (!data.data?.[0]?.url) {
          throw new Error(`No image URL in OpenAI response for car ${i + 1}`);
        }

        const imageUrl = data.data[0].url
        const imageName = `car_${i + 1}.png`
        
        // Download image and upload to Supabase Storage
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image for car ${i + 1}`);
        }

        const imageBlob = await imageResponse.blob()
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('game-assets')
          .upload(`zen-drift/cars/${imageName}`, imageBlob, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`Upload error for car ${i + 1}:`, uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('game-assets')
          .getPublicUrl(`zen-drift/cars/${imageName}`)
        
        assets[`car_${i + 1}`] = publicUrl
        console.log(`Successfully generated and uploaded car ${i + 1}`);
      } catch (carError) {
        console.error(`Error processing car ${i + 1}:`, carError);
        throw carError;
      }
    }

    // Generate backgrounds with similar error handling
    for (let i = 0; i < backgroundPrompts.length; i++) {
      try {
        console.log(`Generating background ${i + 1}...`)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: backgroundPrompts[i],
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`OpenAI API error for background ${i + 1}:`, errorData);
          throw new Error(`OpenAI API returned ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json()
        console.log(`OpenAI response for background ${i + 1}:`, data);

        if (!data.data?.[0]?.url) {
          throw new Error(`No image URL in OpenAI response for background ${i + 1}`);
        }

        const imageUrl = data.data[0].url
        const imageName = `background_${i + 1}.png`
        
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image for background ${i + 1}`);
        }

        const imageBlob = await imageResponse.blob()
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('game-assets')
          .upload(`zen-drift/backgrounds/${imageName}`, imageBlob, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`Upload error for background ${i + 1}:`, uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('game-assets')
          .getPublicUrl(`zen-drift/backgrounds/${imageName}`)
        
        assets[`background_${i + 1}`] = publicUrl
        console.log(`Successfully generated and uploaded background ${i + 1}`);
      } catch (backgroundError) {
        console.error(`Error processing background ${i + 1}:`, backgroundError);
        throw backgroundError;
      }
    }

    // Generate effects with similar error handling
    for (let i = 0; i < effectPrompts.length; i++) {
      try {
        console.log(`Generating effect ${i + 1}...`)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: effectPrompts[i],
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`OpenAI API error for effect ${i + 1}:`, errorData);
          throw new Error(`OpenAI API returned ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json()
        console.log(`OpenAI response for effect ${i + 1}:`, data);

        if (!data.data?.[0]?.url) {
          throw new Error(`No image URL in OpenAI response for effect ${i + 1}`);
        }

        const imageUrl = data.data[0].url
        const imageName = `effect_${i + 1}.png`
        
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image for effect ${i + 1}`);
        }

        const imageBlob = await imageResponse.blob()
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('game-assets')
          .upload(`zen-drift/effects/${imageName}`, imageBlob, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`Upload error for effect ${i + 1}:`, uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('game-assets')
          .getPublicUrl(`zen-drift/effects/${imageName}`)
        
        assets[`effect_${i + 1}`] = publicUrl
        console.log(`Successfully generated and uploaded effect ${i + 1}`);
      } catch (effectError) {
        console.error(`Error processing effect ${i + 1}:`, effectError);
        throw effectError;
      }
    }

    console.log('Asset generation completed!')
    return new Response(
      JSON.stringify({ 
        status: 'success',
        message: 'Generated all Zen Drift assets successfully',
        assets 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating assets:', error)
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