import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Edge function is loading...');

// Immediately check if we have the OpenAI API key
const openAiKey = Deno.env.get('OPENAI_API_KEY');
if (!openAiKey) {
  console.error('OPENAI_API_KEY is not set!');
  throw new Error('OPENAI_API_KEY is not set');
}

console.log('OpenAI API key is present');

const openai = new OpenAI({
  apiKey: openAiKey,
});

async function generateAssets() {
  console.log('Starting asset generation process...');
  
  try {
    console.log('Setting up Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    if (!supabase) {
      throw new Error('Failed to initialize Supabase client');
    }

    console.log('Supabase client initialized');

    // Define all the assets we need
    const assets = {
      pufferfish: [
        { name: 'pufferfish', prompt: 'A cute cartoon pufferfish character, simple design, transparent background, cheerful expression' },
        { name: 'bubbles', prompt: 'Simple blue cartoon bubbles, transparent background, playful design' },
        { name: 'coral', prompt: 'Colorful cartoon coral reef element, transparent background, vibrant colors' },
        { name: 'seaweed', prompt: 'Green cartoon seaweed, simple design, transparent background, wavy shape' },
        { name: 'smallFish', prompt: 'Tiny cute cartoon fish, simple design, transparent background, friendly appearance' },
        { name: 'predator', prompt: 'Cartoon shark character, not too scary, transparent background, playful design' },
        { name: 'background', prompt: 'Underwater ocean scene, cartoon style, blue water background, peaceful atmosphere' }
      ]
    };

    console.log('Starting to generate assets...');

    const results = {
      pufferfish: {},
    };

    // Generate and store assets for each game
    for (const [game, gameAssets] of Object.entries(assets)) {
      console.log(`Generating assets for ${game} game...`);
      
      for (const asset of gameAssets) {
        console.log(`Generating ${asset.name}...`);
        
        try {
          console.log(`Making OpenAI API call for ${asset.name}...`);
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
          
          const { data, error } = await supabase.storage
            .from('game-assets')
            .upload(`${game}/${asset.name}.png`, buffer, {
              contentType: 'image/png',
              upsert: true
            });

          if (error) {
            throw error;
          }

          console.log(`Successfully uploaded ${asset.name} to storage`);

          const { data: { publicUrl } } = supabase.storage
            .from('game-assets')
            .getPublicUrl(`${game}/${asset.name}.png`);

          results[game][asset.name] = publicUrl;
          console.log(`Asset ${asset.name} completed successfully`);
        } catch (error) {
          console.error(`Error generating ${asset.name} for ${game}:`, error);
          throw error; // Re-throw to stop the process
        }
      }
    }

    console.log('Asset generation completed successfully!');
    console.log('Generated assets:', results);
    return results;

  } catch (error) {
    console.error('Error in asset generation process:', error);
    throw error;
  }
}

// Immediately invoke generateAssets when the function is deployed
console.log('Attempting to start asset generation...');
generateAssets()
  .then(results => {
    console.log('Asset generation completed with results:', results);
  })
  .catch(error => {
    console.error('Failed to generate assets:', error);
  });

// Also handle HTTP requests
Deno.serve(async (req) => {
  console.log(`Received ${req.method} request`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const results = await generateAssets();
    return new Response(JSON.stringify({ message: 'Asset generation completed', results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})