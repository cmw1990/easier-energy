
import React from 'react'
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/integrations/supabase/client"

export function CouponManager() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['vendor-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('vendor_id', 'CURRENT_VENDOR_ID') // Replace with actual vendor ID
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading coupons...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Coupons</CardTitle>
          <CardDescription>
            Create and manage discount coupons for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4">Create New Coupon</Button>
          
          <div className="space-y-4">
            {coupons?.map((coupon) => (
              <Card key={coupon.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-semibold">{coupon.code}</h4>
                    <p className="text-sm text-muted-foreground">
                      {coupon.description}
                    </p>
                    {coupon.discount_percentage ? (
                      <Badge>{coupon.discount_percentage}% off</Badge>
                    ) : (
                      <Badge>${coupon.discount_amount} off</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={coupon.active}
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
