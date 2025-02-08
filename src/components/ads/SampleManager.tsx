
import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"

export function SampleManager() {
  const { data: samples, isLoading } = useQuery({
    queryKey: ['vendor-samples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('free_samples')
        .select('*')
        .eq('vendor_id', 'CURRENT_VENDOR_ID') // Replace with actual vendor ID
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading samples...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Free Samples</CardTitle>
          <CardDescription>
            Manage free sample offers for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Create New Sample Offer</Button>
          
          <div className="space-y-4">
            {samples?.map((sample) => (
              <Card key={sample.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-semibold">Sample Offer #{sample.id.slice(0, 8)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sample.description}
                    </p>
                    <Badge>{sample.quantity} remaining</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={sample.active}
                      onCheckedChange={() => {}}
                    />
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
