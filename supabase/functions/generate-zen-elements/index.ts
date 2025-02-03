import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }
    
    const prompts = [
      "Create a minimalist Japanese zen garden stone in soft pastel colors. A single, elegant stone with subtle shadows, rendered in a watercolor style with transparent background. Use muted tones of sage green, dusty rose, and lavender.",
      "Design a delicate zen sand pattern in soft pastel colors, showing gentle ripples like those made by a rake in a Japanese rock garden. Use minimal lines in pale beige and cream tones, with a transparent background.",
      "Illustrate a simple zen garden bonsai tree in a minimalist style, using soft pastel colors. Show graceful branches with a few leaves, rendered in gentle strokes of pale pink and mint green against a transparent background.",
      "Create a minimal zen garden moss element in soft watercolor style, showing subtle texture and depth. Use gentle shades of sage and moss green with transparent background, perfect for digital layering.",
      "Design a simple zen garden bamboo element in delicate pastel colors. Show a few elegant stalks with minimal leaves, using soft greens and pale gold tones, with a transparent background.",
      "Illustrate a zen garden lantern in minimalist style, using soft pastel colors. Show simple geometric shapes with subtle glow effects, using gentle tones of warm gray and soft yellow against a transparent background.",
      "Create a minimal zen garden bridge element in soft watercolor style. Show graceful curves and simple wooden texture, using warm browns and soft grays with transparent background.",
      "Design a zen garden koi fish in delicate pastel colors. Show flowing, abstract forms suggesting movement, using soft pinks and blues with transparent background."
    ];
    
    // Randomly select a prompt
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    console.log('Using prompt:', prompt);

    // Add retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to generate image...`);
        
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
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('Successfully generated zen element');
        
        return new Response(JSON.stringify({ image: data.data[0].b64_json }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        lastError = error;
        attempts++;
        
        if (attempts < maxAttempts) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, attempts) * 1000;
          console.log(`Waiting ${delay}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to generate image after multiple attempts');
  } catch (error) {
    console.error('Error generating zen element:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});