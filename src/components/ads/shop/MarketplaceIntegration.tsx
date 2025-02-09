
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { ArrowUpRight, ArrowDownRight, RefreshCw, Store, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MarketplaceIntegration() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['marketplace-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_platform_metrics')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['engagement-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_analytics')
        .select('*')
        .order('date', { ascending: true })
        .limit(30)
      
      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metrics?.[0]?.metrics_data.total_revenue || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all platforms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.[0]?.metrics_data.total_orders || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.[0]?.metrics_data.conversion_rate || '0'}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across platforms
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>
                30-day overview of engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="engagement_metrics.total_interactions" 
                      fill="#8884d8" 
                      name="Total Interactions"
                    />
                    <Bar 
                      dataKey="engagement_metrics.conversion_rate" 
                      fill="#82ca9d" 
                      name="Conversion Rate"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics?.map((platform) => (
              <Card key={platform.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {platform.platform_name}
                  </CardTitle>
                  <div className={`rounded-full p-1 ${
                    platform.sync_status === 'success' ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    <RefreshCw className={`h-4 w-4 ${
                      platform.sync_status === 'success' ? 'text-green-700' : 'text-amber-700'
                    }`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(platform.metrics_data).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{value}</span>
                          {typeof value === 'number' && value > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {(metricsLoading || analyticsLoading) && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
