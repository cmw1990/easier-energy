import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    let requestData;
    
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new Error('Invalid JSON in request body');
    }

    const { type, data } = requestData;
    if (!type || !data) {
      throw new Error('Missing required fields: type and data');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced system prompts for shift work analysis
    const systemPrompts: Record<string, string> = {
      energy_pattern_analysis: `You are an expert in shift work adaptation and energy management. 
        Analyze the user's shift pattern, sleep quality, and energy levels to provide actionable recommendations. 
        Focus on optimizing their energy levels throughout their shift.`,
      circadian_rhythm_analysis: `You are a circadian rhythm specialist with expertise in shift work adaptation. 
        Analyze the user's shift schedule and provide specific guidance for maintaining healthy sleep-wake patterns. 
        Consider their rotation schedule and natural light exposure.`
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[type] || 'You are an AI assistant specializing in sleep and energy analysis.'
          },
          { 
            role: 'user', 
            content: `Analyze this data and provide specific recommendations: ${JSON.stringify(data)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return new Response(JSON.stringify({
      analysis: result.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});