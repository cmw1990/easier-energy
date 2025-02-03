import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    let requestData;
    try {
      requestData = JSON.parse(rawBody);
      console.log('Parsed request data:', requestData);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid JSON in request body');
    }

    const { batch } = requestData;
    
    if (!batch) {
      console.error('Missing batch parameter');
      throw new Error('Missing batch parameter');
    }

    console.log(`Processing batch: ${batch}`);

    if (!GAME_ASSETS_CONFIG[batch]) {
      console.error(`Invalid batch type: ${batch}`);
      throw new Error(`Invalid batch type: ${batch}`);
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify OpenAI API key is set
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const assets = GAME_ASSETS_CONFIG[batch];
    const generatedAssets = [];

    for (const asset of assets) {
      console.log(`Generating asset: ${asset.name} for batch: ${batch}`);
      
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
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

        if (!openAIResponse.ok) {
          const errorData = await openAIResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await openAIResponse.json();
        console.log('OpenAI response:', data);
        
        if (!data.data?.[0]?.url) {
          throw new Error(`No image URL received for ${asset.name}`);
        }

        const imageUrl = data.data[0].url;
        console.log(`Successfully generated image for ${asset.name}`);

        // Download the image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image for ${asset.name}`);
        }
        
        const imageBlob = await imageResponse.blob();
        console.log(`Downloaded image for ${asset.name}, size: ${imageBlob.size} bytes`);

        // Upload to Supabase Storage
        const filePath = `${batch}/${asset.name}.png`;
        const { data: uploadData, error: uploadError } = await supabaseClient
          .storage
          .from('game-assets')
          .upload(filePath, imageBlob, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.error(`Upload error for ${asset.name}:`, uploadError);
          throw uploadError;
        }

        console.log(`Successfully uploaded ${asset.name} to storage`);

        // Get the public URL
        const { data: { publicUrl } } = supabaseClient
          .storage
          .from('game-assets')
          .getPublicUrl(filePath);

        generatedAssets.push({
          name: asset.name,
          url: publicUrl
        });

        console.log(`Successfully processed ${asset.name}`);
        
        // Add a small delay between generations to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error generating ${asset.name}:`, error);
        throw error;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${batch} assets generated and uploaded successfully`,
        assets: generatedAssets 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})

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
  ]
};
