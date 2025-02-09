
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function CustomerEngagement() {
  const { data: customerData } = useQuery({
    queryKey: ['customer-engagement'],
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
      <Card>
        <CardHeader>
          <CardTitle>Customer Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customerData?.map((item) => (
              <div key={item.id} className="p-4 border rounded">
                <h3 className="font-medium">Customer Analysis</h3>
                <pre className="mt-2 text-sm">
                  {JSON.stringify(item.behavior_patterns, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
