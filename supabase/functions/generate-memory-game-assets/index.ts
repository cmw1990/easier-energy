import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MEMORY_GAME_ASSETS = [
  {
    name: "pattern-shapes",
    prompt: "Create a set of simple, clean geometric shapes (circle, square, triangle, diamond) in vibrant colors against a transparent background. Minimalist design, perfect for a memory game. Vector art style.",
  },
  {
    name: "sequence-numbers",
    prompt: "Design modern, playful numbers from 1-9 with a soft gradient background. Each number should be distinct and easily readable. Flat design style with subtle shadows.",
  },
  {
    name: "word-chain-background",
    prompt: "Create an abstract background with floating letters and connecting lines, suggesting word associations and mental connections. Soft, muted colors perfect for a word game.",
  },
  {
    name: "memory-cards-background",
    prompt: "Design a subtle, elegant pattern with abstract symbols representing memory and cognition. Light, airy design that won't distract from the main game elements.",
  },
  {
    name: "success-animation",
    prompt: "Create a celebratory burst of particles and stars, perfect for a success animation in a memory game. Bright, cheerful colors against a transparent background.",
  },
  {
    name: "focus-icon",
    prompt: "Design a modern icon representing mental focus and concentration. Simple, clean lines with a gradient effect. Perfect for a game interface.",
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const openAIResponse = await Promise.all(
      MEMORY_GAME_ASSETS.map(async (asset) => {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: asset.prompt,
            n: 1,
            size: "1024x1024",
            response_format: "url"
          })
        });

        const data = await response.json();
        const imageUrl = data.data[0].url;

        // Download the image
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('game-assets')
          .upload(`memory-games/${asset.name}.png`, imageBlob, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabaseClient
          .storage
          .from('game-assets')
          .getPublicUrl(`memory-games/${asset.name}.png`);

        return {
          name: asset.name,
          url: publicUrl
        };
      })
    );

    return new Response(
      JSON.stringify({ 
        message: 'Memory game assets generated and uploaded successfully',
        assets: openAIResponse 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})