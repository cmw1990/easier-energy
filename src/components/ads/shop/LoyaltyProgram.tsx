
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function LoyaltyProgram() {
  const { data: programData } = useQuery({
    queryKey: ['loyalty-program'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendor_loyalty_programs')
        .select('*')
        .single()
      return data
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program</CardTitle>
        </CardHeader>
        <CardContent>
          {programData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{programData.program_name}</h3>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Tiers</h4>
                  <pre className="mt-1 text-sm">
                    {JSON.stringify(programData.tiers, null, 2)}
                  </pre>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Rewards</h4>
                  <pre className="mt-1 text-sm">
                    {JSON.stringify(programData.rewards, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <p>No loyalty program configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
