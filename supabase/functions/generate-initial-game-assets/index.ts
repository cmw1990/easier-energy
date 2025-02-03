import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Edge function starting...');

const openAiKey = Deno.env.get('OPENAI_API_KEY');
if (!openAiKey) {
  console.error('OPENAI_API_KEY is not set');
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: openAiKey,
});

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found');
  throw new Error('Supabase credentials not found');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateAndUploadAsset(asset: { name: string, prompt: string }, gameType: string, retryCount = 0) {
  const maxRetries = 2;
  try {
    console.log(`Generating ${asset.name} for ${gameType}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: asset.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    if (!response.data[0].b64_json) {
      throw new Error(`No image data received for ${asset.name}`);
    }

    console.log(`Successfully generated ${asset.name}, uploading to storage...`);
    
    const buffer = Uint8Array.from(atob(response.data[0].b64_json), c => c.charCodeAt(0));
    
    const { error: uploadError } = await supabase.storage
      .from('game-assets')
      .upload(`${gameType}/${asset.name}.png`, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    console.log(`Successfully uploaded ${asset.name} to ${gameType} folder`);
    return true;
  } catch (error) {
    console.error(`Error processing ${asset.name} (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < maxRetries) {
      const delay = (retryCount + 1) * 2000;
      console.log(`Retrying ${asset.name} in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateAndUploadAsset(asset, gameType, retryCount + 1);
    }
    
    throw error;
  }
}

async function generateBatch(assets: Array<{ name: string, prompt: string }>, gameType: string) {
  console.log(`Starting batch generation for ${gameType} with ${assets.length} assets`);
  
  for (const asset of assets) {
    try {
      await generateAndUploadAsset(asset, gameType);
      // Add delay between assets to manage resource usage
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Failed to generate ${asset.name} for ${gameType}:`, error);
      // Continue with next asset even if one fails
      continue;
    }
  }
}

async function generateAssets(req: Request) {
  console.log('Starting asset generation process...');
  
  const { batch = 'all' } = await req.json().catch(() => ({ batch: 'all' }));
  
  const pufferfishAssets = [
    { name: 'pufferfish', prompt: 'A cute cartoon pufferfish character, simple design, transparent background, cheerful expression' },
    { name: 'bubbles', prompt: 'Simple blue cartoon bubbles, transparent background, playful design' },
    { name: 'coral', prompt: 'Colorful cartoon coral reef element, transparent background, vibrant colors' },
    { name: 'seaweed', prompt: 'Simple seaweed plant design, transparent background, shades of green' },
    { name: 'smallFish', prompt: 'Small cute tropical fish, transparent background, bright colors' },
    { name: 'predator', prompt: 'Cartoon shark character, transparent background, slightly menacing but cute' },
    { name: 'background', prompt: 'Serene underwater background, blue gradient with distant coral silhouettes' }
  ];

  const balloonAssets = [
    { name: 'balloon', prompt: 'A cute hot air balloon with pastel colors, simple cartoon style, centered on transparent background' },
    { name: 'clouds', prompt: 'Fluffy white cloud, simple cartoon style, on transparent background' },
    { name: 'mountains', prompt: 'Simple mountain silhouettes, cartoon style, on transparent background' },
    { name: 'birds', prompt: 'Simple cartoon birds silhouettes, transparent background' },
    { name: 'background', prompt: 'Peaceful sky gradient from light blue to white, simple style for game background' }
  ];

  const colorMatchAssets = [
    { name: 'background', prompt: 'Abstract geometric pattern with soft colors for a game background' },
    { name: 'particle', prompt: 'Simple colorful particle effect, transparent background' }
  ];

  try {
    if (batch === 'all' || batch === 'pufferfish') {
      await generateBatch(pufferfishAssets, 'pufferfish');
      // Add delay between batches
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    if (batch === 'all' || batch === 'balloon') {
      await generateBatch(balloonAssets, 'balloon');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (batch === 'all' || batch === 'color-match') {
      await generateBatch(colorMatchAssets, 'color-match');
    }

    console.log('Asset generation completed successfully!');
    return { success: true, message: 'Assets generated successfully' };
  } catch (error) {
    console.error('Error in generateAssets:', error);
    throw error;
  }
}

// Create a Deno server to handle HTTP requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await generateAssets(req);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});