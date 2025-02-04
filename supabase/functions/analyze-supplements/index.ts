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
    const { supplementName, supplementData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    // Prepare analysis prompt
    const analysisPrompt = `
      Analyze the following supplement data and provide insights:
      Supplement Name: ${supplementName}
      Usage Data: ${JSON.stringify(supplementData)}
      
      Please provide:
      1. Research summary
      2. Optimal timing suggestions
      3. Potential interaction warnings
      4. Effectiveness patterns analysis
      
      Format the response as a JSON object with these fields.
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
            content: 'You are an expert in supplement analysis and research. Provide detailed but concise analysis.'
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
    const analysis = JSON.parse(result.choices[0].message.content);

    // Store analysis in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('supplement_ai_analysis')
      .upsert({
        supplement_name: supplementName,
        research_summary: analysis.research_summary,
        optimal_timing_suggestion: analysis.optimal_timing,
        interaction_warnings: analysis.interaction_warnings,
        effectiveness_patterns: analysis.effectiveness_patterns,
        last_analyzed_at: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-supplements:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});