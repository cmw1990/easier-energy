
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Verify OpenAI API key early
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error('OpenAI API key is missing');
      throw new Error('OpenAI API key is not configured');
    }

    // Parse request body with better error handling
    let body;
    try {
      body = await req.json();
      console.log('Successfully parsed request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      throw new Error('Invalid request body format');
    }

    const { type, batch, description, style } = body;
    console.log('Request parameters:', { type, batch, description, style });

    // Validate required parameters
    if (!type) {
      throw new Error('Asset type is required');
    }

    let prompt;
    let customStyle;

    if (type === 'exercise-assets') {
      if (!batch) {
        throw new Error('Missing batch parameter for exercise assets');
      }
      prompt = `Professional illustration of ${batch.replace(/-/g, ' ')} eye exercise, showing eye movement pattern and proper technique, simple vector style, clean design`;
      customStyle = "clean vector illustration style with soft colors, medical illustration quality";
    } else if (type === 'meditation-backgrounds') {
      prompt = description || 'Serene and calming meditation background with soft, ethereal elements';
      customStyle = style || "ethereal, dreamlike, soft colors, minimalist zen style";
    } else if (type === 'game-assets') {
      prompt = description || 'Beautiful and peaceful game assets with a calming atmosphere';
      customStyle = style || "zen-like, artistic, dreamy, ethereal";
    } else {
      throw new Error(`Invalid asset type: ${type}`);
    }

    // Generate image with optimized settings
    console.log('Preparing to call DALL-E API...');
    const finalPrompt = `${prompt} Style: ${customStyle}`;
    console.log('Using prompt:', finalPrompt);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: finalPrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url"
        })
      });

      console.log('DALL-E API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('DALL-E API error details:', errorData);
        throw new Error(`DALL-E API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const imageData = await response.json();
      console.log('Successfully received image data:', imageData);

      if (!imageData.data?.[0]?.url) {
        console.error('Invalid image data format:', imageData);
        throw new Error('No image URL in response');
      }

      console.log('Successfully generated image URL');
      return new Response(
        JSON.stringify({ 
          url: imageData.data[0].url,
          message: 'Asset generated successfully'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (apiError) {
      console.error('Error calling DALL-E API:', apiError);
      throw new Error(`Failed to generate image: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Error in generate-assets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: error.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
