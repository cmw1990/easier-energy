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
    const { user_id, mood_data } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user's recent mood and activity data
    const { data: recentMoods } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Generate a personalized prompt based on user data
    let prompt = "Generate an inspiring and motivational quote that is";
    if (recentMoods && recentMoods.length > 0) {
      const averageMood = recentMoods.reduce((acc, curr) => acc + (curr.mood_score || 0), 0) / recentMoods.length;
      if (averageMood < 5) {
        prompt += " uplifting and encouraging for someone who might be feeling down";
      } else if (averageMood > 7) {
        prompt += " focused on maintaining positive momentum and growth";
      }
    }
    prompt += ". Make it concise and impactful.";

    // Generate quote using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert motivational speaker and life coach. Generate inspiring quotes that are original and impactful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    const generatedQuote = aiData.choices[0].message.content;

    // Store the generated quote
    const { data: savedQuote, error } = await supabase
      .from('motivation_quotes')
      .insert([
        {
          content: generatedQuote,
          author: 'AI Coach',
          category: 'personalized'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ quote: savedQuote }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});