
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Users, TrendingUp, MessageCircle } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function CustomerEngagement() {
  const { data: customerData, isLoading } = useQuery({
    queryKey: ['customer-behavior-analysis'],
    queryFn: async () => {
      const { data } = await supabase
        .from('customer_behavior_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-full">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerData?.[0]?.behavior_patterns.active_users || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-full">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <CardDescription>Average daily</CardDescription>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerData?.[0]?.behavior_patterns.engagement_rate || 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="w-full">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <CardDescription>Customer service</CardDescription>
                </div>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customerData?.[0]?.behavior_patterns.response_rate || 0}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Distribution of customer types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData?.[0]?.behavior_patterns.segments || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {customerData?.[0]?.behavior_patterns.segments?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior Analysis</CardTitle>
              <CardDescription>Recent patterns and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerData?.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <h3 className="font-medium">Engagement Patterns</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(item.behavior_patterns).map(([key, value]) => (
                        key !== 'segments' && (
                          <div key={key} className="flex justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
