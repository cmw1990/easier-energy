
import { useAuth } from "@/components/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TeaTracker() {
  const { session } = useAuth()

  const { data: logs, isLoading } = useQuery({
    queryKey: ['tea-logs'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from('herbal_tea_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('consumed_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!logs?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No tea intake logged yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tea History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{log.tea_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.amount_grams}g - {log.brewing_method}
                    </p>
                    {log.effects && log.effects.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {log.effects.map((effect, index) => (
                          <Badge key={index} variant="secondary">{effect}</Badge>
                        ))}
                      </div>
                    )}
                    {log.notes && (
                      <p className="mt-2 text-sm">{log.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={log.rating >= 4 ? "default" : "secondary"}>
                      Rating: {log.rating}/5
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.consumed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
