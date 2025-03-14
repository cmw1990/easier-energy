
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

interface AdBlockPayload {
  userId: string
  url: string
  requestType: string
  timestamp: string
}

interface AdBlockResponse {
  shouldBlock: boolean
  reason?: string
  ruleId?: string
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload: AdBlockPayload = await req.json()
    const { userId, url, requestType } = payload

    // Get user's options
    const { data: options } = await supabaseClient
      .from('ad_blocking_options')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!options || !options.network_filtering) {
      return new Response(
        JSON.stringify({ shouldBlock: false, reason: 'Network filtering disabled' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check exceptions first
    const { data: exceptions } = await supabaseClient
      .from('ad_blocking_exceptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .lte('expiry_date', new Date().toISOString())
      .single()

    if (exceptions) {
      return new Response(
        JSON.stringify({ shouldBlock: false, reason: 'Domain excepted' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get active filter lists for the user
    const { data: filterLists } = await supabaseClient
      .from('user_filter_subscriptions')
      .select(`
        filter_list_id,
        ad_blocking_filter_lists (
          url,
          rules_count
        )
      `)
      .eq('user_id', userId)
      .eq('is_enabled', true)

    // Check rules from filter lists
    if (filterLists?.length) {
      for (const subscription of filterLists) {
        // In a real implementation, we would fetch and cache rules from the filter list URLs
        // For now, we'll just simulate checking against the rules count
        if (Math.random() < subscription.ad_blocking_filter_lists.rules_count / 10000) {
          // Update stats
          const today = new Date().toISOString().split('T')[0]
          await supabaseClient.rpc('increment_ad_block_stats', {
            user_id: userId,
            block_date: today,
            ads_inc: 1,
            bandwidth_inc: 5000, // Estimate 5KB per blocked ad
            time_inc: 1 // Estimate 1 second saved per blocked ad
          })

          return new Response(
            JSON.stringify({
              shouldBlock: true,
              reason: `Matched filter list rule`,
              ruleId: subscription.filter_list_id
            }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Check custom rules
    const { data: rules } = await supabaseClient
      .from('ad_blocking_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false })

    // Evaluate rules
    for (const rule of rules || []) {
      const pattern = new RegExp(rule.pattern)
      if (pattern.test(url)) {
        // Update stats
        const today = new Date().toISOString().split('T')[0]
        await supabaseClient.rpc('increment_ad_block_stats', {
          user_id: userId,
          block_date: today,
          ads_inc: 1,
          bandwidth_inc: 5000, // Estimate 5KB per blocked ad
          time_inc: 1 // Estimate 1 second saved per blocked ad
        })

        return new Response(
          JSON.stringify({
            shouldBlock: true,
            reason: `Matched rule: ${rule.description || rule.pattern}`,
            ruleId: rule.id
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ shouldBlock: false }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
