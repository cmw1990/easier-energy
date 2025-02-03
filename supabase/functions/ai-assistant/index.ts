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
    let userPrompt = '';

    switch (type) {
      case 'sleep_habit_comparison':
        systemPrompt = 'You are a sleep pattern analyst specializing in comparing sleep habits with healthy benchmarks.';
        userPrompt = `Compare these sleep patterns with healthy benchmarks: ${JSON.stringify(data)}. Include specific areas of improvement and highlight positive habits.`;
        break;
      case 'sleep_environment_analysis':
        systemPrompt = 'You are an environmental sleep expert focusing on optimizing sleep spaces.';
        userPrompt = `Analyze the sleep environment factors from this data: ${JSON.stringify(data)}. Provide specific recommendations for creating an optimal sleep environment.`;
        break;
      case 'sleep_cycle_optimization':
        systemPrompt = 'You are a sleep cycle specialist focusing on optimizing sleep phases.';
        userPrompt = `Based on this sleep data: ${JSON.stringify(data)}, analyze sleep cycles and recommend optimal bedtime and wake times to maximize restorative sleep.`;
        break;
      case 'cognitive_impact_analysis':
        systemPrompt = 'You are a cognitive performance analyst specializing in sleep-cognition relationships.';
        userPrompt = `Analyze how sleep patterns are affecting cognitive performance: ${JSON.stringify(data)}. Provide insights on memory, focus, and decision-making impacts.`;
        break;
      case 'lifestyle_correlation':
        systemPrompt = 'You are a lifestyle-sleep correlation expert.';
        userPrompt = `Analyze correlations between lifestyle factors and sleep quality: ${JSON.stringify(data)}. Identify patterns and suggest lifestyle adjustments.`;
        break;
      case 'recovery_suggestions':
        systemPrompt = 'You are a sleep recovery specialist.';
        userPrompt = `Based on this sleep debt data: ${JSON.stringify(data)}, provide a detailed recovery plan to restore healthy sleep patterns.`;
        break;
      case 'next_day_preparation':
        systemPrompt = 'You are a next-day optimization specialist.';
        userPrompt = `Based on today's sleep data: ${JSON.stringify(data)}, provide recommendations for optimizing tomorrow's performance and well-being.`;
        break;
      case 'analyze_sleep':
        systemPrompt = 'You are a sleep analysis expert. Analyze the sleep data and provide actionable insights.';
        userPrompt = `Analyze this sleep data: ${JSON.stringify(data)}. Focus on patterns, duration, and quality. Provide specific recommendations for improvement.`;
        break;
      case 'sleep_recommendations':
        systemPrompt = 'You are a sleep optimization specialist. Based on the user\'s data, provide personalized sleep recommendations.';
        userPrompt = `Given this sleep history: ${JSON.stringify(data)}, provide detailed recommendations for improving sleep quality. Include bedtime routines, environmental factors, and lifestyle adjustments.`;
        break;
      case 'sleep_pattern_analysis':
        systemPrompt = 'You are a sleep pattern analyst. Identify trends and correlations in sleep data.';
        userPrompt = `Analyze these sleep patterns: ${JSON.stringify(data)}. Identify trends, irregularities, and potential factors affecting sleep quality. Suggest ways to optimize sleep schedule.`;
        break;
      case 'sleep_quality_prediction':
        systemPrompt = 'You are a sleep quality prediction model. Based on historical data and current factors, predict likely sleep quality.';
        userPrompt = `Using this historical sleep data and current factors: ${JSON.stringify(data)}, predict tonight's likely sleep quality and suggest preparations for optimal rest.`;
        break;
      case 'analyze_energy':
        systemPrompt = 'You are an energy management expert. Analyze energy patterns and provide recommendations.';
        userPrompt = `Analyze this energy data: ${JSON.stringify(data)}. Identify peak energy times and factors affecting energy levels.`;
        break;
      case 'analyze_focus':
        systemPrompt = 'You are a focus and productivity expert. Analyze focus session data and suggest improvements.';
        userPrompt = `Analyze this focus data: ${JSON.stringify(data)}. Provide insights on focus patterns and suggest optimization strategies.`;
        break;
      case 'daily_summary':
        systemPrompt = 'You are a wellness coach. Provide a comprehensive daily summary and personalized recommendations.';
        userPrompt = `Based on today's data: ${JSON.stringify(data)}, provide a holistic analysis of sleep, energy, and focus patterns. Include actionable recommendations for improvement.`;
        break;
      default:
        systemPrompt = 'You are a helpful wellness assistant.';
        userPrompt = JSON.stringify(data);
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
          { role: 'user', content: userPrompt }
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
