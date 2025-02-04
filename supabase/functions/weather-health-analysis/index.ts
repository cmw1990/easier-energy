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
    const { weatherTriggers, moodLogs, conditions } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    const analysisPrompt = `
      Analyze the following health and weather data:
      Weather Triggers: ${JSON.stringify(weatherTriggers)}
      Mood Logs: ${JSON.stringify(moodLogs)}
      Health Conditions: ${JSON.stringify(conditions)}
      
      Consider:
      1. Weather patterns and their correlation with symptoms
      2. Preventive measures based on weather forecasts
      3. Lifestyle adjustments for weather-sensitive conditions
      4. Impact on energy levels and cognitive function
      5. Recommendations for managing symptoms
      
      Provide:
      1. Key insights about weather impacts
      2. Preventive strategies
      3. Lifestyle recommendations
      4. Warning signs to watch for
      5. Coping mechanisms
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in weather-related health conditions, particularly migraines and chronic conditions affected by weather changes. Provide comprehensive yet concise analysis and actionable recommendations.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const result = await response.json();
    
    return new Response(JSON.stringify({
      analysis: result.choices[0].message.content,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in weather health analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});