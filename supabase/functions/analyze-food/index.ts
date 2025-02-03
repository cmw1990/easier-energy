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
    const { imageUrl, mealType } = await req.json();

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
            content: 'You are a nutritionist AI that analyzes food images and provides detailed nutritional information and health insights.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: imageUrl
              },
              {
                type: 'text',
                text: `Please analyze this ${mealType} image and provide: 
                1. List of identified foods
                2. Estimated calories
                3. Macronutrient breakdown (protein, carbs, fat)
                4. Nutritional insights and recommendations
                5. How this meal might affect energy levels
                Format as JSON with these keys: foods, calories, protein, carbs, fat, insights, energyImpact`
              }
            ]
          }
        ]
      })
    });

    const analysis = await openAIResponse.json();
    
    return new Response(
      JSON.stringify({ analysis: analysis.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in food analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});