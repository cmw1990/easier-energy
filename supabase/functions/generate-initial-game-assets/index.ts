import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { OpenAI } from 'https://esm.sh/openai@4.20.1'
import { corsHeaders } from '../_shared/cors.ts'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!,
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Define all the assets we need
    const assets = {
      pufferfish: [
        { name: 'pufferfish', prompt: 'A cute cartoon pufferfish character, simple design, transparent background' },
        { name: 'bubbles', prompt: 'Simple blue cartoon bubbles, transparent background' },
        { name: 'coral', prompt: 'Colorful cartoon coral reef element, transparent background' },
        { name: 'seaweed', prompt: 'Green cartoon seaweed, simple design, transparent background' },
        { name: 'smallFish', prompt: 'Tiny cute cartoon fish, simple design, transparent background' },
        { name: 'predator', prompt: 'Cartoon shark character, not too scary, transparent background' },
        { name: 'background', prompt: 'Underwater ocean scene, cartoon style, blue water background' }
      ],
      zen: [
        { name: 'flower1', prompt: 'Simple zen flower element, minimal design, transparent background' },
        { name: 'flower2', prompt: 'Japanese style cherry blossom, minimal design, transparent background' },
        { name: 'leaf', prompt: 'Zen garden leaf element, minimal design, transparent background' },
        { name: 'stone', prompt: 'Zen garden stone element, minimal design, transparent background' },
        { name: 'bamboo', prompt: 'Simple bamboo element, minimal design, transparent background' }
      ],
      balloon: [
        { name: 'balloon', prompt: 'Colorful hot air balloon, cartoon style, transparent background' },
        { name: 'cloud1', prompt: 'White fluffy cartoon cloud, simple design, transparent background' },
        { name: 'cloud2', prompt: 'Simple white cartoon cloud, different shape, transparent background' },
        { name: 'mountain', prompt: 'Cartoon mountain silhouette, simple design, transparent background' },
        { name: 'background', prompt: 'Peaceful sky background, gradient from light to darker blue' }
      ]
    };

    const results = {
      pufferfish: {},
      zen: {},
      balloon: {}
    };

    // Generate and store assets for each game
    for (const [game, gameAssets] of Object.entries(assets)) {
      console.log(`Generating assets for ${game} game...`);
      
      for (const asset of gameAssets) {
        console.log(`Generating ${asset.name}...`);
        
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: asset.prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
          });

          if (response.data[0].b64_json) {
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

            const { data: { publicUrl } } = supabase.storage
              .from('game-assets')
              .getPublicUrl(`${game}/${asset.name}.png`);

            results[game][asset.name] = publicUrl;
          }
        } catch (error) {
          console.error(`Error generating ${asset.name} for ${game}:`, error);
        }
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})