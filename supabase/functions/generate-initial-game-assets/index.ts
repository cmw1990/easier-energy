import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  description: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed for ${description}:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = error.message?.includes('rate limit') ? 
        RETRY_DELAY * attempt * 2 : 
        RETRY_DELAY * attempt;
      
      await sleep(delay);
    }
  }
  throw new Error(`All ${maxRetries} attempts failed for ${description}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: error.message 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { batch } = requestData;
    
    if (!batch) {
      return new Response(
        JSON.stringify({ error: 'Missing batch parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!GAME_ASSETS_CONFIG[batch]) {
      return new Response(
        JSON.stringify({ error: `Invalid batch type: ${batch}` }),
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

    // Verify OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const assets = GAME_ASSETS_CONFIG[batch];
    const generatedAssets = [];

    for (const asset of assets) {
      console.log(`Generating asset: ${asset.name} for batch: ${batch}`);
      
      try {
        // Generate image using OpenAI
        const imageResponse = await retryOperation(
          async () => {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: "dall-e-3",
                prompt: asset.prompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
              })
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
            }

            return response.json();
          },
          `generating ${asset.name}`
        );

        const imageUrl = imageResponse.data[0].url;

        // Download the image
        const imageBlob = await retryOperation(
          async () => {
            const response = await fetch(imageUrl);
            if (!response.ok) {
              throw new Error(`Failed to download image for ${asset.name}`);
            }
            return response.blob();
          },
          `downloading ${asset.name}`
        );

        // Upload to Supabase Storage
        const filePath = `${batch}/${asset.name}.png`;
        const { error: uploadError } = await retryOperation(
          async () => supabaseClient
            .storage
            .from('game-assets')
            .upload(filePath, imageBlob, {
              contentType: 'image/png',
              upsert: true
            }),
          `uploading ${asset.name}`
        );

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabaseClient
          .storage
          .from('game-assets')
          .getPublicUrl(filePath);

        generatedAssets.push({
          name: asset.name,
          url: publicUrl
        });

        // Add a small delay between generations
        if (asset !== assets[assets.length - 1]) {
          await sleep(1000);
        }

      } catch (error) {
        console.error(`Error generating ${asset.name}:`, error);
        return new Response(
          JSON.stringify({ 
            error: `Failed to generate ${asset.name}`,
            details: error.message
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${batch} assets generated and uploaded successfully`,
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

// Configuration for different game assets
const GAME_ASSETS_CONFIG = {
  'memory-cards': [
    {
      name: "background",
      prompt: "Create a serene, abstract background with subtle memory-related symbols like neurons and synapses. Use soft, calming colors that won't distract from the game elements.",
    },
    {
      name: "card-back",
      prompt: "Design an elegant, minimalist card back pattern with abstract geometric shapes suggesting memory and cognition. Use a cohesive color scheme with our app's primary colors.",
    },
    {
      name: "success-animation",
      prompt: "Create a celebratory burst of particles and stars for matching cards correctly. Use bright, cheerful colors that complement our app's color scheme.",
    }
  ],
  'sequence-memory': [
    {
      name: "background",
      prompt: "Design a modern, minimal background with subtle connected dots and lines suggesting sequences and patterns. Use soft, muted colors.",
    },
    {
      name: "number-tiles",
      prompt: "Create a set of modern, clean number tiles (1-9) with a consistent design style. Use gradients and subtle shadows for depth.",
    },
    {
      name: "highlight-effect",
      prompt: "Design a glowing highlight effect for when numbers are revealed in the sequence. Use bright, attention-grabbing colors.",
    }
  ],
  'visual-memory': [
    {
      name: "background",
      prompt: "Create an abstract grid pattern background with subtle visual elements suggesting memory and focus. Use very light, neutral colors.",
    },
    {
      name: "grid-cell",
      prompt: "Design a clean, minimal grid cell with subtle borders and a soft hover effect. Include both active and inactive states.",
    },
    {
      name: "success-indicator",
      prompt: "Create a simple, elegant checkmark or success indicator that appears when patterns are correctly remembered.",
    }
  ],
  'pattern-match': [
    {
      name: "background",
      prompt: "Design a subtle, geometric background with repeating patterns that don't interfere with the game elements. Use soft, calming colors.",
    },
    {
      name: "pattern-elements",
      prompt: "Create a set of distinct geometric shapes and patterns that will be used for matching. Use clear, bold colors that are easily distinguishable.",
    },
    {
      name: "match-animation",
      prompt: "Design a satisfying animation effect for when patterns are successfully matched. Include sparkles and smooth transitions.",
    }
  ],
  'color-match': [
    {
      name: "background",
      prompt: "Create a clean, minimal background with subtle color theory elements. Use neutral tones that won't interfere with the color matching gameplay.",
    },
    {
      name: "color-buttons",
      prompt: "Design a set of modern, attractive buttons in primary and secondary colors. Include hover and active states.",
    },
    {
      name: "success-effect",
      prompt: "Create a colorful celebration effect for correct color matches. Use complementary colors and dynamic particles.",
    }
  ],
  'word-scramble': [
    {
      name: "background",
      prompt: "Design a playful background with floating letters and typography elements. Use soft, warm colors that enhance readability.",
    },
    {
      name: "letter-tiles",
      prompt: "Create attractive letter tiles with a modern, clean design. Include subtle shadows and depth effects.",
    },
    {
      name: "success-animation",
      prompt: "Design a word completion animation with letters coming together. Use dynamic movement and celebratory effects.",
    }
  ],
  'math-speed': [
    {
      name: "background",
      prompt: "Create an energetic background with subtle mathematical symbols and patterns. Use colors that promote focus and quick thinking.",
    },
    {
      name: "number-pad",
      prompt: "Design a modern, clean number pad interface with clear, readable numbers. Include hover and active states.",
    },
    {
      name: "timer-animation",
      prompt: "Create a smooth, non-distracting timer animation that shows remaining time. Use calming colors that don't induce stress.",
    }
  ],
  'simon-says': [
    {
      name: "background",
      prompt: "Design a fun, engaging background that complements the classic Simon Says game. Use subtle patterns that don't compete with the game elements.",
    },
    {
      name: "game-buttons",
      prompt: "Create four distinct, colorful game buttons with clear active and inactive states. Include lighting effects for when buttons are pressed.",
    },
    {
      name: "sequence-animation",
      prompt: "Design smooth transition effects for button sequences. Include both pressed and released states with appropriate lighting.",
    }
  ],
  'speed-typing': [
    {
      name: "background",
      prompt: "Create a clean, distraction-free background with subtle keyboard and typography elements. Use colors that reduce eye strain.",
    },
    {
      name: "word-display",
      prompt: "Design an attractive text display area with clear typography and smooth transitions between words.",
    },
    {
      name: "progress-indicator",
      prompt: "Create a modern, minimal progress indicator showing typing speed and accuracy. Use subtle animations for updates.",
    }
  ],
  'pufferfish': [
    {
      name: "pufferfish",
      prompt: "Create a cute, cartoony pufferfish character with a friendly expression. Use bright, cheerful colors and smooth shading.",
    },
    {
      name: "bubbles",
      prompt: "Design a set of transparent, iridescent bubbles with subtle reflections and highlights. Vary the sizes for visual interest.",
    },
    {
      name: "coral",
      prompt: "Create colorful coral reef elements with soft, organic shapes. Use warm colors that complement the underwater theme.",
    },
    {
      name: "seaweed",
      prompt: "Design flowing seaweed elements with gentle movement. Use various shades of green and blue for depth.",
    },
    {
      name: "smallFish",
      prompt: "Create small, colorful tropical fish designs that complement the pufferfish. Use bright, playful colors.",
    },
    {
      name: "predator",
      prompt: "Design a slightly intimidating but not scary predator fish. Use darker colors but maintain a cartoonish style.",
    },
    {
      name: "background",
      prompt: "Create a serene underwater background with subtle light rays and gentle gradients. Use calming blues and aqua tones.",
    }
  ]
};