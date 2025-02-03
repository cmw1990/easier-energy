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
    
    const prompts = {
      balloon: "Create a whimsical hot air balloon in soft watercolor style with pastel colors against a transparent background. The balloon should look dreamy and magical with gentle swirls and patterns.",
      mountains: "Design a serene mountain landscape in soft pastel colors using a minimalist Japanese art style. Show distant peaks and valleys with gentle gradients, perfect for a peaceful side-scrolling game background.",
      clouds: "Illustrate delicate, wispy clouds in soft pastel colors using a minimalist watercolor style. The clouds should appear light and airy against a transparent background.",
      obstacles: "Create gentle floating islands with zen garden elements in soft pastel colors. Use a minimalist style with subtle details like small trees or rocks, perfect for game obstacles.",
      background: "Design a peaceful sky gradient background in soft pastel colors, transitioning from gentle dawn colors at the bottom to serene twilight hues at the top. Use a minimalist, calming style."
    };

    const prompt = prompts[assetType as keyof typeof prompts];
    if (!prompt) {
      throw new Error('Invalid asset type requested');
    }

    console.log('Generating game asset:', assetType);
    
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

    const data = await response.json();
    console.log('Successfully generated image');
    
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