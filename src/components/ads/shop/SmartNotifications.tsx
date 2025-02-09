
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Bell, Settings, Users, TrendingUp, AlertTriangle, Clock, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect } from 'react'

interface SmartNotification {
  id: string
  vendor_id: string
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  created_at: string
}

interface BehaviorPattern {
  active_users: number
  engagement_rate: number
  response_rate: number
  peak_hours: number[]
  segments: Array<{
    name: string
    value: number
  }>
}

interface CustomerBehavior {
  id: string
  vendor_id: string
  behavior_patterns: BehaviorPattern
  customer_segments: {
    new: number
    returning: number
    inactive: number
  }
  revenue_trends: {
    daily: Array<{date: string, revenue: number}>
    weekly: Array<{week: string, revenue: number}>
    monthly: Array<{month: string, revenue: number}>
  }
}

export function SmartNotifications() {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: vendorId } = useQuery({
    queryKey: ['vendor-id', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendors')
        .select('id')
        .eq('claimed_by', session?.user?.id)
        .single()
      return data?.id
    },
    enabled: !!session?.user?.id
  })

  const { data: notifications, isLoading: notificationsLoading, refetch: refetchNotifications } = useQuery({
    queryKey: ['smart-notifications', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_smart_notifications')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SmartNotification[]
    },
    enabled: !!vendorId
  })

  const { data: behaviorAnalysis } = useQuery({
    queryKey: ['customer-behavior', vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_behavior_analysis')
        .select('*')
        .eq('vendor_id', vendorId)
        .single()
      if (error) throw error
      return data as CustomerBehavior
    },
    enabled: !!vendorId
  })

  // Subscribe to realtime notifications
  useEffect(() => {
    if (!vendorId) return

    const channel = supabase
      .channel('smart-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendor_smart_notifications',
          filter: `vendor_id=eq.${vendorId}`
        },
        () => {
          refetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [vendorId, refetchNotifications])

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('vendor_smart_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      })
    } else {
      refetchNotifications()
    }
  }

  const renderMetricCard = (icon: React.ReactNode, title: string, value: number | string, subtitle?: string) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <div>
              <p className="text-sm font-medium">{title}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderTimeBasedInsights = () => {
    if (!behaviorAnalysis?.behavior_patterns.peak_hours) return null

    const peakHours = behaviorAnalysis.behavior_patterns.peak_hours.map(hour => ({
      start: `${hour}:00`,
      end: `${hour + 1}:00`
    }))

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Peak Activity Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {peakHours.map((period, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium">{period.start} - {period.end}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Insights & Notifications
          </CardTitle>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="insights">Customer Insights</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <ScrollArea className="h-[400px] pr-4">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : notifications?.length ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          notification.is_read ? 'bg-muted' : 'bg-primary/5 hover:bg-primary/10'
                        }`}
                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {notification.content}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs capitalize ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No notifications yet</p>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="insights">
              {behaviorAnalysis ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {renderMetricCard(
                      <Users className="h-4 w-4 text-muted-foreground" />,
                      "Active Users",
                      behaviorAnalysis.behavior_patterns.active_users
                    )}
                    {renderMetricCard(
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />,
                      "Engagement Rate",
                      `${behaviorAnalysis.behavior_patterns.engagement_rate}%`
                    )}
                    {renderMetricCard(
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
                      "Response Rate",
                      `${behaviorAnalysis.behavior_patterns.response_rate}%`
                    )}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Segments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {behaviorAnalysis.behavior_patterns.segments?.map((segment) => (
                          <div key={segment.name} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{segment.name}</span>
                            <span className="text-sm text-muted-foreground">{segment.value} users</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {renderTimeBasedInsights()}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No insights available yet</p>
              )}
            </TabsContent>

            <TabsContent value="trends">
              {behaviorAnalysis?.revenue_trends ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {behaviorAnalysis.revenue_trends.monthly.map((month, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{month.month}</span>
                            <span className="text-sm text-muted-foreground">${month.revenue}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Segments Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">New Customers</span>
                          <span className="text-sm text-muted-foreground">
                            {behaviorAnalysis.customer_segments.new}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Returning Customers</span>
                          <span className="text-sm text-muted-foreground">
                            {behaviorAnalysis.customer_segments.returning}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Inactive Customers</span>
                          <span className="text-sm text-muted-foreground">
                            {behaviorAnalysis.customer_segments.inactive}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No trend data available yet</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
