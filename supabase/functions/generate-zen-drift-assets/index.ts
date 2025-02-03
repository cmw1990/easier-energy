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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Starting Zen Drift assets generation...')
    const assets: { [key: string]: string } = {}
    const errors: string[] = []

    // Helper function to handle OpenAI API calls
    async function generateImage(prompt: string, index: number, type: string) {
      try {
        console.log(`Generating ${type} ${index + 1}...`)
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`OpenAI API error for ${type} ${index + 1}:`, errorData);
          
          // Check for billing error
          if (errorData.error?.code === 'billing_hard_limit_reached') {
            return new Response(
              JSON.stringify({
                status: 'error',
                message: 'OpenAI billing limit reached. Please check your OpenAI account billing settings and try again later.',
                details: errorData.error.message
              }),
              {
                status: 402, // Payment Required
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          errors.push(`${type} ${index + 1}: OpenAI API error - ${errorData.error?.message || 'Unknown error'}`);
          return null;
        }

        const data = await response.json()
        if (!data.data?.[0]?.url) {
          errors.push(`${type} ${index + 1}: No image URL in OpenAI response`);
          return null;
        }

        const imageUrl = data.data[0].url
        const imageName = `${type.toLowerCase()}_${index + 1}.png`
        
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          errors.push(`${type} ${index + 1}: Failed to download image`);
          return null;
        }

        const imageBlob = await imageResponse.blob()
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('game-assets')
          .upload(`zen-drift/${type.toLowerCase()}s/${imageName}`, imageBlob, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          console.error(`Upload error for ${type} ${index + 1}:`, uploadError);
          errors.push(`${type} ${index + 1}: Upload failed - ${uploadError.message}`);
          return null;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('game-assets')
          .getPublicUrl(`zen-drift/${type.toLowerCase()}s/${imageName}`)
        
        assets[`${type.toLowerCase()}_${index + 1}`] = publicUrl
        console.log(`Successfully generated and uploaded ${type} ${index + 1}`);
        return publicUrl;
      } catch (error) {
        console.error(`Error processing ${type} ${index + 1}:`, error);
        errors.push(`${type} ${index + 1}: ${error.message}`);
        return null;
      }
    }

    // Generate all assets
    for (let i = 0; i < carPrompts.length; i++) {
      const result = await generateImage(carPrompts[i], i, 'Car');
      if (result instanceof Response) return result; // Return early if billing error
    }

    for (let i = 0; i < backgroundPrompts.length; i++) {
      const result = await generateImage(backgroundPrompts[i], i, 'Background');
      if (result instanceof Response) return result; // Return early if billing error
    }

    for (let i = 0; i < effectPrompts.length; i++) {
      const result = await generateImage(effectPrompts[i], i, 'Effect');
      if (result instanceof Response) return result; // Return early if billing error
    }

    // If we have any assets generated, consider it a partial success
    if (Object.keys(assets).length > 0) {
      console.log('Asset generation completed with some assets generated successfully!')
      return new Response(
        JSON.stringify({ 
          status: 'success',
          message: errors.length > 0 ? 'Generated some Zen Drift assets with errors' : 'Generated all Zen Drift assets successfully',
          assets,
          errors: errors.length > 0 ? errors : undefined
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // If no assets were generated, return an error
    console.error('No assets were generated successfully');
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: 'Failed to generate any assets',
        errors 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error generating assets:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
