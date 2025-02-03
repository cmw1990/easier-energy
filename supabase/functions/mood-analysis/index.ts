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
    const { moodData, sleepData, energyData, stressData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    // Prepare comprehensive analysis prompt
    const analysisPrompt = `
      Analyze the following user wellness data and provide insights and recommendations:
      Mood Data: ${JSON.stringify(moodData)}
      Sleep Data: ${JSON.stringify(sleepData)}
      Energy Data: ${JSON.stringify(energyData)}
      Stress Data: ${JSON.stringify(stressData)}
      
      Consider:
      1. Correlations between different metrics
      2. Pattern identification
      3. Potential triggers
      4. Lifestyle impact
      5. Circadian rhythm effects
      6. Social and environmental factors
      
      Provide:
      1. Key insights
      2. Actionable recommendations
      3. Lifestyle adjustments
      4. Preventive measures
      5. Optimization strategies
    `;

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
            content: 'You are an expert in behavioral psychology, sleep science, and wellness optimization. Provide comprehensive yet concise analysis and actionable recommendations.'
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
    console.error('Error in mood analysis:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});