
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function MarketplaceIntegration() {
  const { data: integrations } = useQuery({
    queryKey: ['marketplace-integrations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendor_social_integrations')
        .select('*')
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations?.map((integration) => (
              <div key={integration.id} className="border rounded p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{integration.platform}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    integration.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {integration.is_active ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Last synced: {new Date(integration.last_sync_at).toLocaleString()}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Settings</h4>
                  <pre className="mt-1 text-sm">
                    {JSON.stringify(integration.settings, null, 2)}
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
