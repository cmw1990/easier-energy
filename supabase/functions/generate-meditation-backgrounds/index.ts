import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getPromptForType = (type: string, title: string) => {
  const basePrompt = "Minimalist zen meditation scene. No people. Soft, ethereal lighting. ";
  
  const typePrompts = {
    mindfulness: "Serene natural elements like smooth stones, still water, or gentle ripples. Muted colors.",
    focus: "Clean geometric patterns, flowing lines, or a single focal point in nature. Calming blues and whites.",
    energy: "Dynamic but subtle natural elements like floating leaves or gentle light rays. Warm, energizing colors.",
    'stress-relief': "Peaceful landscape elements like clouds, waves, or sand patterns. Soft pastel colors.",
    sleep: "Night scene with gentle moonlight, stars, or aurora effects. Deep blues and purples.",
    advanced: "Abstract patterns inspired by nature, cosmic elements, or sacred geometry. Rich, deep colors.",
    therapeutic: "Healing natural elements like flowing water, gentle mist, or soft light. Soothing green and blue tones.",
    performance: "Dynamic but balanced composition with flowing elements. Vibrant but not overwhelming colors."
  };

  return `${basePrompt}${typePrompts[type] || ''} Style: Modern minimalist, universally appealing meditation visual for "${title}". High quality, peaceful atmosphere. No text, no symbols, no religious imagery.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sessionId, generateAll } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let sessions;
    if (generateAll) {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .is('background_image_url', null);
      
      if (error) throw error;
      sessions = data;
    } else {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      sessions = [data];
    }

    const results = [];
    for (const session of sessions) {
      try {
        console.log(`Generating background for session: ${session.title}`);
        
        const prompt = getPromptForType(session.type, session.title);
        console.log('Using prompt:', prompt);

        const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            style: "natural"
          }),
        });

        if (!openAiResponse.ok) {
          const errorData = await openAiResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const imageData = await openAiResponse.json();
        console.log('Image generated successfully for:', session.title);

        const { error: updateError } = await supabase
          .from('meditation_sessions')
          .update({ background_image_url: imageData.data[0].url })
          .eq('id', session.id);

        if (updateError) throw updateError;
        
        results.push({
          sessionId: session.id,
          title: session.title,
          success: true,
          url: imageData.data[0].url
        });

        // Add delay between generations to avoid rate limits
        if (sessions.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (sessionError) {
        console.error(`Error processing session ${session.title}:`, sessionError);
        results.push({
          sessionId: session.id,
          title: session.title,
          success: false,
          error: sessionError.message
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating meditation backgrounds:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});