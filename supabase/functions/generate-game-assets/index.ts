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

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    const image = data.data[0].b64_json;

    return new Response(
      JSON.stringify({ image }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-game-assets function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});