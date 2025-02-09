
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"

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

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['smart-notifications', vendorId],
    queryFn: async () => {
      const { data } = await supabase
        .from('smart_notifications')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
      return data
    },
    enabled: !!vendorId
  })

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('smart_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Notifications
          </CardTitle>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications?.length ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.is_read ? 'bg-muted' : 'bg-primary/5'
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
        </CardContent>
      </Card>
    </div>
  )
}
