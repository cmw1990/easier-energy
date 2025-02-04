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
    const { user_id } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check user's subscription tier
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .eq('user_id', user_id)
      .single();

    const isPremium = subscription?.tier === 'premium';

    if (isPremium) {
      // Get user's recent mood and activity data for personalization
      const { data: recentMoods } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Generate personalized prompt based on user data
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

      // Generate personalized quote using OpenAI
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

      return new Response(JSON.stringify({ quote: savedQuote, tier: 'premium' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // For free tier users, get a pre-generated quote or daily quote
      const today = new Date().toISOString().split('T')[0];
      
      // Try to get today's generated quote first
      const { data: dailyQuote } = await supabase
        .from('motivation_quotes')
        .select('*')
        .eq('category', 'daily')
        .gte('created_at', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (dailyQuote) {
        return new Response(JSON.stringify({ quote: dailyQuote, tier: 'free' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If no daily quote, generate one for all free users
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
              content: 'Generate an inspiring daily motivational quote that is general and applicable to everyone.'
            }
          ],
        }),
      });

      const aiData = await openAIResponse.json();
      const generatedQuote = aiData.choices[0].message.content;

      // Store the daily quote
      const { data: savedQuote, error } = await supabase
        .from('motivation_quotes')
        .insert([
          {
            content: generatedQuote,
            author: 'Daily Inspiration',
            category: 'daily'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ quote: savedQuote, tier: 'free' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error generating quote:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});