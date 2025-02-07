
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    if (!type || !batch || typeof batch !== 'string') {
      throw new Error('Invalid request parameters: type and batch are required');
    }

    // Validate exercise type
    const validExerciseTypes = ['eye_exercise', 'desk_yoga', 'walking', 'running', 'stretch'];
    if (!validExerciseTypes.includes(exerciseType)) {
      throw new Error(`Invalid exercise type. Must be one of: ${validExerciseTypes.join(', ')}`);
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
        prompt = `Professional illustration demonstrating proper ${batch.replace(/-/g, ' ')} stretching technique, simple vector style showing clear body positioning and muscle engagement, using calming colors, including directional arrows and form indicators, on a clean white background`;
        break;
      default:
        prompt = `Professional fitness illustration demonstrating ${batch.replace(/-/g, ' ')} exercise, simple vector style with clear instructional elements, on a clean white background`;
    }

    console.log('Generated prompt:', prompt);

    // Call DALL-E API with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
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
          console.error(`DALL-E API error (attempt ${attempts + 1}):`, errorData);
          lastError = errorData;
          attempts++;
          if (attempts < maxAttempts) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            continue;
          }
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
        console.error(`Attempt ${attempts + 1} failed:`, error);
        lastError = error;
        attempts++;
        if (attempts < maxAttempts) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
          continue;
        }
      }
    }

    // If we get here, all attempts failed
    throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastError?.message || 'Unknown error'}`);

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
