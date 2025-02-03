import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const USDA_API_KEY = Deno.env.get('USDA_API_KEY');
const USDA_API_ENDPOINT = 'https://api.nal.usda.gov/fdc/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    console.log('Searching USDA database for:', query);
    
    const response = await fetch(
      `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('USDA API response received');
    
    // Transform the response to a simpler format
    const foods = data.foods?.map((food: any) => ({
      name: food.description,
      calories: food.foodNutrients.find((n: any) => n.nutrientName === 'Energy')?.value || 0,
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || 'g',
    })) || [];

    return new Response(
      JSON.stringify({ foods }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in food database search:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});