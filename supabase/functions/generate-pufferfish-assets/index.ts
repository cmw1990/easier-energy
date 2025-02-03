import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { assetType } = await req.json();
    console.log('Generating asset:', assetType);

    const prompts = {
      pufferfish: "Create a cute cartoon pufferfish character in a side view against a transparent background. The pufferfish should be friendly-looking with big expressive eyes, in a simple, clean art style suitable for a game. Use soft colors.",
      bubbles: "Create a simple, clean bubble pattern against a transparent background. The bubbles should be varying in size and have a slight blue tint with transparency.",
      coral: "Design a colorful coral piece in a simple, clean art style against a transparent background. Use warm colors like pink and orange.",
      seaweed: "Create a simple seaweed plant design against a transparent background. Use different shades of green in a clean, game-friendly art style.",
      smallFish: "Design a small, cute tropical fish in a side view against a transparent background. Use bright, cheerful colors in a simple art style.",
      predator: "Create a cartoon shark or barracuda character in a side view against a transparent background. Make it look slightly menacing but still cartoon-style.",
      background: "Create a serene underwater background with subtle gradients of blue. Include some distant coral and seaweed silhouettes for depth."
    };

    const prompt = prompts[assetType as keyof typeof prompts];
    if (!prompt) {
      throw new Error('Invalid asset type requested');
    }

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
        response_format: "b64_json"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    console.log('Successfully generated image for:', assetType);
    
    return new Response(JSON.stringify({ image: data.data[0].b64_json }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating game asset:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});