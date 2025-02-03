import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Edge function starting...');

// Initialize OpenAI
const openAiKey = Deno.env.get('OPENAI_API_KEY');
if (!openAiKey) {
  console.error('OPENAI_API_KEY is not set');
  throw new Error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI({
  apiKey: openAiKey,
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found');
  throw new Error('Supabase credentials not found');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateAssets() {
  console.log('Starting asset generation...');
  
  try {
    const assets = [
      // Pufferfish game assets
      { name: 'pufferfish', prompt: 'A cute cartoon pufferfish character, simple design, transparent background, cheerful expression' },
      { name: 'bubbles', prompt: 'Simple blue cartoon bubbles, transparent background, playful design' },
      { name: 'coral', prompt: 'Colorful cartoon coral reef element, transparent background, vibrant colors' },
      { name: 'seaweed', prompt: 'Green cartoon seaweed, simple design, transparent background, wavy shape' },
      { name: 'smallFish', prompt: 'Tiny cute cartoon fish, simple design, transparent background, friendly appearance' },
      { name: 'predator', prompt: 'Cartoon shark character, not too scary, transparent background, playful design' },
      { name: 'background', prompt: 'Underwater ocean scene, cartoon style, blue water background, peaceful atmosphere' },
      // Balloon journey assets
      { name: 'balloon', prompt: 'Colorful hot air balloon, cartoon style, transparent background' },
      { name: 'mountains', prompt: 'Cartoon mountain range, scenic view, transparent background' },
      { name: 'clouds', prompt: 'White fluffy cartoon clouds, transparent background' },
      { name: 'obstacles', prompt: 'Various cartoon obstacles for a balloon game (birds, planes, etc), transparent background' },
      { name: 'sky_background', prompt: 'Beautiful sky background with gradient colors, suitable for a balloon game' }
    ];

    for (const asset of assets) {
      console.log(`Generating ${asset.name}...`);
      
      try {
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
        
        // Upload to appropriate folder based on game type
        const folder = asset.name.includes('balloon') ? 'balloon' : 'pufferfish';
        
        const { error: uploadError } = await supabase.storage
          .from('game-assets')
          .upload(`${folder}/${asset.name}.png`, buffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        console.log(`Successfully uploaded ${asset.name} to storage`);
        
        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing ${asset.name}:`, error);
        throw error;
      }
    }

    console.log('Asset generation completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error in generateAssets:', error);
    throw error;
  }
}

// Serve HTTP requests
Deno.serve(async (req) => {
  // Log request details
  console.log(`Received ${req.method} request to generate assets`);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await generateAssets();
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Immediately invoke generateAssets when the function is deployed
console.log('Attempting immediate asset generation...');
generateAssets()
  .then(() => console.log('Initial asset generation completed'))
  .catch(error => console.error('Initial asset generation failed:', error));