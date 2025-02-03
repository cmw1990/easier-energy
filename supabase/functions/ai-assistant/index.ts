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
    const { type, data } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    let systemPrompt = '';
    switch (type) {
      case 'analyze_sleep':
        systemPrompt = 'You are a sleep analysis expert. Analyze the sleep data and provide actionable insights.';
        break;
      case 'analyze_energy':
        systemPrompt = 'You are an energy management expert. Analyze the energy patterns and provide recommendations.';
        break;
      case 'analyze_focus':
        systemPrompt = 'You are a focus and productivity expert. Analyze the focus session data and suggest improvements.';
        break;
      case 'daily_summary':
        systemPrompt = 'You are a wellness coach. Provide a comprehensive daily summary and personalized recommendations.';
        break;
      default:
        systemPrompt = 'You are a helpful wellness assistant.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(data) }
        ],
      }),
    });

    const result = await response.json();
    
    return new Response(JSON.stringify({
      analysis: result.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});