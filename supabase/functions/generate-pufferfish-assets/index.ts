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
    const { assetType } = await req.json();

    const prompts = {
      pufferfish: "Create a cute, cartoonish pufferfish character in two states - normal and inflated. Use soft, friendly colors with a transparent background. The pufferfish should have expressive eyes and a gentle smile, making it appealing to both children and adults. Style should be watercolor-like with subtle gradients.",
      bubbles: "Design a set of translucent, iridescent bubbles in various sizes with subtle rainbow reflections. Use a minimalist, clean style with a transparent background. The bubbles should look magical and dreamy.",
      coral: "Illustrate colorful coral reef elements in a soft, artistic style. Use pastel colors and gentle shapes that would work well as game obstacles. Include various shapes and sizes, all on a transparent background.",
      seaweed: "Create flowing seaweed in gentle, calming shades of green and blue. The seaweed should look graceful and move naturally, drawn in a soft, artistic style with a transparent background.",
      smallFish: "Design a collection of small, friendly fish in various colors and shapes. Use a consistent, cute art style that matches the pufferfish character. The fish should look harmless and playful.",
      predators: "Create intimidating but not scary sea predators (like friendly sharks or grumpy bigger fish) in the same artistic style as the other elements. Use bold but not threatening designs with personality.",
      background: "Create a serene underwater background with subtle light rays and a gentle gradient from light blue at the top to deeper blue at the bottom. The style should be calming and peaceful.",
    };

    const prompt = prompts[assetType as keyof typeof prompts];
    if (!prompt) {
      throw new Error('Invalid asset type requested');
    }

    console.log('Generating game asset:', assetType);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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