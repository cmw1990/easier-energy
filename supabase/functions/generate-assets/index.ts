
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error('OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          details: 'Please configure the OPENAI_API_KEY in Supabase Edge Function settings'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Test OpenAI API connection first
    console.log('Testing OpenAI API connection...');
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('OpenAI API connection test failed:', errorText);
      throw new Error('Failed to connect to OpenAI API: ' + errorText);
    }

    console.log('OpenAI API connection test successful');

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { type, batch, description, style } = body;
    console.log(`Request received - Type: ${type}, Batch: ${batch}, Description: ${description}`);

    let prompt;
    let customStyle;

    if (type === 'exercise-assets') {
      if (!batch) {
        return new Response(
          JSON.stringify({ error: 'Missing batch parameter for exercise assets' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      prompt = `Professional illustration of ${batch.replace(/-/g, ' ')} eye exercise, showing eye movement pattern and proper technique, simple vector style, clean design`;
      customStyle = "clean vector illustration style with soft colors, medical illustration quality";
    } else if (type === 'meditation-backgrounds') {
      prompt = description || 'Serene and calming meditation background with soft, ethereal elements';
      customStyle = style || "ethereal, dreamlike, soft colors, minimalist zen style";
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid asset type' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Generate image
    console.log('Generating image with DALL-E...');
    const finalPrompt = `${prompt} Style: ${customStyle}`;
    console.log('Using prompt:', finalPrompt);

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
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await response.json();
    console.log('Image generated successfully');
    
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

  } catch (error) {
    console.error('Error in generate-assets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
