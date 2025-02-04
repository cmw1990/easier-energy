import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Edge function called with request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Initialize OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Parse request body
    const { batch, type, description } = await req.json();
    console.log('Received parameters:', { batch, type, description });
    
    if (!batch || !type || !description) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate image using OpenAI
    console.log('Calling OpenAI API with description:', description);
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      
      // Check specifically for billing errors
      if (error.error?.message?.includes('billing')) {
        return new Response(
          JSON.stringify({ 
            error: 'OpenAI billing limit reached',
            details: 'Please check your OpenAI account billing status',
            code: 'BILLING_LIMIT'
          }),
          { 
            status: 402, // Payment Required
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const imageData = await response.json();
    console.log('OpenAI response received');
    const imageUrl = imageData.data[0].url;

    // Download the image
    console.log('Downloading generated image');
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    console.log('Uploading to Supabase Storage');
    const filePath = `${batch}/asset.png`;
    const { error: uploadError } = await supabaseClient
      .storage
      .from('exercise-assets')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('exercise-assets')
      .getPublicUrl(filePath);

    console.log('Successfully generated and uploaded asset:', publicUrl);

    return new Response(
      JSON.stringify({ 
        message: 'Asset generated and uploaded successfully',
        url: publicUrl 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in edge function:', error);
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