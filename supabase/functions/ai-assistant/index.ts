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
      case 'focus_optimization':
        systemPrompt = 'You are a focus and productivity expert specializing in optimizing cognitive performance.';
        userPrompt = `Analyze focus patterns and provide optimization strategies: ${JSON.stringify(data)}. Include specific techniques for improving focus.`;
        break;
      case 'energy_pattern_analysis':
        systemPrompt = 'You are an energy management specialist analyzing daily energy patterns.';
        userPrompt = `Based on this energy data: ${JSON.stringify(data)}, identify patterns and suggest optimal times for different activities.`;
        break;
      case 'productivity_insights':
        systemPrompt = 'You are a productivity analyst specializing in personal performance optimization.';
        userPrompt = `Analyze productivity patterns from this data: ${JSON.stringify(data)}. Provide actionable insights for improvement.`;
        break;
      case 'habit_formation_analysis':
        systemPrompt = 'You are a habit formation specialist focusing on behavioral psychology.';
        userPrompt = `Analyze habit formation patterns: ${JSON.stringify(data)}. Provide strategies for building and maintaining positive habits.`;
        break;
      case 'wellness_correlation':
        systemPrompt = 'You are a wellness correlation expert analyzing relationships between different health metrics.';
        userPrompt = `Analyze correlations between wellness factors: ${JSON.stringify(data)}. Identify patterns and suggest optimizations.`;
        break;
      case 'circadian_rhythm_analysis':
        systemPrompt = 'You are a circadian rhythm specialist focusing on biological clock optimization.';
        userPrompt = `Analyze circadian patterns from this data: ${JSON.stringify(data)}. Suggest ways to optimize daily rhythms.`;
        break;
      case 'stress_impact_analysis':
        systemPrompt = 'You are a stress management expert analyzing impact on performance.';
        userPrompt = `Analyze stress patterns and their impact: ${JSON.stringify(data)}. Provide stress management strategies.`;
        break;
      case 'recovery_optimization':
        systemPrompt = 'You are a recovery optimization specialist.';
        userPrompt = `Based on this recovery data: ${JSON.stringify(data)}, suggest optimal recovery strategies and timing.`;
        break;
      case 'performance_prediction':
        systemPrompt = 'You are a performance prediction model specializing in human potential.';
        userPrompt = `Using this performance data: ${JSON.stringify(data)}, predict potential performance patterns and suggest optimizations.`;
        break;
      case 'behavioral_patterns':
        systemPrompt = 'You are a behavioral pattern analyst specializing in habit optimization.';
        userPrompt = `Analyze these behavioral patterns: ${JSON.stringify(data)}. Identify trends and suggest improvements.`;
        break;
      case 'cognitive_load_analysis':
        systemPrompt = 'You are a cognitive load specialist focusing on mental resource management.';
        userPrompt = `Analyze cognitive load patterns: ${JSON.stringify(data)}. Suggest ways to optimize mental resource allocation.`;
        break;
      case 'attention_span_optimization':
        systemPrompt = 'You are an attention span optimization expert.';
        userPrompt = `Based on this attention data: ${JSON.stringify(data)}, provide strategies for improving attention span and focus duration.`;
        break;
      case 'mental_stamina_tracking':
        systemPrompt = 'You are a mental stamina specialist tracking cognitive endurance.';
        userPrompt = `Analyze mental stamina patterns: ${JSON.stringify(data)}. Suggest ways to build and maintain mental endurance.`;
        break;
      case 'focus_fatigue_analysis':
        systemPrompt = 'You are a focus fatigue analyst specializing in cognitive recovery.';
        userPrompt = `Analyze focus fatigue patterns: ${JSON.stringify(data)}. Provide strategies for managing and preventing mental fatigue.`;
        break;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Using the more powerful model for better analysis
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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