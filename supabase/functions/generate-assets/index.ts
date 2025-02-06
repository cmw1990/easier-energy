
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Simple in-memory cache (resets when function cold starts)
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Rate limiting map
const rateLimits = new Map();
const RATE_LIMIT = 5; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRateData = rateLimits.get(userId) || { count: 0, timestamp: now };
  
  if (now - userRateData.timestamp > RATE_WINDOW) {
    // Reset if window has passed
    userRateData.count = 1;
    userRateData.timestamp = now;
  } else if (userRateData.count >= RATE_LIMIT) {
    return true;
  } else {
    userRateData.count++;
  }
  
  rateLimits.set(userId, userRateData);
  return false;
}

function getCacheKey(type: string, batch?: string, description?: string): string {
  return `${type}-${batch || ''}-${description || ''}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    // Parse request and get user ID from authorization header
    const auth = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!auth) {
      console.error('Missing authorization header');
      throw new Error('Missing authorization header');
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Invalid request body:', e);
      throw new Error('Invalid request body');
    }

    console.log('Request body:', body);
    const { type, batch, description, style } = body;
    
    // Check rate limit
    if (isRateLimited(auth)) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          details: 'Maximum 5 requests per minute allowed'
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check cache
    const cacheKey = getCacheKey(type, batch, description);
    const cachedResult = cache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION) {
      console.log('Returning cached result for:', cacheKey);
      return new Response(
        JSON.stringify(cachedResult.data),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let prompt;
    let customStyle;

    if (type === 'exercise-assets') {
      if (!batch) {
        throw new Error('Missing batch parameter for exercise assets');
      }
      prompt = `Professional illustration of ${batch.replace(/-/g, ' ')} eye exercise, showing eye movement pattern and proper technique, simple vector style, clean design`;
      customStyle = "clean vector illustration style with soft colors, medical illustration quality";
    } else if (type === 'meditation-backgrounds') {
      prompt = description || 'Serene and calming meditation background with soft, ethereal elements';
      customStyle = style || "ethereal, dreamlike, soft colors, minimalist zen style";
    } else {
      throw new Error('Invalid asset type');
    }

    // Generate image with optimized settings
    console.log('Generating image with DALL-E...');
    const finalPrompt = `${prompt} Style: ${customStyle}`;
    console.log('Using prompt:', finalPrompt);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const imageData = await response.json();
    console.log('Generated image data:', imageData);
    
    // Cache the successful result
    const result = { 
      url: imageData.data[0].url,
      message: 'Asset generated successfully'
    };
    
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    });

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-assets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: error.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
