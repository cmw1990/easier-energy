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
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { assetType } = await req.json();
    console.log('Generating asset:', assetType);

    let prompt = '';
    switch (assetType) {
      case 'balloon':
        prompt = 'A cute hot air balloon with pastel colors, simple cartoon style, centered on white background';
        break;
      case 'mountains':
        prompt = 'Peaceful mountain landscape silhouette, simple cartoon style, seamless pattern for game background';
        break;
      case 'clouds':
        prompt = 'Fluffy white cloud, simple cartoon style, on transparent background';
        break;
      case 'obstacles':
        prompt = 'Simple mountain peak silhouette, cartoon style, on transparent background';
        break;
      case 'background':
        prompt = 'Peaceful sky gradient from light blue to white, simple style for game background';
        break;
      default:
        throw new Error('Invalid asset type');
    }

    // Add retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to generate ${assetType}...`);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
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
        console.log(`Successfully generated ${assetType} image`);
        
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
    console.error('Error in generate-game-assets function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});