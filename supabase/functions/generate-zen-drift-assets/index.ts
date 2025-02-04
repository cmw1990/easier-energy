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

const carPrompts = [
  "A minimalist 3D sports car model in white, clean lines, zen aesthetic, front view, on transparent background, digital art",
  "A sleek 3D drift car design in pearl blue, simple elegant style, side view, on transparent background, digital art",
  "A modern 3D sports coupe in metallic silver, minimalist design, 3/4 view, on transparent background, digital art",
  "A futuristic 3D vehicle with flowing lines, iridescent finish, rear view, on transparent background, digital art",
  "A classic 3D sports car reimagined, rose gold finish, angular view, on transparent background, digital art",
  "An elegant 3D racing machine in chrome, harmony of power and grace, profile view, on transparent background, digital art",
  "A zen-inspired 3D supercar design, matte black finish, dynamic pose, on transparent background, digital art",
  "A peaceful 3D drift car concept, pearl white finish, studio lighting, on transparent background, digital art"
];

const backgroundPrompts = [
  "A serene 3D mountain road environment, cherry blossoms, misty peaks, low-poly art style",
  "A peaceful 3D countryside track, lavender fields, sunset lighting, low-poly style",
  "A mystical 3D forest circuit, dappled sunlight, zen atmosphere, low-poly design",
  "A coastal 3D mountain pass, ocean views, morning fog, low-poly aesthetic",
  "A Japanese garden-inspired 3D racetrack, water features, low-poly art",
  "A minimalist 3D circuit, zen rock gardens, morning mist, low-poly style",
  "A flowing 3D track through bamboo forests, soft lighting, low-poly design",
  "An abstract 3D racing environment, floating islands, pastel colors, low-poly art"
];

const effectPrompts = [
  "3D particle effect, ethereal drift smoke, soft pastels, on transparent background",
  "3D energy trail effect, glowing particles, peaceful colors, on transparent background",
  "3D motion blur effect, zen-inspired streaks, soft light, on transparent background",
  "3D light trail effect, neon accents, dreamy style, on transparent background",
  "3D energy ribbon effect, flowing curves, peaceful glow, on transparent background",
  "3D sakura petal effect, gentle motion, soft pink, on transparent background",
  "3D speed line effect, minimalist style, clean design, on transparent background",
  "3D drift smoke effect, fluid motion, peaceful aesthetic, on transparent background"
];

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  description: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed for ${description}:`, error)
      
      if (attempt === maxRetries) {
        throw error
      }
      
      await sleep(RETRY_DELAY * attempt)
    }
  }
  throw new Error(`All ${maxRetries} attempts failed for ${description}`)
}

async function checkExistingAssets(type: string): Promise<boolean> {
  try {
    console.log(`Checking for existing ${type} assets...`);
    const { data, error } = await supabase
      .storage
      .from('game-assets')
      .list(`zen-drift/${type}s`, {
        limit: 1,
      });

    if (error) {
      console.error(`Error checking ${type} assets:`, error);
      return false;
    }

    const hasAssets = data && data.length > 0;
    console.log(`${type} assets exist:`, hasAssets);
    return hasAssets;
  } catch (error) {
    console.error(`Error checking ${type} assets:`, error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    console.log('Starting Zen Drift assets generation with duplicate checking...')
    const assets: { [key: string]: string } = {}
    const errors: string[] = []
    const progress: { total: number; completed: number; current: string } = {
      total: carPrompts.length + backgroundPrompts.length + effectPrompts.length,
      completed: 0,
      current: ''
    }

    // Check for existing assets first
    const [hasCars, hasBackgrounds, hasEffects] = await Promise.all([
      checkExistingAssets('car'),
      checkExistingAssets('background'),
      checkExistingAssets('effect')
    ]);

    if (hasCars && hasBackgrounds && hasEffects) {
      console.log('All assets already exist, skipping generation');
      return new Response(
        JSON.stringify({ 
          message: 'Assets already exist', 
          status: 'skipped',
          details: 'All required assets are already present in storage'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    async function generateImage(prompt: string, index: number, type: string) {
      try {
        // Skip if assets of this type already exist
        const hasExisting = await checkExistingAssets(type);
        if (hasExisting) {
          console.log(`Skipping ${type} ${index + 1} - assets already exist`);
          progress.completed++;
          return null;
        }

        progress.current = `${type} ${index + 1}`
        console.log(`Generating ${progress.current} (${progress.completed + 1}/${progress.total})...`)
        
        const imageResponse = await retryOperation(
          async () => {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openAIApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: "dall-e-3",
                prompt: `${prompt}. Style: Digital art, peaceful and zen-inspired aesthetic, high quality, detailed`,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                response_format: "url",
              }),
            })

            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
            }

            return response.json()
          },
          `generating ${type} ${index + 1}`
        )

        if (!imageResponse.data?.[0]?.url) {
          throw new Error('No image URL in OpenAI response')
        }

        const imageUrl = imageResponse.data[0].url
        const filePath = `zen-drift/${type}s/${type}_${index + 1}.png`
        
        const imageBlob = await retryOperation(
          async () => {
            const response = await fetch(imageUrl)
            if (!response.ok) {
              throw new Error('Failed to download image')
            }
            return response.blob()
          },
          `downloading ${type} ${index + 1}`
        )
        
        const { data: uploadData, error: uploadError } = await retryOperation(
          async () => supabase
            .storage
            .from('game-assets')
            .upload(filePath, imageBlob, {
              contentType: 'image/png',
              upsert: true
            }),
          `uploading ${type} ${index + 1}`
        )

        if (uploadError) {
          throw uploadError
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('game-assets')
          .getPublicUrl(filePath)
        
        assets[`${type}_${index + 1}`] = publicUrl
        progress.completed++
        console.log(`Successfully generated and uploaded ${type} ${index + 1} (${progress.completed}/${progress.total})`)
        return publicUrl
      } catch (error) {
        console.error(`Error processing ${type} ${index + 1}:`, error)
        errors.push(`${type} ${index + 1}: ${error.message}`)
        progress.completed++
        return null
      }
    }

    // Generate assets only if they don't exist
    if (!hasCars) {
      for (let i = 0; i < carPrompts.length; i++) {
        const result = await generateImage(carPrompts[i], i, 'car')
        if (result === null) continue
        await sleep(1000)
      }
    }

    if (!hasBackgrounds) {
      for (let i = 0; i < backgroundPrompts.length; i++) {
        const result = await generateImage(backgroundPrompts[i], i, 'background')
        if (result === null) continue
        await sleep(1000)
      }
    }

    if (!hasEffects) {
      for (let i = 0; i < effectPrompts.length; i++) {
        const result = await generateImage(effectPrompts[i], i, 'effect')
        if (result === null) continue
        await sleep(1000)
      }
    }

    const successCount = Object.keys(assets).length
    const totalNeeded = (!hasCars ? carPrompts.length : 0) + 
                       (!hasBackgrounds ? backgroundPrompts.length : 0) + 
                       (!hasEffects ? effectPrompts.length : 0)
    const failureCount = errors.length

    const response = {
      status: successCount > 0 || (hasCars && hasBackgrounds && hasEffects) ? 'success' : 'error',
      message: `Generated ${successCount}/${totalNeeded} new assets${failureCount > 0 ? ` (${failureCount} failed)` : ''}`,
      assets,
      errors: errors.length > 0 ? errors : undefined,
      statistics: {
        existing: {
          cars: hasCars,
          backgrounds: hasBackgrounds,
          effects: hasEffects
        },
        new: {
          total: totalNeeded,
          successful: successCount,
          failed: failureCount,
          completionRate: totalNeeded > 0 ? `${Math.round((successCount / totalNeeded) * 100)}%` : '100%'
        }
      }
    }

    console.log('Asset generation completed:', response)
    
    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: successCount > 0 || (hasCars && hasBackgrounds && hasEffects) ? 200 : 500
      }
    )

  } catch (error) {
    console.error('Fatal error generating assets:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
