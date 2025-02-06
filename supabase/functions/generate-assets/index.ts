
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // Check OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      throw new Error('Invalid request format');
    }

    const { type, batch, exerciseType = 'eye_exercise' } = body;
    console.log('Processing request for:', { type, batch, exerciseType });

    if (type !== 'exercise-assets' || !batch) {
      throw new Error('Invalid request parameters');
    }

    // Generate appropriate prompt based on exercise type
    let prompt;
    switch (exerciseType) {
      case 'eye_exercise':
        prompt = `Professional illustration of ${batch.replace(/-/g, ' ')} eye exercise technique, showing clear eye movement pattern, simple vector style with clear instructional elements, calming colors suitable for medical instruction, including numbered steps if relevant, on a clean white background`;
        break;
      case 'desk_yoga':
        prompt = `Clean, professional illustration of ${batch.replace(/-/g, ' ')} yoga pose performed at a desk or office chair, simple vector style with clear instructional elements showing proper form and alignment, using calming colors, including numbered steps if relevant, on a clean white background`;
        break;
      case 'walking':
        prompt = `Professional illustration demonstrating proper ${batch.replace(/-/g, ' ')} for walking exercise, simple vector style showing clear body positioning and movement, using encouraging colors, including instructional elements and proper form indicators, on a clean white background`;
        break;
      case 'running':
        prompt = `Clear, professional illustration showing proper ${batch.replace(/-/g, ' ')} for running technique, simple vector style with anatomical accuracy, demonstrating correct form and movement patterns, using dynamic colors, including instructional elements, on a clean white background`;
        break;
      case 'stretch':
        prompt = `Professional illustration demonstrating proper ${batch.replace(/-/g, ' ')} technique, simple vector style showing clear body positioning and muscle engagement, using calming colors, including directional arrows and form indicators, on a clean white background`;
        break;
      default:
        prompt = `Professional fitness illustration demonstrating ${batch.replace(/-/g, ' ')} exercise, simple vector style with clear instructional elements, on a clean white background`;
    }

    console.log('Generated prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DALL-E API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    console.log('DALL-E response:', data);

    if (!data.data?.[0]?.url) {
      throw new Error('No image URL in response');
    }

    return new Response(
      JSON.stringify({ url: data.data[0].url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
