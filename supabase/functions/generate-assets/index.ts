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
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { type, batch, description } = await req.json();
    console.log(`Generating assets for type: ${type}, batch: ${batch}`);

    if (!type || (type === 'game-assets' && !batch)) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let assets = [];
    let prompts = {};

    switch (type) {
      case 'game-assets':
        assets = ['balloon', 'background'];
        prompts = {
          balloon: `A beautiful, serene hot air balloon design. The balloon should be colorful and welcoming, perfect for a meditation app. Style: Simple, clean vector illustration with clear silhouette.`,
          background: `A peaceful, calming sky background with soft clouds. Perfect for a meditation app background. Style: Gentle gradients, soothing colors, minimal design.`
        };
        break;
      case 'exercise':
        assets = ['pose', 'instruction'];
        prompts = {
          pose: `A clear illustration of a person performing ${description}. Style: Clean, professional fitness instruction illustration.`,
          instruction: `Step-by-step visual guide for ${description}. Style: Clear, instructional diagram style.`
        };
        break;
      default:
        throw new Error(`Unsupported asset type: ${type}`);
    }

    const generatedAssets = [];

    for (const asset of assets) {
      const assetPrompt = prompts[asset];
      
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

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image for ${asset}`);
      }
      const imageBlob = await imageResponse.blob();

      const storagePath = type === 'game-assets' 
        ? `${batch}/${asset}.png`
        : `${type}/${asset}_${Date.now()}.png`;

      const { error: uploadError } = await supabaseClient
        .storage
        .from(type === 'game-assets' ? 'game-assets' : 'exercise-assets')
        .upload(storagePath, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabaseClient
        .storage
        .from(type === 'game-assets' ? 'game-assets' : 'exercise-assets')
        .getPublicUrl(storagePath);

      generatedAssets.push({ asset, url: publicUrl });
      
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