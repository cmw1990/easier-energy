import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gameType, assetType, description } = await req.json();
    console.log(`Generating assets for ${gameType} - ${assetType}`);

    // Initialize OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an AI specialized in generating game assets and visual elements.'
          },
          {
            role: 'user',
            content: `Generate ${gameType} game assets: ${description}`
          }
        ]
      })
    });

    const data = await openAIResponse.json();
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store the generated assets
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('game-assets')
      .upload(`${gameType}/${assetType}.png`, data.choices[0].message.content);

    if (uploadError) {
      throw uploadError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated and stored ${assetType} for ${gameType}`,
        data: uploadData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating game assets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});