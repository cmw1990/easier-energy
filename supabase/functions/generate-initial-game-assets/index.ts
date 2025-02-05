import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Parse request body
    const { batch, description } = await req.json();
    
    if (!batch || !description) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Generating assets for batch: ${batch}`);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate images using OpenAI
    const assets = ['balloon', 'background'];
    const generatedAssets = [];

    for (const asset of assets) {
      const assetPrompt = asset === 'balloon' 
        ? `A beautiful, serene hot air balloon design. The balloon should be colorful and welcoming, perfect for a meditation app. Style: Simple, clean vector illustration with clear silhouette.`
        : `A peaceful, calming sky background with soft clouds. Perfect for a meditation app background. Style: Gentle gradients, soothing colors, minimal design.`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: assetPrompt,
          n: 1,
          size: "1024x1024",
          response_format: "url"
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const imageData = await response.json();
      const imageUrl = imageData.data[0].url;

      // Download the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image for ${asset}`);
      }
      const imageBlob = await imageResponse.blob();

      // Upload to Supabase Storage
      const filePath = `${batch}/${asset}.png`;
      const { error: uploadError } = await supabaseClient
        .storage
        .from('game-assets')
        .upload(filePath, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabaseClient
        .storage
        .from('game-assets')
        .getPublicUrl(filePath);

      generatedAssets.push({ asset, url: publicUrl });
      
      // Add delay between generations to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ 
        message: 'Assets generated and uploaded successfully',
        assets: generatedAssets 
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