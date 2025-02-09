
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function SmartNotifications() {
  const { data: rules } = useQuery({
    queryKey: ['notification-rules'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendor_notification_rules')
        .select('*')
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules?.map((rule) => (
              <div key={rule.id} className="border rounded p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{rule.rule_name}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    rule.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Event Type: {rule.event_type}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Conditions</h4>
                  <pre className="mt-1 text-sm">
                    {JSON.stringify(rule.conditions, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
