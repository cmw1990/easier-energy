
import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"

export function AdAnalytics() {
  const { session } = useAuth()
  
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', session?.user?.id],
    queryFn: async () => {
      const { data: campaigns, error: campaignsError } = await supabase
        .from('sponsored_products')
        .select('*')
        .eq('sponsor_id', session?.user?.id)
        
      if (campaignsError) throw campaignsError
      return campaigns
    },
    enabled: !!session?.user?.id
  })

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['ad-analytics', campaigns?.map(c => c.id)],
    queryFn: async () => {
      if (!campaigns?.length) return []
      
      const { data, error } = await supabase
        .from('ad_impressions')
        .select(`
          sponsored_product_id,
          impressed_at,
          clicked_at,
          cost,
          sponsored_products (
            placement_type,
            budget,
            spent
          )
        `)
        .in('sponsored_product_id', campaigns.map(c => c.id))
        .order('impressed_at', { ascending: true })
      
      if (error) throw error
      return data
    },
    enabled: !!campaigns?.length
  })

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.length ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.filter(a => a.clicked_at).length ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.length 
                ? `${((analytics.filter(a => a.clicked_at).length / analytics.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics?.reduce((sum, a) => sum + (a.cost || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>
            View your campaign performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="impressed_at" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#8884d8"
                  name="Cost"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
