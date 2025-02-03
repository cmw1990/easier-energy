import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

const balloonPrompts = [
  "A colorful hot air balloon with a peaceful design, digital art style, soft colors",
  "A serene sky background with gentle clouds, digital art style, calming atmosphere"
];

const zenGardenPrompts = [
  "Zen garden elements like stones and sand patterns, digital art style",
  "Japanese lantern and bamboo elements, digital art style",
  "Bonsai tree and moss elements, digital art style",
  "Wooden bridge and koi fish elements, digital art style"
];

async function generateAndUploadImage(prompt: string, folder: string, filename: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `${prompt}. Style: Digital art, peaceful and zen-inspired aesthetic`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await response.json();
    const imageUrl = imageData.data[0].url;
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image');
    }
    
    const imageBlob = await imageResponse.blob();
    const filePath = `${folder}/${filename}.png`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('game-assets')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('game-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`Error generating/uploading ${filename}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results = {
      balloon: {},
      zenGarden: {}
    };

    // Generate balloon game assets
    for (let i = 0; i < balloonPrompts.length; i++) {
      const filename = i === 0 ? 'balloon' : 'background';
      const url = await generateAndUploadImage(
        balloonPrompts[i],
        'balloon',
        filename
      );
      results.balloon[filename] = url;
    }

    // Generate zen garden assets
    const zenElements = ['stone', 'lantern', 'bonsai', 'bridge'];
    for (let i = 0; i < zenGardenPrompts.length; i++) {
      const url = await generateAndUploadImage(
        zenGardenPrompts[i],
        'zen-garden',
        zenElements[i]
      );
      results.zenGarden[zenElements[i]] = url;
    }

    return new Response(
      JSON.stringify({
        message: 'Assets generated and uploaded successfully',
        urls: results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error generating assets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});